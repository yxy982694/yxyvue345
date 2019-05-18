import Vue from 'vue'
import Router from 'vue-router'
// import Recommend from 'components/recommend/recommend'
// import Singer from 'components/singer/singer'
// import Search from 'components/search/search'
// import Rank from 'components/rank/rank'
// import SingerDetail from 'components/singer-detail/singer-detail'
// import Disc from 'components/disc/disc'
// import TopList from 'components/top-list/top-list'
// import UserCenter from 'components/user-center/user-center'
const Recommend = () => import(/* webpackChunkName: "Recommend" */ 'components/recommend/recommend')
const Singer = () => import(/* webpackChunkName: "Singer" */ 'components/singer/singer')
const Search = () => import(/* webpackChunkName: "Search" */ 'components/search/search')
const Rank = () => import(/* webpackChunkName: "Rank" */ 'components/rank/rank')
const SingerDetail = () => import(/* webpackChunkName: "SingerDetail" */ 'components/singer-detail/singer-detail')
const Disc = () => import(/* webpackChunkName: "Disc" */ 'components/disc/disc')
const TopList = () => import(/* webpackChunkName: "TopList" */ 'components/top-list/top-list')
const UserCenter = () => import(/* webpackChunkName: "UserCenter" */ 'components/user-center/user-center')
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/usercenter',
      name: 'UserCenter',
      component: UserCenter
    },
    {
      path: '/recommend',
      name: 'Recommend',
      component: Recommend,
      children: [{
        path: ':id',
        name: 'Disc',
        component: Disc
      }]
    },
    {
      path: '/singer',
      name: 'Singer',
      component: Singer,
      children: [{
        path: ':id',
        name: 'SingerDetail',
        component: SingerDetail
      }]
    },
    {
      path: '/search',
      name: 'Search',
      component: Search,
      children: [{
        path: ':id',
        component: SingerDetail
      }]
    },
    {
      path: '/rank',
      name: 'Rank',
      component: Rank,
      children: [{
        path: ':id',
        name: 'TopList',
        component: TopList
      }]
    }
  ]
})
