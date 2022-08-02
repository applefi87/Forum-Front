import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useUserStore = defineStore('counter', {
  id: 'user',
  state () {
    return {
      token: '',
      account: '',
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
    async login (form) {
      try {
        const { data } = await api.post('/user/login', form)
        console.log(data)
        if (!data?.result) {
          return { title: 'loginFail', text: data.message, duration: 1 }
        }
        this.token = data.result.token
        this.account = data.result.account
        this.role = data.result.role
        this.score = data.result.score
        this.router.push('/')
        return { title: 'loginSuccess', text: '', duration: 1 }
      } catch (error) {
        return { title: 'loginFail', text: '伺服器錯誤', duration: 1 }
      }
    }
  //   async logout () {
  //     try {
  //       // await api.delete('/users/logout', {
  //       //   headers: {
  //       //     authorization: `Bearer ${this.token}`
  //       //   }
  //       // })
  //       await apiAuth.delete('/users/logout')
  //       this.router.push('/')
  //       // Swal.fire({
  //       //   icon: 'success',
  //       //   title: '成功',
  //       //   text: '登出成功'
  //       // })
  //     } catch (_) {
  //     }
  //     this.token = ''
  //     this.account = ''
  //     this.role = 0
  //     this.cart = 0
  //   },
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
  //       const { data: resData } = await apiAuth.post('/users/cart', data)
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
  //       await apiAuth.patch('/users/cart', data)
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
  //       const { data } = await apiAuth.get('/users')
  //       this.account = data.result.account
  //       this.role = data.result.role
  //       this.cart = data.result.cart
  //     } catch (error) {
  //       this.logout()
  //     }
  //   }
  },
  persist: {
    key: 'user',
    paths: ['token']
  }
})
