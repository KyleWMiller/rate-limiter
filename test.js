const request = require('request'),
  CronJob = require('cron').CronJob,
  tester = new CronJob('*/3 * * * * *', () => {
    request('http://localhost:3333/get/aJob', (err, response) => {
      if(err) throw err.msg

      console.log('response: ', response.statusCode)
      if(response.statusCode === 401) {
        console.log('trids this endpoint too many times, try different endpoint')
      } else {
        let output = JSON.parse(response.body)
        console.log('msg', output.msg)
      }
    })
  }, null, false, 'America/New_York')

tester.start()
