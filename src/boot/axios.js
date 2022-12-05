import axios from 'axios'
import { useUserStore } from 'src/stores/user'
// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: process.env.SERVER_URL,
  withCredentials: true
  // headers: { 'X-H': 'OK' }
})
const apiAuth = axios.create({
  baseURL: process.env.SERVER_URL,
  withCredentials: true
  // headers: { 'X-H': 'OK' }
})
// axios ---> axios 攔截請求 --> API SERVER --> axios 攔截回應 --> 呼叫的地方
// 因為改cookie 不用beartoken
apiAuth.interceptors.request.use(config => {
  const user = useUserStore()
  config.headers.authorization = `Bearer ${user.token}`
  return config
})

apiAuth.interceptors.response.use(res => {
  return res
}, async error => {
  // console.log('in axios Intersepter')
  // 如果請求有回應
  if (error.response) {
    // 如果是 401，可能是 JWT 過期
    if (error.response.status === 401) {
      // 確認原始請求的網址不是延長登入，才重新登入
      if (error.config.url !== '/user/extend' && error.config.url !== '/user/logout') {
        // 傳送延長請求
        const users = useUserStore()
        try {
          const { data } = await apiAuth.post('/user/extend', {})
          // 後台偵測到就直接換新cookie 所以不用改
          // // 更新 JWT
          users.token = data.result
          // // 使用新的 JWT 再次嘗試原始請求
          error.config.headers.authorization = `Bearer ${users.token}`
          return await axios(error.config)
        } catch (err) {
          // console.log('boot/axios Error')
          // console.log(err)
          // 重新登入失敗，強制登出
          users.logout()
          return await Promise.reject(error)
        }
      }
    }
  }
  return Promise.reject(error)
})

export { axios, api, apiAuth }
