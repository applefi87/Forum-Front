import { extractSheets } from 'spreadsheet-to-json'
import fs from 'fs'
// optional custom format cell function
import config from './google-generated-creds.local.json' assert { type: "json" }
// const formatCell = (sheetTitle, columnTitle, value) => value.toUpperCase()
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
    if (err) {
      console.log(err)
    } else {
      console.log(data)
    }
  }
)
