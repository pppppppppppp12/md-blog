<template>
  <header class="header-wrapper clearfix">
    <a href="javascript:;" v-show="$store.state.user.token" class="pull-right" @click.stop="$store.dispatch('logout')">退出</a>
    <a href="javascript:;" v-show="!$store.state.user.token" class="pull-right" @click.stop="$store.commit('switchLoginModal')">
      登录
      <login v-show="$store.state.modal.loginModal"></login>
    </a>
    <a href="javascript:;" class="pull-right">
      标签
    </a>
    <a href="javascript:;" class="pull-right" @click.stop="$store.commit('switchProModalItem')">
      分类
      <ul class="modal-item modal-item-list project_nav small-scroll-y" v-show="$store.state.modal.proModalItem">
        <router-link class="item" tag="li" v-for="(project,index) in $store.state.doc.project" :key="project.project_id"
          :to="{path:'/doc/'+project.name}"
          :class="{'active':($route.params.pro_name===project.name)||($route.path==='/doc'&&index===0)}">{{project.name}}</router-link>
      </ul>
    </a>
    <a href="javascript:;" class="pull-right"><i class="fa fa-search"></i></a>
  </header>
</template>
<script>
import login from './login.vue'
export default {
  name: 'pageHeader',
  components: {
    login
  },
  data () {
    return {
      content: ''
    }
  },
  created () {
    this.$store.dispatch('getProjectList')
  },
  methods: {
  }
}
</script>
<style lang="less">
  .header-wrapper {
    position: fixed;
    z-index: 2;
    width: 100%;
    line-height: 45px;
    font-size: 14px;
    // background-color: rgba(0, 0, 0, 0.03);
    padding: 0 30px;
    padding-left: 250px;
    text-align: center;
    > a {
      position: relative;
      display: inline-block;
      padding: 0 15px;
    }
    .project_nav {
      top: 45px;
      right: 0;
      width: 200px;
      .active {
        color: #44a542;
      }
    }
  }
</style>