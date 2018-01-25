<template>
  <div class="login-wrapper modal-item">
    <input type="text" v-model="name" placeholder="user_name">
    <input type="password" v-model="pwd" placeholder="password"> 
    <a class="btn btn-secondary" href="javascript:;" @click="login()">登录</a>
  </div>
</template>
<script>
export default {
  data () {
    return {
      name: '',
      pwd: ''
    }
  },
  computed: {
    loginFlag () {
      return this.$route.name === 'login'
    }
  },
  watch: {
    loginFlag (val) {
      console.log(val)
      if (val) this.$store.commit('switchLoginModal', true)
    }
  },
  created () {
    let token = localStorage.getItem('userToken')
    if (token) {
      this.$store.commit('setToken', token)
      this.$store.dispatch('getUserInfo')
    }
    if (this.$route.name === 'login') {
      this.$store.commit('switchLoginModal', true)
    }
  },
  methods: {
    login: async function () {
      await this.$store.dispatch('login', {
        name: this.name,
        pwd: this.pwd
      })
      await this.$store.dispatch('getUserInfo')
      this.$router.push('/index')
    }
  }
}
</script>
<style lang="less">
  .login-wrapper {
    right: 0;
    padding: 15px;
    width: 200px;
    line-height: 33px;
    font-size: 14px;
    input {
      margin-bottom: 10px;
    }
    .btn {
      width: 100%;
    }
  }
</style>


