<template>
  <scroll :beforeScroll="beforeScroll" class="suggest" :pullup="pullup" :pulldown="pulldown" @scrollToDown="refreshDown" :data="result" @scrollToEnd="searchMore" ref="suggest" @startScroll="startScroll">
    <ul class="suggest-list">
        <li class="suggest-item" v-for="(item, index) in result" :key="index" @click="singerOrsong(item, index)">
          <div class="icon">
            <i :class="getIconCls(item)"></i>
          </div>
          <div class="name">
            <p class="text" v-html="getDisplayName(item)"></p>
          </div>
        </li>
        <loading v-show="!hasMore" :title="title"></loading>
        <p v-show="!hasMore">没有更多</p>
    </ul>
    <div class="no-result-wrapper">
      <no-result v-show="hasMore && !result.length" :titlea="titlea"></no-result>
    </div>
  </scroll>
</template>
<script type="text/ecmascript-6">
import { search } from 'api/search.js'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { mapActions, mapMutations, mapGetters } from 'vuex'
import Singer from 'common/js/singer'
import NoResult from 'base/no-result/no-result'
// import { filterSinger } from 'common/js/song' 处理下有多个歌手的情况

const TYPE_SINGER = 'singer'
const perpage = 20
export default {
  props: {
    inputData: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      yema: 1,
      result: [],
      pullup: true,
      pulldown: true,
      hasMore: true,
      title: '',
      beforeScroll: true,
      titlea: '没有搜索到结果',
      hasSinger: false // 判断是否列表中有歌手
    }
  },
  computed: {
    ...mapGetters(['playList'])
  },
  methods: {
    singerOrsong (item, index) { // 点击列表时跳转对应歌手或者歌曲
      this.$emit('clicklist') // 把点击的事件告诉父组件，让父组件来处理
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
    },
    refresh () {
      this.$refs.suggest.refresh()
    },
    getIconCls (item) { // 根据是否含有singer 来动态添加类
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName (item) { // 根据是否含有singer 来显示不同的名称
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}--${item.singer}`
      }
    },
    _search () { // 调用接口获取搜索数据 在改变inputData时要初始化这些值
      this.hasMore = true // 为了下拉刷新时 恢复到初始位置
      this.yema = 1
      this.$refs.suggest.scrollTo(0, 0)
      search(this.inputData, this.yema, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          console.log(res)
          // this.result = this._getResult(res.data)
          // this._checkMore(res.data)
        }
      })
    },
    _checkMore (data) { // 检测此次请求之后是否还有更多数据
      console.log('_checkMore')
      const song = data.song
      if (!song.list.length || (song.curnum + (song.curpage - 1) * perpage) >= song.totalnum) {
        this.hasMore = false
      }
    },
    searchMore () { // 在滚动到底部时执行这个方法
      console.log('searchMore')
      if (!this.hasMore) {
        return
      }
      this.yema++
      search(this.inputData, this.yema, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) { // 把后来加载的数据合并到之前的数据，组成一个新的数组
          // console.log(res)
          // this.result = res.result.concat(this._getResult(res.data))
          // this._checkMore(res.data)
        }
      })
    },
    startScroll () { // 即将开始滚动搜索列表
      this.$emit('yaogundongle')
    },
    refreshDown () { // 下拉刷新
      console.log('refreshDown')
      this._search()
    },
    _normalizeSongs (list) {
      console.log('_normalizeSongs')
      let ret = []
      list.forEach((item) => {
        let {musicData} = item
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    _getResult (data) { // 处理获得的数据  歌手信息和歌曲列表信息
      console.log('_getResult')
      let ret = []
      // this.showSinger来决定data中是否含有zhida字段
      // 根据输入的inputData来决定是否有data.zhida.singerid
      if (data.zhida && data.zhida.singerid) { // 把歌手的信息放进去
        this.hasSinger = true // 有歌手
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      if (data.song) { // 把与关键词相关的歌曲放进去
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },
    ...mapActions(['selectPlay', 'insertSong']), // 会调用actions.js中的全部方法
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  watch: {
    inputData () {
      this._search()
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
