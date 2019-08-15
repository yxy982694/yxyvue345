// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 2019年8月15日 fenzhi1添加内容
import Vue from 'vue'
import App from './App'
import createRouter from './router'
import 'common/stylus/index.styl'
import fastclick from 'fastclick'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import './swiper/dist/css/swiper.css'
import Axios from 'axios'
import VueLazyload from 'vue-lazyload'
import Vuex from 'vuex'
import CreateStore from './store/index.js'
Vue.use(Vuex)
const store = CreateStore()
const router = createRouter()
// 跳转前1
// router.beforeEach((to, from, next) => {
//   console.log(to)
//   if (to.fullPath === '/singer') {
//     next('/usercenter/123')
//   } else {
//     next()
//   }
// })
// 跳转中4
// router.beforeResolve((to, from, next) => {
//   console.log(from)
//   next()
// })
// 跳转后5
// router.afterEach((to, from) => {
//   console.log(to)
// })
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'dist/error.png',
  loading: require('common/image/default.png'),
  attempt: 1
})

Vue.prototype.$axios = Axios
Vue.use(VueAwesomeSwiper)
Vue.config.productionTip = false
fastclick.attach(document.body)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
