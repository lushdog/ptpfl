const fetch = require('node-fetch'),
	discord = require('discord.js'),
	utils = require('../../utils');

const getDiscordClient = (() => {
	let discordClient;

	return async discordWebhookUrl => {
		if(discordClient) {
			return new Promise(resolve => resolve(discordClient));;
		}

		return fetch(discordWebhookUrl)
			.then(response => response.json())
			.then(json => new Promise((resolve, reject) => {
				discordClient = new discord.WebhookClient(json.id, json.token);
				resolve(discordClient);
			}));
	};
})();

module.exports = async ({ torrent, authKey, passKey }, config) => {
	const webhook = await getDiscordClient(config.discordWebhookUrl);

	const download = `https://passthepopcorn.me/torrents.php?action=download&id=${torrent.Id}&authkey=${authKey}&torrent_pass=${passKey}`,
		permalink = `https://passthepopcorn.me/torrents.php?id=${torrent.GroupId}&torrentid=${torrent.Id}`;

	const embed = new discord.RichEmbed()
		.setDescription(torrent.ReleaseName)
		.addField('Source', torrent.Source, true)
		.addField('Codec', torrent.Codec, true)
		.addField('Resolution', torrent.Resolution, true)
		.addField('Size', utils.formatBytes(torrent.Size), true)
		.addField('Seeders', torrent.Seeders, true)
		.addField('Leechers', torrent.Leechers, true)
		.addField('Torrent Permalink', `[Click Here](${permalink})`, true)
		.addField('Download URL', `[Click Here](${download})`, true);

	webhook.send(embed);
};
