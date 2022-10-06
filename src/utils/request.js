import axios from 'axios'
import {
  ElMessage,
  ElMessageBox
} from 'element-plus'
import store from '@/store'
import {getToken, removeToken} from '@/utils/auth'
import router from "@/router";
import messages from '@/utils/messages'


// create an axios instance
const service = axios.create({
  baseURL: 'http://localhost:8080/api/', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5 * 60 * 1000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    console.log(process.env.VUE_APP_BASE_API)
    if (store.getters.token) {
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

  /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
  response => {
    return Promise.resolve(response)
    // const res = response.data
    //
    // // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000) {
    //   ElMessage({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    //
    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     ElMessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //       confirmButtonText: 'Re-Login',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject(new Error(res.message || 'Error'))
    // } else {
    //   return res
    // }
  },
  error => {
    if (error.response.status !== 422) {
      if (error.response.status === 401) {
        removeToken()
        if (store.state.user) {
          router.push({ path: '/' })
        }
        return Promise.reject(error.response)
      }
      if (error.response.status === 400 || error.response.status === 404) {
        ElMessage({
          message: error.response.data.message,
          type: messages.error,
          duration: 3 * 1000
        })
      }
      if (error.response.status === 429) {
        ElMessage({
          message: 'Too many attempts.',
          type: messages.error,
          duration: 3 * 1000
        })
      }
      return Promise.reject(error.response)
    }
    console.log('err' + error) // for debug
    // ElMessage({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error.response)
  }
)

export default service
