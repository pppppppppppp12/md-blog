<template>
  <div class="doc-list-wrapper">
    <!-- 超过1200px水平滚动条 -->
    <div class="doc-list-scroll small-scroll-8">
      <div class="doc-list-content">
        <leftBar></leftBar> 
        <detail></detail> 
      </div>
    </div>
    <rightBar></rightBar>
  </div>
</template>
<script>
  import leftBar from './leftBar.vue'
  import detail from './main.vue'
  import rightBar from './rightBar.vue'
  export default {
    data () {
      return {
        loading: true
      }
    },
    components: {
      leftBar,
      detail,
      rightBar
    },
    created () {
      this.loading = false
    }
  }
</script>
<style lang="less">
  @green: #44a542;
  .doc-list-wrapper {
    width: 100%;
    height: 100%;
    max-width: 100%;
    position: absolute;
    top: 45px;
    left: 0;
    overflow: hidden;
    padding-left: 250px;
    padding-bottom: 45px;
    min-width: auto;
    .doc-list-scroll {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: auto;
    }
    .doc-list-content {
      position: relative;
      min-width: 1200px;
      height: 100%;
    }
    .loading-wrapper {
      top: 70px;
      position: fixed;
    }
    .content {
      font-size: 0;
    }
  } 
</style>