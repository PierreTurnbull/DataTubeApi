require('dotenv').config()
const chalk = require('chalk')
const exec = require('child_process').exec;

;(async() => {
  try {
    exec(`mysql -u ${process.env.DB_USER} -p < db.sql`, {}, (error) => {
      if (error) {
        throw error
      }
    })
  } catch (error) {
    console.log(chalk.red('ERROR:'), error.message)
    process.exit(1)
  }
})()
