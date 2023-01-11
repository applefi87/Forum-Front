import { defineStore } from 'pinia'
import { api, apiAuth } from 'src/boot/axios'
// 給回傳跳出訊息用的懶人包
const reply = (d, result) => {
  if (d === undefined) return { success: false }
  const ob = result ? { success: d.success, ...d.message, result } : { success: d.success, ...d.message }
  return ob
}
export const useUserStore = defineStore('user', {
  id: 'user',
  state() {
    return {
      token: null,
      _id: null,
      account: null,
      role: null,
      score: 0,
      local: null,
      tab: 'boards'
    }
  },
  actions: {
    async register(form) {
      try {
        const { data } = await api.post('/user/', form)
        return reply(data)
      } catch (error) {
        return reply(error?.response?.data)
      }
    },
    async login(form) {
      try {
        const { data } = await api.post('/user/login', form)
        // 使用者資訊存起來
        this.token = data.result.token
        this._id = data.result._id
        this.account = data.result.account
        this.role = data.result.role
        this.score = data.result.score
        return reply(data)
      } catch (error) {
        return reply(error.response?.data)
      }
    },
    clearLocalStorage() {
      this.token = null
      this._id = null
      this.role = null
      this.account = ''
      this.role = null
      this.notification = null
    },
    async logout() {
      try {
        // apiAuth預帶抓users.token (boot裡)
        const { data } = await apiAuth.delete('/user/logout')
        return reply(data)
      } catch (error) {
        return reply(error?.response?.data)
      } finally {
        this.clearLocalStorage()
      }
    },
    async changePWD(form) {
      try {
        const { data } = await apiAuth.post('/user/changePWD', form)
        if (data.success) {
          this.clearLocalStorage()
        }
        return reply(data)
      } catch (error) {
        return reply(error?.response?.data)
      }
    },
    async sendMail(email, isSchool) {
      try {
        const { data } = await api.post('/user/sendMail', { email, isSchool })
        return reply(data)
      } catch (error) {
        return reply(error?.response?.data)
      }
    },
    async mailVerify(email, schoolEmailCode) {
      try {
        const { data } = await api.post('/user/mailVerify', { email, schoolEmailCode })
        return reply(data)
      } catch (error) {
        return reply(error?.response?.data)
      }
    },
    async sendForgetPWDMail(emailObj) {
      try {
        const { data } = await api.post('/user/sendForgetPWDMail', emailObj)
        return reply(data)
      } catch (error) {
        return reply(error?.response?.data)
      }
    },
    async verifyForgetPWDCode(emailObj) {
      try {
        const { data } = await api.post('/user/verifyForgetPWDCode', emailObj)
        return reply(data)
      } catch (error) {
        return reply(error?.response?.data)
      }
    }
  },
  persist: {
    key: 'users'
  }
})
