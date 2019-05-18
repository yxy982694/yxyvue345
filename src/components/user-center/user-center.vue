<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="fanhui">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches :switches="switches" :currentIndex="currentIndex" @toggleTab="toggleTab"></switches>
      </div>
      <div class="play-btn" ref="playBtn" @click="randomfn">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <div v-if="currentIndex === 0">
          <scroll ref="shoucangList" :data="shoucangList" class="list-scroll" v-if="currentIndex === 0">
            <div class="list-inner">我喜欢的
              <song-list :songs="shoucangList" @select="selectSong"></song-list>
            </div>
          </scroll>
        </div>
        <scroll ref="songList" :data="playHistory" class="list-scroll" v-if="currentIndex === 1">
          <div class="list-inner">最近播放
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <top-tip ref="topTip" :time="time" style="text-align:center;line-height:50px;">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">一首歌曲已经被添加到播放队列</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
import Switches from 'base/switches/switches'
import SongList from 'base/song-list/song-list'
import { mapActions, mapGetters } from 'vuex'
import Song from 'common/js/song'
import TopTip from 'base/top-tip/top-tip'
import Scroll from 'base/scroll/scroll'
export default {
  data () {
    return {
      switches: [{name: '我喜欢的'}, {name: '最近播放'}],
      currentIndex: 0,
      time: 3000, // 3s后top-tip自动隐藏,
      randomArr: []
    }
  },
  computed: {
    ...mapGetters(['playHistory', 'shoucangList'])
  },
  methods: {
    // 点击返回箭头，返回上个页面
    fanhui () {
      this.$router.back()
    },
    randomfn () { // 经过缓存处理的歌曲都要通过Song类处理下
      if (this.currentIndex === 0) {
        this.randomArr = this.shoucangList
      } else if (this.currentIndex === 1) {
        this.randomArr = this.playHistory
      }
      this.randomArr = this.randomArr.map((song) => {
        return new Song(song)
      })
      this.randomPlay({
        list: this.randomArr
      })
      alert('开始随机播放了')
    },
    // 点击切换按钮，切换到对应的模块
    toggleTab (index) {
      this.currentIndex = index
    },
    // 点击了最近播放中的某首歌曲
    selectSong (song) {
      this.insertSong(new Song(song))
      this.$refs.topTip.show()
    },
    ...mapActions(['insertSong', 'randomPlay'])
  },
  components: {
    Switches,
    SongList,
    TopTip,
    Scroll
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
