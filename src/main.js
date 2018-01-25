import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Axios from 'axios'
import $ from 'jquery'

import dialog from './plugins/dialog/index'
Vue.use(dialog)

Vue.$http = Vue.prototype.$http = Axios
window.jQuery = window.$ = $

// request 拦截器
Axios.interceptors.request.use(config => {
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  return config
}, err => {
  return Promise.reject(err)
})
// response 拦截器
Axios.interceptors.response.use(res => {
  if (res.data.code === 6) { // 没有登录，删除本地数据并跳转首页
    window.localStorage.removeItem('userToken')
    router.replace({
      path: '/index/login'
    })
  }
  return res
}, err => {
  console.log(err)
  return Promise.reject(err.response)
})

new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App),
  components: { App }
}).$mount('#app')
