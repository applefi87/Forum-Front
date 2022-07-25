// 裝這3插件 spreadsheet-to-json fs-extra flat
import { extractSheets } from 'spreadsheet-to-json'
import fs from 'fs-extra'
import unflatten from 'flat'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
const config = import('./google-generated-creds.local.json')
// const formatCell = (sheetTitle, columnTitle, value) => value.toUpperCase()
const uf = unflatten.unflatten
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

extractSheets(
  {
    // your google spreadhsheet key
    spreadsheetKey: '1LtigX97NFNdeORWIIf74klonHvkFM26wJCKxN7PSR8k',
    // your google oauth2 credentials or API_KEY
    credentials: config,
    // optional: names of the sheets you want to extract
    sheetsToExtract: ['page1']
    // optional: custom function to parse the cells
    // formatCell
  },
  (err, data) => {
    if (err) throw err
    console.log(data)
    const read = [...data.page1]
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
          path.resolve(__dirname, '../i18n', `${fileName}.json`)
        )
      )
      fs.writeJSONSync(
        path.resolve(__dirname, '../i18n', `${fileName}.json`),
        uf(result[fileName], { object: true }),
        { spaces: 2 }
      )
    }
  }
)
