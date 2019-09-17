# PassThePopcorn Freeleech Automator

A node.js script that automates the downloading of PassThePopcorn freeleech torrents.

### To install

`npm install`

Copy `example.config.json` to `config.json` and fill in your apiUser and apiKey credentials from your user profile.

Add a `downloadPath` to `config.json` to have the torrents added to your torrent client's watch directory.

### To run

`npm start`

### Discord notifications

Create a Webhook URL for a Discord channel and place it as `discordWebhookUrl` in your config file to be notified of grabbed torrents.
