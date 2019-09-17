const path = require('path'),
	fs = require('fs'),
	fetch = require('node-fetch'),
	importFresh = require('import-fresh'),
	directoryExists = require('directory-exists');

const configPath = path.join(__dirname, '../../config.json'),
	cachePath = path.join(__dirname, '../../data/cache.json');

const getConfig = () => {
	try {
		return importFresh(configPath);
	} catch(error) {
		if(error.message.includes('Cannot find module')) {
			console.log('Please ensure you\'ve created and filled in the config.json file');

			process.exit();
		}
	}
};

const getCache = () => {
	try {
		return importFresh(cachePath);
	} catch(error) {
		if(error.message.includes('Cannot find module')) {
			return { freeleech: [] };
		}

		console.log(error);
		process.exit();
	}
};

exports.getCache = getCache;
exports.getConfig = getConfig;

exports.writeTorrentCache = torrents => {
	const cache = {
		freeleech: torrents.map(torrent => torrent.Id)
	};

	fs.writeFileSync(cachePath, JSON.stringify(cache), {
		encoding: 'utf8'
	});
};

exports.validateConfig = async () => {
	const config = getConfig();

	if(config.downloadPath === '') {
		console.log('Specified downloadPath directory does not exist. Please check your config.');
		process.exit();
	}
	
	const folderExists = await directoryExists(config.downloadPath);

	if(!folderExists) {
		console.log('Specified downloadPath directory does not exist. Please check your config.');
		process.exit();
	}
};

const getTorrentsFromResponse = data => {
	return data.Movies.map(group => {
		const torrent = group.Torrents[0];

		torrent.Seeders = Number(torrent.Seeders);
		torrent.Leechers = Number(torrent.Leechers);
		torrent.Size = Number(torrent.Size);

		return torrent;
	});
};

const checkStatus = response => new Promise((resolve, reject) => {
	if (response.status >= 200 && response.status < 300) {
		resolve(response);
	} else {
		const error = new Error(response.statusText);
		error.response = response;
		reject(error);
	}
});

exports.fetchTorrents = async (apiUser, apiKey) => {
	if(!apiUser || !apiKey) {
		console.log('Please ensure you\'ve added your ApiUser and ApiKey details from your PTP profile to the config file. See the example config file for details.');
		process.exit();
	}

	try {
		return await fetch('https://passthepopcorn.me/torrents.php?freetorrent=1&grouping=0&json=noredirect', {
			headers: {
				'ApiUser': apiUser,
				'ApiKey': apiKey
			}
		}).then(checkStatus).then(response => response.json()).then(json => new Promise((resolve, reject) => {
			const torrents = getTorrentsFromResponse(json);
			resolve({ torrents, authKey: json.AuthKey, passKey: json.PassKey });
		})).catch(error => console.log(error));
	} catch(error) {

		console.log(error);
		process.exit();
	}
};

exports.shouldDownloadTorrent = torrent => {
	let shouldDownload = true;

	const config = getConfig(),
		cache = getCache();

	if(cache.freeleech.includes(torrent.Id)) {
		return false;
	}

	if(config.minSeeders !== -1 && torrent.Seeders <= config.minSeeders) {
		shouldDownload = false;
	}

	if(config.maxSeeders !== -1 && torrent.Seeders >= config.maxSeeders) {
		shouldDownload = false;
	}

	if(config.minLeechers !== -1 && torrent.Leechers <= config.minLeechers) {
		shouldDownload = false;
	}

	if(config.maxLeechers !== -1 && torrent.Leechers >= config.maxLeechers) {
		shouldDownload = false;
	}

	if(config.minSize !== -1 && torrent.Size <= config.minSize) {
		shouldDownload = false;
	}

	if(config.maxSize !== -1 && torrent.Size >= config.maxSize) {
		shouldDownload = false;
	}

	return shouldDownload;
};

const downloadTorrentFile = async (torrent, path, authKey, passKey) => {
	const url = `https://passthepopcorn.me/torrents.php?action=download&id=${torrent.Id}&authkey=${authKey}&torrent_pass=${passKey}`,
		response = await fetch(url),
		fileStream = fs.createWriteStream(`${path}/${torrent.Id}.torrent`);

	await new Promise((resolve, reject) => {
		response.body.pipe(fileStream);
		response.body.on("error", (err) => {
			reject(err);
		});
		fileStream.on("finish", function() {
			resolve();
		});
	});
};

exports.downloadTorrent = async (torrent, downloadPath, authKey, passKey) => {
	try {
		return await downloadTorrentFile(torrent, downloadPath, authKey, passKey);
	} catch(error) {
		console.log('Could not download torrent:', error);
	}
};
