const utils = require('./utils'),
	sendDiscordNotification = require('./modules/discord'),
	downloadTorrent = require('./modules/download');

module.exports = async function() {
	try {
		const config = await utils.validateConfig(),
			{ torrents, authKey, passKey } = await utils.fetchTorrents(config.apiUser, config.apiKey);

		for (const torrent of torrents) {
			if(utils.torrentMatchesFilters(torrent, config)) {
				if(config.downloadPath) {
					await downloadTorrent({ torrent, authKey, passKey }, config);
				}
				
				if(config.discordWebhookUrl) {
					await sendDiscordNotification({ torrent, authKey, passKey }, config);
				}
			}
		}

		utils.writeTorrentCache(torrents);
	} catch(error) {
		console.log(error);
	}
}
