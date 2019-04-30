// load global constants from .env
require('dotenv').config()

const fetch = require('node-fetch')
const chalk = require('chalk')
const URLQueryBuilder = require('url-query-builder').default
const MySQLQueryBuilder = require('node-querybuilder').QueryBuilder({
  host: process.env.DB_HOST,
  database: process.env.DB_SCHEMA,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  charset: 'utf8mb4'
}, 'mysql', 'single');
const locale = 'FR'

// encapsulating code in a directly invoked function enables use of async/await
;(async () => {
  function sendCustomError (message, reason = 'unknown') {
    let customError = new Error(message)
    customError.reason = reason
    throw customError
  }

  const startTime = new Date().getTime()
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
      // console.log(chalk.green('  Queries:'))
      // Object.keys(url.queries).forEach(queryName => console.log(`    ${queryName} = ${url.queries[queryName]}`))

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
            error
              ? reject(error)
              : resolve(response)
          })
        })
      })().then(
        () => {},
        errorMessage => { sendCustomError(errorMessage, `Failed to perform action '${action}' with table '${table}'.`) }
      )
    }

    // Import regions

    // TODO : uncomment
    const regionCodes = [ 'FR' ]// , 'HK' , 'US', 'FI', 'IN', 'JP', 'KR', 'ES', 'IT', 'CH', 'BR', 'CA', 'DE', 'BE', 'IL', 'JM', 'MA', 'NZ', 'NG', 'RU', 'PT', 'TW', 'CO', 'NL', 'CH', 'NO', 'RS', 'DK', 'KE', 'ZA', 'SN', 'TR' ]

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

    // Import videos

    let videos = []
    for (let i = 0; i < regions.length; i++) {
      const region = regions[i]
      for (let j = 0; j < 1; j++) {
        let nextPageToken = null
        const videoCategory = videoCategories[j]
        do {
          // live example: https://developers.google.com/apis-explorer/#s/youtube/v3/youtube.videos.list?part=snippet%252Cid&chart=mostPopular&hl=FR&maxResults=10&regionCode=FR&videoCategoryId=10&fields=items(contentDetails(caption%252Cdefinition%252Cduration%252ClicensedContent)%252Cid%252Csnippet(categoryId%252CchannelId%252CdefaultAudioLanguage%252CdefaultLanguage%252Cdescription%252CpublishedAt%252Ctags%252Cthumbnails%252Ctitle)%252Cstatistics(commentCount%252CdislikeCount%252ClikeCount%252CviewCount))%252CnextPageToken&_h=38&
          const videosResponse = await fetchYouTubeData('videos', {
            part: 'contentDetails,snippet,statistics',
            chart: 'mostPopular',
            regionCode: region.id,
            hl: locale,
            maxResults: 50,
            videoCategoryId: videoCategory.id,
            pageToken: nextPageToken || '',
            fields: 'items(contentDetails(caption,definition,duration,licensedContent),id,snippet(categoryId,channelId,defaultAudioLanguage,defaultLanguage,description,publishedAt,tags,thumbnails,title),statistics(commentCount,dislikeCount,likeCount,viewCount)),nextPageToken'
          }, true)
          videos.push(...videosResponse.items.map(video => {
            const duration = video.contentDetails.duration || null
            let formattedDuration = null
            if (duration) {
              formattedDuration = duration
                .match(/[\d]{1,}/g)
                .reduce((a,b) => Number(a * 60) + Number(b))
            }
            const videoLanguageId = video.snippet.defaultLanguage || video.snippet.defaultAudioLanguage || null
            const correspondingLanguage = languages.find(language => language.id === videoLanguageId)
            const languageId = videoLanguageId && correspondingLanguage
              ? videoLanguageId
              : null
            return {
              id: video.id,
              title: video.snippet.title || null,
              description: video.snippet.title || null,
              published_at: (video.snippet.publishedAt && new Date(video.snippet.publishedAt).toJSON().slice(0, 19).replace('T', ' ')) || null,
              duration: formattedDuration,
              view_count: video.statistics.viewCount || null,
              like_count: video.statistics.likeCount || null,
              dislike_count: video.statistics.dislikeCount || null,
              comment_count: video.statistics.commentCount || null,
              definition: video.contentDetails.definition || null,
              has_caption: video.contentDetails.caption === 'true' ? true : false,
              is_licensed: video.contentDetails.licensedContent || false,
              language_id: languageId,
              video_category_id: video.snippet.categoryId || null,
              channel_id: video.snippet.channelId || null
            }
          }))
          nextPageToken = videosResponse.nextPageToken
        } while (nextPageToken)
      }
    }
    const filteredVideos = videos.filter((video, index) => videos.map(video => video.id).indexOf(video.id) >= index)

    // Import channels

    const channelIds = filteredVideos.map(video => video.channel_id)
    const filteredChannelIds = channelIds.filter((channelId, index) => channelIds.indexOf(channelId) >= index)

    let channels = []
    for (let i = 0; i < filteredChannelIds.length; i += 50) {
      const lengthToTake = i + 50 > filteredChannelIds.length ? filteredChannelIds.length : i + 50
      const response = await fetchYouTubeData('channels', {
        part: 'snippet',
        hl: locale,
        id: filteredChannelIds.slice(i, lengthToTake).join(','),
        fields: 'items(id,snippet(description,publishedAt,title))'
      })
      channels.push(...response.map(item => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        published_at: item.snippet.publishedAt
      })))
    }

    await queryMySQL('insert', 'channel', channels)
    await queryMySQL('insert', 'video', filteredVideos)
  } catch (error) {
    console.log(chalk.red('Fatal error'))
    console.log(chalk.red('  Reason:'), error.reason)
    console.log(chalk.red('  Error message:'), error.message)
    console.log(chalk.red('Time:'), new Date().getTime() - startTime + 'ms')
    process.exit(1)
  } finally {
    MySQLQueryBuilder.disconnect()
    console.log(chalk.yellow('Time:'), new Date().getTime() - startTime + 'ms')
  }
})()
