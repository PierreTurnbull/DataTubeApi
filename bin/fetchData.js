// load global constants from .env
require('dotenv').config()

const fetch = require('node-fetch')
const chalk = require('chalk')
const URLQueryBuilder = require('url-query-builder').default
const MySQLQueryBuilder = require('node-querybuilder').QueryBuilder({
  host: process.env.DB_HOST,
  database: process.env.DB_SCHEMA,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
}, 'mysql', 'single');
const locale = 'FR'

// encapsulating code in a directly invoked function enables use of async/await
;(async () => {
  function sendCustomError (message, reason = 'unknown') {
    let customError = new Error(message)
    customError.reason = reason
    throw customError
  }

  try {
    /**
     * Fetch data from a YouTube model
     * @param {string} model: YouTube model to fetch
     * @param {object} query: contains all query parameters
     * @returns {array} list of all items retrieved
     */
    async function fetchYouTubeData (model, query, getMetadata = false) {
      const rootUrl = 'https://www.googleapis.com/youtube/v3'
      const apiKey = process.env.YOUTUBE_API_KEY
      const url = new URLQueryBuilder(`${rootUrl}/${model}`, Object.assign({ key: apiKey }, query))
      let formattedData = null
      console.log(`${chalk.green('GET')} ${url.url}`)
      console.log(chalk.green('  Queries:'))
      Object.keys(url.queries).forEach(queryName => console.log(`    ${queryName} = ${url.queries[queryName]}`))

      await fetch(url.get())
        .then(response => response.json())
        .then(rawData => { formattedData = getMetadata ? rawData : rawData.items })
        .catch(error => {
          sendCustomError(error.message, `Failed to fetch data for model '${model}'.`)
        })
      return formattedData
    }

    /**
     * Execute a query in MySQL
     * @param {string} action: action to perform
     * @param {string} table: table on which to perform the action
     * @param {object} data: request payload
     */
    async function queryMySQL (action, table, data) {
      await (async () => {
        await new Promise(async (resolve, reject) => {
          await MySQLQueryBuilder[action](table, data, (error, response) => {
            if (error) {
              reject(error)
            } else {
              resolve(response)
            }
          })
        })
      })().then(
        () => {},
        errorMessage => { sendCustomError(errorMessage, `Failed to perform action '${action}' with table '${table}'.`) }
      )
    }

    // Import regions

    const regionCodes = [ 'FR' ]//, 'HK', 'US', 'FI', 'IN', 'JP', 'KR', 'ES', 'IT', 'CH', 'BR', 'CA', 'DE', 'BE', 'IL', 'JM', 'MA', 'NZ', 'NG', 'RU', 'PT', 'TW', 'CO', 'NL', 'CH', 'NO', 'RS', 'DK', 'KE', 'ZA', 'SN', 'TR' ]

    let regionHasCategory = []

    let regions = (await fetchYouTubeData('i18nRegions', { part: 'snippet', hl: locale }))
      .map(region => ({
        id: region.id,
        name: region.snippet.name
      }))
      .filter(region => regionCodes.find(regionCode => regionCode === region.id))

    await queryMySQL('insert', 'region', regions)

    // Import video categories

    let videoCategories = []
    for (let i = 0; i < regions.length; i++) {
      const region = regions[i]
      let videoCategoriesByRegion = await fetchYouTubeData('videoCategories', {
        part: 'snippet',
        regionCode: region.id,
        hl: locale
      })
      videoCategoriesByRegion.forEach(regionCategory => {
        regionHasCategory.push({
          regionId: region.id,
          categoryId: regionCategory.id
        })
        if (!videoCategories.find(category => category.id === regionCategory.id)) {
          videoCategories.push({
            id: regionCategory.id,
            name: regionCategory.snippet.title
          })
        }
      })
    }
    
    await queryMySQL('insert', 'video_category', videoCategories)

    // Import languages

    let languages = (await fetchYouTubeData('i18nLanguages', { part: 'snippet', hl: locale }))
      .map(language => ({
        id: language.id,
        code: language.snippet.hl,
        name: language.snippet.name
      }))
      
    await queryMySQL('insert', 'language', languages)
  } catch (error) {
    console.log(chalk.red('Fatal error'))
    console.log(chalk.red('  Reason:'), error.reason)
    console.log(chalk.red('  Error message:'), error.message)
    process.exit(1)
  } finally {
    MySQLQueryBuilder.disconnect()
  }
})()