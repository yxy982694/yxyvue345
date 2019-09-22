// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 创建分支8152
import Vue from 'vue'
import App from './App'
import createRouter from './router'
import 'common/stylus/index.styl'
import fastclick from 'fastclick'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueResource from 'vue-resource'
import './swiper/dist/css/swiper.css'
import Axios from 'axios'
import VueLazyload from 'vue-lazyload'
import Vuex from 'vuex'
import CreateStore from './store/index.js'
Vue.use(Vuex)
Vue.use(VueResource)
// Vue.http.options.root = '/root'
// console.log(Vue.http.headers)
// console.log(Vue.$http)
const store = CreateStore()
const router = createRouter()
// 跳转前1
router.beforeEach((to, from, next) => {
  console.log('公共beforeEach')
  next()
  // if (to.fullPath === '/singer') {
  //   next('/usercenter/123')
  // } else {
  //   next()
  // }
})
// 跳转中4
router.beforeResolve((to, from, next) => {
  console.log('公共beforeResolve')
  next()
})
// 跳转后5
router.afterEach((to, from) => {
  console.log('公共afterEach')
})
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'dist/error.png',
  loading: require('common/image/default.png'),
  attempt: 1
})
// Vue.http.interceptors[Vue.http.interceptors.length - 1].request()
Vue.prototype.$axios = Axios
Vue.use(VueAwesomeSwiper)
Vue.config.productionTip = false
fastclick.attach(document.body)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  data: {
    name: 'zhangsan'
  },
  components: { App },
  template: '<App/>'
})
