import file from '../classesOut.js'
import boards from '../models/boards.js'

export default async (req, res, next) => {
  const parent = await boards.findById(req.params.id)
  if (!parent) return res.status(403).send({ success: false, message: '找無該母版' })
  const out = []

  // *******************************************

  for (const c of file) {
    const form = {
      // 限20字
      title: c.className.split(' [')[0].slice(0, 20),
      parent: req.body.parent,
      // "uniqueData": c.uniqueData,
      childBoard: {
        active: false
      }
    }
    // ***colData**
    const pDataCol = parent.childBoard.rule.dataCol
    form.colData = []
    // 母版有列才加入
    for (const rule of pDataCol) {
      // !!! 變化處
      let data = c[rule.n]
      // 預先統一填入
      if (rule.n === 'semester') data = '111-1'
      // 母版的附加規則
      const other = rule.o
      // 必填沒值就報錯
      if (rule.r && (data === undefined || data === null || data === '')) return res.status(403).send({ success: false, message: c.className + '|' + rule.n + '|' + '不可是空的!' })
      // 有預設但沒值就填進去
      if (data === undefined) data = rule.d
      // 有值才檢查
      if (data) {
        // 類型審核錯誤也抱錯
        // 代碼表示: 1單行文字 2多行文字 3數字  5單選 6多選 7 其他 0Boolean
        switch (rule.t) {
          case 0:
            if (data === '是' || 'true' || 'yes') data = true
            if (typeof data !== 'boolean') return res.status(403).send({ success: false, message: '輸入格式驗證錯誤' + rule.n + rule.t + ':' + data })
            break
          case 1: case 2:
            if (typeof data === 'number') data = data.toString()
            if (typeof data !== 'string') return res.status(403).send({ success: false, message: '輸入格式驗證錯誤' + rule.n + rule.t + ':' + data })
            break
          case 3:
            // 數學包含整數/最大/最小可限制
            if (typeof data !== 'number') return res.status(403).send({ success: false, message: '輸入格式驗證錯誤' + rule.n + rule.t + ':' + data })
            if (other === undefined) { break }
            if (other.integer !== undefined && (typeof other.integer !== 'boolean' || (other.integer && data != Math.floor(data)))) return res.status(403).send({ success: false, message: '必須為整數的格式錯誤' + rule.n + rule.t + ':' + other.integer + ':' + data })
            if (other.max !== undefined && (typeof other.max !== 'number' || data > other.max)) return res.status(403).send({ success: false, message: '最大值的格式錯誤' + rule.n + rule.t + ':' + other.max + ':' + data })
            if (other.min !== undefined && (typeof other.min !== 'number' || data < other.min)) return res.status(403).send({ success: false, message: '最小值的格式錯誤' + rule.n + rule.t + ':' + other.min + ':' + data })
            break
          case 5: case 6:
            // 多選必須包含陣列的選項
            if (typeof data !== 'string') return res.status(403).send({ success: false, message: '輸入格式驗證錯誤' + rule.n + rule.t + ':' + data })
            if (other === undefined) return res.status(403).send({ success: false, message: '必須設定單選選項' + rule.t + ':' + other + ':' + data })
            if (!Array.isArray(other) || other.filter((i) => typeof i !== 'string').length > 0) return res.status(403).send({ success: false, message: '單選格式錯誤' + rule.n + rule.t + ':' + other + ':' + data })
            break
          // **********!!!!!!!!!之後要改掉!!!!!!!!!!!!!!!!!!!********************
          case 7:
            break
          default:
            return res.status(403).send({ success: false, message: '其他' + '母版規則格式錯誤:' + rule.t + ':' + data })
        }
        // 完成把母版ok的加進去
        form.colData.push({ [rule.n]: data })
      }
    }
    // ************************************************
    // ***uniqueData
    const pUniqueCol = parent.childBoard.rule.uniqueCol
    form.uniqueData = []
    for (const it of c.uniqueData) {
      const itData = []
      // 母版有列才加入
      for (const rule of pUniqueCol) {
        // !!! 變化處
        let data = it[rule.n]
        // 預先統一填入
        if (rule.n === 'semester') data = '111-1'
        // 母版的附加規則
        const other = rule.o
        // 必填沒值就報錯
        if (rule.r && (data === undefined || data === null || data === '')) return res.status(403).send({ success: false, message: c.className + '|' + rule.n + '|' + '不可是空的!' })
        // 有預設但沒值就填進去
        if (data === undefined) data = rule.d
        // 有值才檢查
        if (data) {
          // 類型審核錯誤也抱錯
          // 代碼表示: 1單行文字 2多行文字 3數字  5單選 6多選 7 其他 0Boolean
          switch (rule.t) {
            case 0:
              if (data === '是' || 'true' || 'yes') data = true
              if (typeof data !== 'boolean') return res.status(403).send({ success: false, message: '輸入格式驗證錯誤' + rule.n + rule.t + ':' + data })
              break
            case 1: case 2:
              if (typeof data === 'number') data = data.toString()
              if (typeof data !== 'string') return res.status(403).send({ success: false, message: '輸入格式驗證錯誤' + rule.n + rule.t + ':' + data })
              break
            case 3:
              // 數學包含整數/最大/最小可限制
              if (typeof data !== 'number') return res.status(403).send({ success: false, message: '輸入格式驗證錯誤' + rule.n + rule.t + ':' + data })
              if (other === undefined) { break }
              if (other.integer !== undefined && (typeof other.integer !== 'boolean' || (other.integer && data != Math.floor(data)))) return res.status(403).send({ success: false, message: '必須為整數的格式錯誤' + rule.n + rule.t + ':' + other.integer + ':' + data })
              if (other.max !== undefined && (typeof other.max !== 'number' || data > other.max)) return res.status(403).send({ success: false, message: '最大值的格式錯誤' + rule.n + rule.t + ':' + other.max + ':' + data })
              if (other.min !== undefined && (typeof other.min !== 'number' || data < other.min)) return res.status(403).send({ success: false, message: '最小值的格式錯誤' + rule.n + rule.t + ':' + other.min + ':' + data })
              break
            case 5: case 6:
              // 多選必須包含陣列的選項
              if (typeof data !== 'string') return res.status(403).send({ success: false, message: '輸入格式驗證錯誤' + rule.n + rule.t + ':' + data })
              if (other === undefined) return res.status(403).send({ success: false, message: '必須設定單選選項' + rule.t + ':' + other + ':' + data })
              if (!Array.isArray(other) || other.filter((i) => typeof i !== 'string').length > 0) return res.status(403).send({ success: false, message: '單選格式錯誤' + rule.n + rule.t + ':' + other + ':' + data })
              break
            // **********!!!!!!!!!之後要改掉!!!!!!!!!!!!!!!!!!!********************
            case 7:
              break
            default:
              return res.status(403).send({ success: false, message: '其他' + '母版規則格式錯誤:' + rule.t + ':' + data })
          }
          // 完成把母版ok的加進去
          itData.push({ [rule.n]: data })
        }
      }
      form.uniqueData.push(itData)
    }
    out.push(form)
  }
  req.boardList = out
  next()
}
