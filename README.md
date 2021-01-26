## [中文](https://github.com/lushdog/ptpfl/blob/master/README.zh-CN.md)
## [Docker运行](https://github.com/lushdog/ptpfl/blob/master/README.docker.md)

# PassThePopcorn Freeleech Automator

A node.js script that automates the downloading of PassThePopcorn freeleech torrents.

### To install

`npm install pm2 -g`

`npm install`

Copy `example.config.json` to `config.json` and fill in your apiUser and apiKey credentials from your user profile.

Add a `downloadPath` to `config.json` to have the torrents added to your torrent client's watch directory.

### To run

`pm2 start index.js`

### Log

`pm2 log index`

### Discord notifications

Create a Webhook URL for a Discord channel and place it as `discordWebhookUrl` in your config file to be notified of grabbed torrents.

### Configuration

Configuration options with defaults shown

```javascript
{
  "apiUser": "", // apiUser credential found in PTP profile security tab.
  "apiKey": "", // apiKey credential found in PTP profile security tab.
  "minseeders": -1, // Minimum amount of seeders. Set to -1 for unlimited.
  "maxseeders": -1, // Maximum amount of seeders. Set to -1 for unlimited.
  "minleechers": -1, // Minimum amount of leechers. Set to -1 for unlimited.
  "maxleechers": -1, // Maximum amount of leechers. Set to -1 for unlimited.
  "minsize": -1, // Minimum size in megabytes. Set to -1 for unlimited.
  "maxsize": -1, // Maximum size in megabytes. Set to -1 for unlimited.
  "maxAge": -1, // Maximum time in minutes since torrent was uploaded. See below note.
  "downloadPath": "", // Path to download .torrent files to. Optional.
  "discordWebhookUrl": "", // Discord webhook URI. Optional.
  "interval": 15,// Download interval.
  "GoldenPopcorn": true, // Download all GoldenPopcorn.
  "page": 1, // page
  "matchByAgeAndMaxSeeders": [
    { "maxAge": 600, "maxSeeders": 5 },
    { "maxAge": 1200, "maxSeeders": 2 }
  ] // For new Freeleeh which uploaded some time ago but had a few seeders. 
}
```

#### maxAge

Set `maxAge` to filter freeleech torrents by upload date, in minutes. Be aware that some torrents are given freeleech status well after initial upload, & in this case those torrents may not be filtered if this config is set.
