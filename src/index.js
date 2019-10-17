const { validateConfig, fetchTorrents, torrentMatchesFilters, writeTorrentCache } = require('./utils'),
	sendDiscordNotification = require('./modules/discord'),
	downloadTorrent = require('./modules/download');

module.exports = async function() {
	try {
		const config = await validateConfig()
		const	{ torrents, authKey, passKey, totalResults } = await fetchTorrents(config.apiUser, config.apiKey);
		const pageNum = Math.ceil(totalResults/50)
		if (pageNum >= 2) {
			for (let index = 2; index <= pageNum; index++) {
				const result = await fetchTorrents(config.apiUser, config.apiKey, index);
				torrents.push(...result.torrents);
			}
		}
		for (const torrent of torrents) {
			if (torrentMatchesFilters(torrent, config)) {
				await downloadTorrent({ torrent, authKey, passKey }, config);

				await sendDiscordNotification({ torrent, authKey, passKey }, config);
			}
		}

		writeTorrentCache(torrents);
	} catch(error) {
		console.log(error);
	}
}
