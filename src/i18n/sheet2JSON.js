require('dotenv').config()
const fs = require('fs-extra')
const unflatten = require('flat').unflatten
const { extractSheets } = require('spreadsheet-to-json')
const path = require('path')
// const key = atob(process.env.GOOGLE_SHEET)
const key = Buffer.from(process.env.GOOGLE_SHEET, 'base64').toString('utf8')

//
extractSheets(
  {
    // your google spreadhsheet key
    spreadsheetKey: '1LtigX97NFNdeORWIIf74klonHvkFM26wJCKxN7PSR8k',
    // your google oauth2 credentials or API_KEY
    credentials: JSON.parse(key),
    // optional: names of the sheets you want to extract
    sheetsToExtract: ['basic', 'user', 'board', 'article', 'form', 'ClassReview']
    // optional: custom function to parse the cells
    // formatCell
  },
  (err, data) => {
    if (err) throw err
    const read = []
    Object.keys(data).forEach(t => read.push(...data[t]))
    const result = {}
    const files = []
    for (const key in read[0]) {
      if (key !== 'key') {
        files.push(key)
        result[key] = {}
      }
    }
    read.forEach((el) => {
      for (const file of files) {
        result[file][el.key] = el[file] ? el[file] : ''
      }
    })
    for (const fileName of files) {
      fs.ensureDirSync(
        path.dirname(
          path.resolve(__dirname, '../i18n/language', `${fileName}.json`)
        )
      )
      fs.writeJSONSync(
        path.resolve(__dirname, '../i18n/language', `${fileName}.json`),
        unflatten(result[fileName], { object: true }),
        { spaces: 2 }
      )
    }
  }
)
