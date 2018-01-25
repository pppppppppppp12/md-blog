import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import anchor from './modules/anchor'
import modal from './modules/modal'
import doc from './modules/doc'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    anchor,
    modal,
    doc
  }
})
