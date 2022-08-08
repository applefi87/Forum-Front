import { defineStore } from 'pinia'
import { api, apiAuth } from 'src/boot/axios'
// 給回傳跳出訊息用的懶人包
const reply = (d, result) => { return { success: d.success, ...d.message, result } }
export const useUserStore = defineStore('counter', {
  id: 'user',
  state () {
    return {
      token: null,
      account: null,
      role: 0,
      score: 0
    }
  },
  // getters: {
  //   isLogin () {
  //     return this.token.length !== 0
  //   },
  //   isAdmin () {
  //     return this.role === 1
  //   },
  //   avatar () {
  //     return 'https://source.boringavatars.com/beam/120/' + this.account
  //   }
  // },
  actions: {
    async register (form) {
      try {
        const { data } = await api.post('/user/', form)
        return reply(data)
      } catch (error) {
        return reply(error.response.data)
      }
    },
    async login (form) {
      try {
        const { data } = await api.post('/user/login', form)
        // 使用者資訊存起來
        this.token = data.result.token
        this.account = data.result.account
        this.role = data.result.role
        this.score = data.result.score
        return reply(data)
      } catch (error) {
        return reply(error.response.data)
      }
    },
    async logout () {
      try {
        // apiAuth預帶抓users.token (boot裡)
        const { data } = await apiAuth.delete('/user/logout')
        this.token = ''
        this.account = ''
        this.role = 0
        this.cart = 0
        return reply(data)
      } catch (error) {
        this.token = ''
        this.account = ''
        this.role = 0
        this.cart = 0
        return reply(error.response.data)
      }
    },
    async sendMail(email, isSchool) {
      try {
        const { data } = await api.post('/user/sendMail', { email, isSchool })
        return reply(data)
      } catch (error) {
        return reply(error.response.data)
      }
    },
    async mailVerify(email, schoolEmailCode) {
      try {
        const { data } = await api.post('/user/mailVerify', { email, schoolEmailCode })
        return reply(data)
      } catch (error) {
        return reply(error.response.data)
      }
    },
    async sendPWDMail(email) {
      try {
        const { data } = await api.post('/user/sendPWDMail', { email })
        return reply(data)
      } catch (error) {
        return reply(error.response.data)
      }
    },
    async verifyPWDMail(email, code) {
      try {
        const { data } = await api.post('/user/verifyPWDMail', { email, code })
        return reply(data, data.result)
      } catch (error) {
        return reply(error.response.data)
      }
    }

  //   async addCart (data) {
  //     if (this.token.length === 0) {
  //       // Swal.fire({
  //       //   icon: 'error',
  //       //   title: '失敗',
  //       //   text: '請先登入'
  //       // })
  //       this.router.push('/login')
  //       return
  //     }
  //     if (data.quantity <= 0) {
  //       // Swal.fire({
  //       //   icon: 'error',
  //       //   title: '失敗',
  //       //   text: '數量必須大於 0'
  //       // })
  //       return
  //     }
  //     try {
  //       const { data: resData } = await apiAuth.post('/user/cart', data)
  //       this.cart = resData.result
  //       // Swal.fire({
  //       //   icon: 'success',
  //       //   title: '成功',
  //       //   text: '加入購物車成功'
  //       // })
  //     } catch (error) {
  //       // Swal.fire({
  //       //   icon: 'error',
  //       //   title: '失敗',
  //       //   text: '加入購物車失敗'
  //       // })
  //     }
  //   },
  //   async updateCart (data) {
  //     try {
  //       await apiAuth.patch('/user/cart', data)
  //       return true
  //     } catch (error) {
  //       // Swal.fire({
  //       //   icon: 'error',
  //       //   title: '失敗',
  //       //   text: '更新購物車失敗'
  //       // })
  //       return false
  //     }
  //   },
  //   async getUser () {
  //     if (this.token.length === 0) return
  //     try {
  //       const { data } = await apiAuth.get('/user')
  //       this.account = data.result.account
  //       this.role = data.result.role
  //       this.cart = data.result.cart
  //     } catch (error) {
  //       this.logout()
  //     }
  //   }
  },
  persist: {
    key: 'users'
  }
})
