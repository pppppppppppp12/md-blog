import warn from './warn.vue'
import alert from './alert.vue'

const dialog = {
  install: function (Vue, options) {
    /**
   * @desc warn 弹层
   * @param {string} msg - 提示内容
   */
    const WarnCp = Vue.extend(warn)
    Vue.prototype.$warn = function (msg) {
      new WarnCp({
        propsData: {
          msg: msg
        }
      }).$mount()
    }

    /**
   * @desc alert 弹层
   * @param {object}   options       -
   * @param {string}   options.title - 标题 - 默认: '提示'
   * @param {string}   options.msg   - 内容
   * @param {function} options.ok    - 点击确认键的回调函数
   */
    const AlertCp = Vue.extend(alert)
    Vue.prototype.$alert = function (options) {
      new AlertCp({
        propsData: options
      }).$mount()
    }
  }
}

export default dialog
