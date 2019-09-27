const app = require('./src')
const schedule = require('node-schedule')
const { interval } = require('./config.json')

const index = 1
const scheduleJob = async () => { 
  console.log(index)
  index++
  await app() 
}

const job  = schedule.scheduleJob(`*/${interval} * * * *`, scheduleJob)
