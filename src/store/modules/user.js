import Vue from 'vue'

export default {
  state: {
    token: '',
    userInfo: {}
  },
  mutations: {
    setToken (state, token) {
      state.token = token
    },
    setUserInfo (state, data) {
      state.userInfo = data
    }
  },
  actions: {
    // 登录，储存 token
    login (ctx, data) {
      return new Promise((resolve, reject) => {
        Vue.$http.post('/auth/user', {
          name: data.name,
          password: data.pwd
        }).then(res => {
          if (res.data.code === 0) {
            // 储存token
            const token = res.data.data
            ctx.commit('setToken', token)
            localStorage.setItem('userToken', token)
            resolve()
          } else {
            localStorage.setItem('userToken', null)
            Vue.$warn(res.data.msg)
            reject(res.data.msg)
          }
        }).catch(err => {
          Vue.$warn('出现异常')
          reject(err)
        })
      })
    },
    getUserInfo (ctx, data) {
      return new Promise((resolve, reject) => {
        Vue.$http.post('/auth/user/get_user_info').then(res => {
          if (res.data.code === 0) {
            ctx.commit('setUserInfo', res.data.data)
            resolve()
          } else {
            Vue.$warn(res.data.msg)
            reject(res.data.msg)
          }
        }).catch(err => {
          Vue.$warn('出现异常')
          reject(err)
        })
      })
    },
    // 退出
    logout (ctx) {
      localStorage.removeItem('userToken')
      ctx.commit('setUserInfo', {})
      ctx.commit('setToken', '')
    }
  }
}
