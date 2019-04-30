require('dotenv').config()
const chalk = require('chalk')
const exec = require('child_process').exec;

;(async() => {
  try {
    exec(`mysql -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} < db.sql && mysql -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} -e "SET NAMES 'utf8mb4'"`, {}, (error) => {
      if (error) {
        throw error
      }
    })
  } catch (error) {
    console.log(chalk.red('ERROR:'), error.message)
    process.exit(1)
  }
})()
