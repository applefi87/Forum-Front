import { defineStore } from 'pinia'
import { api, apiAuth } from 'src/boot/axios'
// 給回傳跳出訊息用的懶人包
const reply = (d, result) => {
  const ob = result ? { success: d.success, ...d.message, result } : { success: d.success, ...d.message }
  return ob
}
export const useBoardStore = defineStore('board', {
  id: 'board',
  state() {
    return {
      tab: 'boards'
    }
  },
  persist: {
    key: 'boards'
  }
})
