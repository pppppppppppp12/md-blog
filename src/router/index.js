import Vue from 'vue'
import VueRouter from 'vue-router'
import header from '../pages/common/header'
// import footer from '../pages/common/footer'
import index from '../pages/index/index'
import project from '../pages/project/index'

// 首页中间部分组件
import main from '../pages/index/main'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  linkActiveClass: 'active',  // 全局配置 默认 class 激活类名
  routes: [
    {
      path: '/index', // 默认首页
      components: {
        header: header,
        default: index
      },
      children: [
        {
          path: 'login',
          name: 'login',
          component: main
        },
        {
          path: '',
          component: main
        }
      ]
    },
    {
      path: '/doc/:pro_name?',
      name: 'doc',
      components: {
        header: header,
        default: project
      },
      children: [
        {
          path: ':doc_id?',
          name: 'docList'
        }
      ]
    },
    {
      path: '*',  // 不存在的地址自动跳转
      redirect: '/index'
    }
  ]
})
// // 全局钩子拦截导航
// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem('userToken')
//   if (to.path === '/index/login') { // 跳转到登录页
//     if (token) {
//       next('/index') // 有token跳转
//     }
//     next() // 无tokoen跳转回登录
//   } else {
//     if (token) {
//       next() // 有token跳转
//     } else {
//       next('/index/login') // 无token跳转回登录
//     }
//   }
// })

export default router
