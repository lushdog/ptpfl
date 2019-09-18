const path = require('path'),
	fs = require('fs'),
	fetch = require('node-fetch'),
	importFresh = require('import-fresh'),
	directoryExists = require('directory-exists');

const configPath = path.join(__dirname, '../../config.json'),
	cachePath = path.join(__dirname, '../../data/cache.json'),
	freeleechEndpoint = 'https://passthepopcorn.me/torrents.php?freetorrent=1&grouping=0&json=noredirect';

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

exports.writeTorrentCache = torrents => {
	const cache = {
		freeleech: torrents.map(torrent => torrent.Id)
	};

	fs.writeFileSync(cachePath, JSON.stringify(cache), {
		encoding: 'utf8'
	});
};

exports.validateConfig = async () => {
	const config = getConfig(),
		error = 'Specified downloadPath directory does not exist. Please check your config.';

	if(!config.downloadPath) return config;

	const folderExists = await directoryExists(config.downloadPath);

	if(!folderExists) {
		console.log(error);
		process.exit();
	}

	return config;
};

const getTorrentsFromResponse = data => {
	return data.Movies.map(group => {
		const torrent = group.Torrents[0];

		torrent.Seeders = Number(torrent.Seeders);
		torrent.Leechers = Number(torrent.Leechers);
		torrent.Size = Number(torrent.Size);
		torrent.GroupId = group.GroupId;

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
		const response = await fetch(freeleechEndpoint, {
			headers: {
				'ApiUser': apiUser,
				'ApiKey': apiKey
			}
		});

		await checkStatus(response);

		const json = await response.json(),
			torrents = getTorrentsFromResponse(json);

		return { torrents, authKey: json.AuthKey, passKey: json.PassKey };
	} catch(error) {

		console.log(error);
		process.exit();
	}
};

const isOlderThan = (date, minutes) => {
	const earliest = 1000 * minutes * 60,
		time = Date.now() - earliest;
	
	return new Date(date) < time;
};

exports.torrentMatchesFilters = (torrent, config) => {
	let isMatch = true;

	const cache = getCache();

	if(cache.freeleech.includes(torrent.Id)) {
		return false;
	}

	if(config.minSeeders !== -1 && torrent.Seeders <= config.minSeeders) {
		isMatch = false;
	}

	if(config.maxSeeders !== -1 && torrent.Seeders >= config.maxSeeders) {
		isMatch = false;
	}

	if(config.minLeechers !== -1 && torrent.Leechers <= config.minLeechers) {
		isMatch = false;
	}

	if(config.maxLeechers !== -1 && torrent.Leechers >= config.maxLeechers) {
		isMatch = false;
	}

	if(config.minSize !== -1 && torrent.Size <= config.minSize) {
		isMatch = false;
	}

	if(config.maxSize !== -1 && torrent.Size >= config.maxSize) {
		isMatch = false;
	}

	if(config.maxAge !== -1 && isOlderThan(torrent.UploadTime, config.maxAge)) {
		isMatch = false;
	}

	return isMatch;
};

exports.formatBytes = bytes =>{
	if(bytes === 0){
		return '0 B';
	}

	const k = 1024,
		sizes = [ 'B', 'KB', 'MB', 'GB', 'TB', 'PB' ],
		i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};
