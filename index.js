const app = require('./src')
const schedule = require('node-schedule')
const { interval } = require('./config.json')

const scheduleJob = async () => await app()

const job  = schedule.scheduleJob(`*/${interval} * * * *`, scheduleJob)
