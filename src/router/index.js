import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers.js'
// import Recommend from 'components/recommend/recommend'
// import Singer from 'components/singer/singer'
// import Search from 'components/search/search'
// import Rank from 'components/rank/rank'
// import SingerDetail from 'components/singer-detail/singer-detail'
// import Disc from 'components/disc/disc'
// import TopList from 'components/top-list/top-list'
// import UserCenter from 'components/user-center/user-center'
Vue.use(Router)
// console.log(99)
// export default new Router({
//   mode: 'history',
//   routes
// })

export default () => {
  return new Router({
    mode: 'history',
    routes,
    scrollBehavior (to, from, savedPosition) {
      // console.log(from)
      // console.log(to)
      // console.log(savedPosition)
      if (savedPosition) {
        return savedPosition
      } else {
        return { x: 0, y: 0 }
      }
    },
    fallback: false
    // base: '/base/',
    // linkActiveClass: 'active-link',
    // linkExactActiveClass: 'exact-active-link'
  })
}
