const app = require('./src')
const schedule = require('node-schedule')
const RUN_ENV = process.env.RUN_ENV
const interval = require(RUN_ENV === 'docker' ? '/config/config.json' : './config.json').interval

let index = 1
const scheduleJob = async () => { 
  console.log(index)
  index ++
  await app()
}

schedule.scheduleJob(`*/${interval} * * * *`, scheduleJob)
