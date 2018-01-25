export default {
  state: {
    loginModal: false,
    editModal: false,
    docModal: false,
    proModalItem: false
  },
  mutations: {
    switchLoginModal (state, showFlag) {
      this.commit('closeModal')
      state.loginModal = showFlag ? true : !state.loginModal
    },
    switchProModal (state, showFlag) {
      this.commit('closeModal')
      state.editModal = showFlag ? true : !state.editModal
    },
    switchProModalItem (state) {
      this.commit('closeModal')
      state.proModalItem = !state.proModalItem
    },
    switchDocModal (state) {
      this.commit('closeModal')
      state.docModal = !state.docModal
    },
    closeModal (state) {
      state.loginModal = false
      state.editModal = false
      state.docModal = false
      state.proModalItem = false
    }
  },
  actions: {}
}
