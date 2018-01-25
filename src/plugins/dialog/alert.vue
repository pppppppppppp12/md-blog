<template>
  <div class="modal-wrapper">
    <div class="modal-cont">
      <div class="head">
        {{ title }}
        <span class="pull-right" @click="close()">&times;</span>
      </div>
      <div class="body">
        {{ msg }}
      </div>
      <div class="foot clearfix">
        <button class="btn btn-primary pull-right" @click="okCallback()">确定</button>
        <button class="btn btn-secondary pull-right" @click="cancelCallback()">取消</button>
      </div>
    </div>
    <div class="modal-bg" @click="clickBg()"></div>
  </div>
</template>
<script>
export default {
  name: 'alert',
  props: {
    title: { default: '提示' },
    msg: {},
    ok: {  // 接收 传递的 点击 确认按钮 回调 事件
      type: Function,
      default () {}
    },
    cancel: {  // 接收 传递的 点击取消/背景 回调事件
      type: Function,
      default () {}
    }
  },
  mounted () {
    document.body.appendChild(this.$el)
  },
  destroyed () {
    document.body.removeChild(this.$el)
  },
  methods: {
    // 成功 回调事件
    okCallback () {
      this.ok()
      this.close()
    },
    // 取消 回调事件
    cancelCallback () {
      this.cancel()
      this.close()
    },
    // 点击 背景
    clickBg () {
      // 默认执行 取消回调事件 && 默认销毁窗体
      this.cancelCallback()
    },
    close () {
      this.$destroy()
    }
  }
}
</script>

