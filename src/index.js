const utils = require('./utils'),
	sendDiscordNotification = require('./modules/discord');

module.exports = async function() {
	try {
		const config = await utils.validateConfig(),
			{ torrents, authKey, passKey } = await utils.fetchTorrents(config.apiUser, config.apiKey);

		for (const torrent of torrents) {
			if(utils.shouldDownloadTorrent(torrent, config)) {
				await utils.downloadTorrent(torrent, config.downloadPath, authKey, passKey);
				
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
