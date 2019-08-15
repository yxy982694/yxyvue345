<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
          <slider>
            <swiper-slide v-for="item in recommends" :key="item.id">
              <a :href="item.linkUrl">
                <img class="needsclick" @load="loadImage" :src="item.picUrl">
              </a>
            </swiper-slide>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="list in discList" class="item" :key="list.id" @click="selectItem(list)">
              <div class="icon">
                <img width="60" height="60" v-lazy="list.picUrl" alt="">
              </div>
              <div class="text">
                <h2 class="name">好汉歌</h2>
                <p class="desc">刘欢</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading :title='title'></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script type="text/ecmascript-6">
import Slider from 'base/slider/slider'
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import { getRecommend } from 'api/recommend'
import {ERR_OK} from 'api/config'
import { playListMixin } from 'common/js/mixin.js'
import { mapMutations } from 'vuex'
export default {
  mixins: [playListMixin],
  // 路由跳转3
  beforeRouteEnter (to, from, next) {
    console.log('this.title')
    next(vm => {
      console.log(vm.title)
    })
  },
  // 同一个路由组件 不同的参数
  beforeRouteUpdate (to, from, next) {
    console.log('发发发')
    next()
  },
  beforeRouteLeave (to, from, next) {
    console.log('this.title')
    if (global.confirm('are you sure?')) {
      next()
    }
  },
  mounted () {
    console.log('mounted')
  },
  data () {
    return {
      recommends: [],
      discList: [],
      title: '我是张三，你是谁啊，加载中'
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  },
  created () {
    // setTimeout(() => {
    //   this._getRecommend()
    // }, 1000)
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
    handlePlayList (playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
      // console.log('bottom')
    },
    _getRecommend () { // 获取轮播图片
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    },
    _getDiscList () { // 获取下面的列表数据
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          // this.discList = res.data.slider
          this.discList = [{
            id: '001',
            picUrl: '//img1.360buyimg.com/da/s590x470_jfs/t1/55846/4/204/70034/5cd3871fEc33bcb92/406b9ea12f31d828.jpg!q90!cc_590x470.webp'
          }, {
            id: '002',
            picUrl: '//img1.360buyimg.com/da/s590x470_jfs/t1/55846/4/204/70034/5cd3871fEc33bcb92/406b9ea12f31d828.jpg!q90!cc_590x470.webp'
          }, {
            id: '003',
            picUrl: '//img1.360buyimg.com/da/s590x470_jfs/t1/55846/4/204/70034/5cd3871fEc33bcb92/406b9ea12f31d828.jpg!q90!cc_590x470.webp'
          }, {
            id: '004',
            picUrl: '//img1.360buyimg.com/da/s590x470_jfs/t1/55846/4/204/70034/5cd3871fEc33bcb92/406b9ea12f31d828.jpg!q90!cc_590x470.webp'
          }, {
            id: '005',
            picUrl: '//img1.360buyimg.com/da/s590x470_jfs/t1/55846/4/204/70034/5cd3871fEc33bcb92/406b9ea12f31d828.jpg!q90!cc_590x470.webp'
          }, {
            id: '006',
            picUrl: '//img1.360buyimg.com/da/s590x470_jfs/t1/55846/4/204/70034/5cd3871fEc33bcb92/406b9ea12f31d828.jpg!q90!cc_590x470.webp'
          }]
          // console.log(this.discList)
        }
      })
    },
    loadImage () { // 轮播图片加载时，执行一次滚动组件的刷新功能
      if (!this.checkLoaded) { // 只执行1次
        // alert('图片加载了')
        this.checkLoaded = true
        // let that = this
        // setTimeout(function () {
        // that.$refs.scroll.refresh()
        // }, 8000)
        // this.$refs.scrollre.refresh()
        // console.log('tupian')
      }
    },
    selectItem (item) {
      console.log('id: ' + item.id)
      this.$router.push({
        path: `/recommend/${item.id}`
      })
      this.setSingerId('002J4UUk29y8BY')
      this.setDisc(item)
    },
    ...mapMutations({
      setDisc: 'SET_DISC',
      setSingerId: 'SET_SINGERID'
    })
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    overflow-y: scroll !important
    .recommend-content
      height: auto
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
        img
          width: 100%
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
