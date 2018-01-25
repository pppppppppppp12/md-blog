<template>
  <div class="warn-wrapper">
    <div class="warn" :class="active">{{msg}}</div>
  </div>
</template>
<script>
  export default {
    name: 'warn',
    props: {
      msg: {
        default: '信息'
      }
    },
    data () {
      return {
        active: ''
      }
    },
    mounted () {
      const self = this
      document.body.appendChild(this.$el)
      window.setTimeout(() => {
        self.active = 'active'
      }, 800)
      window.setTimeout(() => {
        this.$destroy()
      }, 800 + 1000)
    },
    destroyed () {
      // document.body.removeChild(this.$el)
    }
  }
</script>
<style lang="less">
  .warn-wrapper {
    position: fixed;
    top: 50%;
    width: 100%;
    height: 0;
    line-height: 0;
    text-align: center;
    z-index: 100;
    margin-top: -30px;
    .warn {
      display: inline-block;
      margin: 0 auto;
      padding: 6px 24px;
      line-height: 28px;
      background-color: #666;
      border-radius: 5px;
      text-align: center;
      color: #fff;
      opacity: 1;
      -webkit-transition: opacity 1s ease-in-out;
      -o-transition: opacity 1s ease-in-out;
      transition: opacity 1s ease-in-out;
    }
    .warn.active {
      opacity: 0;
    }
  }
</style>
