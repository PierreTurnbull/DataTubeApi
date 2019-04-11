const fs = require('fs')
const chalk = require('chalk')

;(async() => {
  try {
    await fs.readdir('./src/entities', (err, fileNames) => {
      fileNames.forEach(fileName => {
        const path = `./src/entities/${fileName}`
        const newPath = `./src/entities/${fileName.replace('.ts', '.entity.ts')}`

        // if the file has already been formatted, do not format it again
        if (path.indexOf('.entity') !== -1) { return }

        const bufferSize = 10000
        let file = fs.openSync(path, 'r+')
        let buffer = new Buffer.alloc(bufferSize)
        fs.readSync(file, buffer, 0, bufferSize)
        let bufferString = buffer.toString().replace(/\0/g, '')

        // format plural for words ending with 'y'
        bufferString = bufferString
          .replace('ys,', 'ies,')
          .replace('ys:', 'ies:')
          .replace('ys)', 'ies)')

        // format import paths
          .replace(/import { [a-zA-Z]* } from '\.\/[a-zA-Z_]*/g, `$&.entity`)

        // write file
        fs.writeFileSync(path, bufferString, 'utf8')

        // format file name
        fs.rename(path, newPath, error => {
          if (error) { throw error }
        })
      })
    })
  } catch (error) {
    console.log(chalk.red('ERROR:'), error.message)
    process.exit(1)
  }
})()
