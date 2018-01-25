<template>
  <div id="app" @click="$store.commit('closeModal')">
    <!-- 头部组件 -->
    <router-view name="header"></router-view>
    <!-- 路由渲染 -->
    <router-view></router-view>
    <!-- 底部组件 -->
    <router-view name="footer"></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="less">
@import './assets/less/reset.less';
@import './assets/less/public.less';
html{
  height: 100%;
}
body{
  position: relative;
  overflow: hidden;
  height: 100%;
}
#app{
  height: 100%;
}
</style>