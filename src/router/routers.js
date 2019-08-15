const Recommend = () => import(/* webpackChunkName: "Recommend" */ 'components/recommend/recommend')
const Singer = () => import(/* webpackChunkName: "Singer" */ 'components/singer/singer')
const Search = () => import(/* webpackChunkName: "Search" */ 'components/search/search')
const Rank = () => import(/* webpackChunkName: "Rank" */ 'components/rank/rank')
const SingerDetail = () => import(/* webpackChunkName: "SingerDetail" */ 'components/singer-detail/singer-detail')
const Disc = () => import(/* webpackChunkName: "Disc" */ 'components/disc/disc')
const TopList = () => import(/* webpackChunkName: "TopList" */ 'components/top-list/top-list')
const UserCenter = () => import(/* webpackChunkName: "UserCenter" */ 'components/user-center/user-center')
export default
[
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/usercenter/:id',
    props: true,
    name: 'UserCenter',
    component: UserCenter
  },
  {
    path: '/recommend',
    name: 'Recommend',
    components: {
      default: Recommend,
      a: UserCenter
    },
    meta: {
      title: 'this is app',
      description: '我是描述'
    },
    children: [{
      path: ':id',
      name: 'Disc',
      component: Disc
    }]
    // 跳转2
    // beforeEnter (to, from, next) {
    //   console.log('要进入recommend组件了')
    //   next()
    // }
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
