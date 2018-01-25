import Vue from 'vue'

export default {
  state: {
    project: [],
    selectDoc: {},
    reload: false
  },
  mutations: {
    setProjectList (state, project) {
      state.project = project
    },
    setDocDetail (state, doc) {
      state.selectDoc = doc
    },
    selectReload (state, flag) {
      state.reload = flag
    },
    setProject (state, project) {
      state.project.forEach((val, index) => {
        if (val.project_id === project.project_id) {
          if (project.stat) {
            state.project.splice(index, 1)
            return
          }
          val.name = project.name
        }
      })
    },
    setDocument (state, doc) {
      state.selectDoc.name = doc.name
      state.reload = !state.reload
    }
  },
  actions: {
    getProjectList (ctx) {
      return new Promise((resolve, reject) => {
        Vue.$http.post('/api/project_list').then((res) => {
          if (res.data.code === 0) {
            ctx.commit('setProjectList', res.data.data)
            resolve()
          } else {
            Vue.$warn(res.data.msg)
            reject(res.data.msg)
          }
        }).catch((err) => {
          Vue.$warn('出现异常')
          reject(err)
        })
      })
    },
    getDocDetail (ctx, doc) {
      return new Promise((resolve, reject) => {
        ctx.commit('setDocDetail', doc)
        if (!doc.descript && doc.file_url) {
          Vue.$http.get(doc.file_url).then((res) => {
            if (res.status === 200) {
              doc.descript = res.data
              ctx.commit('selectReload', !ctx.state.reload)
              resolve()
            } else {
              Vue.$warn(res.data.msg)
              reject(res.statusText)
            }
          }).catch((err) => {
            Vue.$warn('出现异常')
            reject(err)
          })
        } else {
          ctx.commit('selectReload', !ctx.state.reload)
          resolve()
        }
      })
    }
  }
}
