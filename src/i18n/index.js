// https://stackoverflow.com/questions/72114775/vite-global-is-not-defined
import fs from 'fs-extra'
// import { fileURLToPath } from 'url'
// import path, { dirname } from 'path'
// console.log(import.meta.url)
// console.log(1)
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)
// const enUS = JSON.parse(fs.readJsonSync(path.resolve(__dirname, './en-US.json')))
// const enUS = JSON.parse(fs.readJsonSync('./en-US.json'))
// const zhTW = JSON.parse(fs.readJson('./zh-TW.json'))
// const jaJP = JSON.parse(fs.readJson('./ja-JP.json'))

export default {
  'en-US': '5'
  // 'en-US': enUS,
  // 'zh-TW': zhTW,
  // 'ja-JP': jaJP
}
