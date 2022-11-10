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
      loginState: false,
      _id: null,
      account: null,
      role: null,
      score: 0,
      keepLogin: false,
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
        this.loginState = true
        this._id = data.result._id
        this.account = data.result.account
        this.role = data.result.role
        this.score = data.result.score
        this.keepLogin = form.keepLogin
        return reply(data)
      } catch (error) {
        return reply(error.response?.data)
      }
    },
    async logout() {
      try {
        // apiAuth預帶抓users.loginState (boot裡)
        this.loginState = false
        this._id = null
        this.role = null
        this.account = ''
        this.role = null
        const { data } = await apiAuth.delete('/user/logout')
        return reply(data)
      } catch (error) {
        return reply(error?.response?.data)
      }
    },
    async changePWD(form) {
      try {
        const { data } = await apiAuth.post('/user/changePWD', form)
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
