const fetch = require('node-fetch'),
	discord = require('discord.js');

const formatBytes = bytes =>{
	if(bytes === 0){
		return '0 B';
	}

	const k = 1024,
		sizes = [ 'B', 'KB', 'MB', 'GB', 'TB', 'PB' ],
		i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

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
		.addField('Size', formatBytes(torrent.Size), true)
		.addField('Seeders', torrent.Seeders, true)
		.addField('Leechers', torrent.Leechers, true)
		.addField('Torrent Permalink', `[Click Here](${permalink})`, true)
		.addField('Download URL', `[Click Here](${download})`, true);

	webhook.send(embed);
};
