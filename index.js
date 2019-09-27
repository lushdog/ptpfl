const app = require('./src')
const schedule = require('node-schedule')
const { interval } = require('./config.json')

let index = 1
const scheduleJob = async () => { 
  console.log(index)
  index ++
  await app()
}

schedule.scheduleJob(`*/${interval} * * * *`, scheduleJob)
