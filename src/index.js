const { validateConfig, fetchTorrents, torrentMatchesFilters, writeTorrentCache } = require('./utils'),
	sendDiscordNotification = require('./modules/discord'),
	downloadTorrent = require('./modules/download');

module.exports = async function() {
	try {
		const config = await validateConfig(),
			{ torrents, authKey, passKey } = await fetchTorrents(config.apiUser, config.apiKey);

		for (const torrent of torrents) {
			if(torrentMatchesFilters(torrent, config)) {
				if(config.downloadPath) {
					await downloadTorrent({ torrent, authKey, passKey }, config);
				}
				
				if(config.discordWebhookUrl) {
					await sendDiscordNotification({ torrent, authKey, passKey }, config);
				}
			}
		}

		writeTorrentCache(torrents);
	} catch(error) {
		console.log(error);
	}
}
