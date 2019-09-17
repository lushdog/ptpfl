const fetch = require('node-fetch'),
	utils = require('./utils');

module.exports = async function() {
	try {
		const config = utils.getConfig(),
			{ torrents, authKey, passKey } = await utils.fetchTorrents(config.apiUser, config.apiKey);

		for (const torrent of torrents) {
			if(utils.shouldDownloadTorrent(torrent)) {
				await utils.downloadTorrent(torrent, authKey, passKey);
			}
		}

		utils.writeTorrentCache(torrents);
	} catch(error) {
		console.log(error);
	}
};
