<template>
  <div class="player" v-show="playList.length > 0">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle" @touchstart="middleTouchStart" @touchmove="middleTouchMove" @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p :class="{'current': currentLineNum === index}" class="text" ref="lyricLine" v-for="(line, index) in currentLyric.lines" :key="index">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <!-- :class="{'active':currentShow==='cd'}" -->
        <!-- :class="{'active':currentShow==='lyric'}" -->
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar @percentChange="baifenbichange" :percent="percent"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="toggleMoshi">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" @click="shangyiqu" :class="disableCls">
              <i class="icon-prev"></i>
            </div>
            <div class="icon i-center" @click="togglePlaying" :class="disableCls">
              <i :class="playIcon"></i>
            </div>
            <div class="icon i-right" @click="xiayiqu" :class="disableCls">
              <i class="icon-next"></i>
            </div>
            <div class="icon i-right" @click="shoucang(currentSong)">
              <i :class="[likeFlag?'icon-favorite':'icon-not-favorite','icon']"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :class="cdCls" width="40" height="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control" @click.stop="togglePlaying">
          <progress-circle :percent="percent" :radius="radius">
            <i :class="playIconMin" class="icon-mini"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="openList">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>
    <audio @timeupdate="bofangzhong" @ended="end"  @play="ready" @error="error" ref="audio" :src="currentSong.url"></audio>
  </div>
</template>
<script type="text/ecmascript-6">
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playerMixin } from 'common/js/mixin.js'
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'common/js/dom'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import { playMode } from 'common/js/config.js'
import Scroll from 'base/scroll/scroll'
import Lyric from 'lyric-parser'
import Playlist from 'components/playlist/playlist'
// import { getLyric } from 'api/song.js' // 获取每首歌曲的歌词
// import { ERR_OK } from 'api/config' // 调取接口成功时的标志位
const transform = prefixStyle('transform')
const transition = prefixStyle('transition')
export default {
  mixins: [playerMixin],
  data () {
    return {
      songReady: false, // 歌曲是否加载就绪
      currentTime: 0,
      radius: 32,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      touch: {},
      playingLyric: '',
      likeFlag: false
    }
  },
  computed: {
    ...mapGetters([
      'fullScreen',
      // 'playList',
      // 'currentSong',
      'playing',
      'currentIndex'
      // 'mode',
      // 'sequenceList'
    ]),
    percent () { // 当currentTime改变时，会执行
      return Math.min(this.currentTime / this.currentSong.duration, 1)
    },
    playIcon () { // 判断是否播放 切换播放/暂停样式 在全屏时
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    playIconMin () { // 判断是否播放 切换播放/暂停样式 在迷你版时
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdCls () { // 判断是否播放 切换cd图片是旋转还是暂停
      return this.playing ? 'play' : 'play pause'
    },
    disableCls () { // 歌曲是否准备好 几个按钮是置灰还是正常
      return this.songReady ? '' : 'disable'
    }
    // iconMode () { // 根据播放模式 来显示对应模式的样式
    //   return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    // }
  },
  methods: {
    back () { // 打开mini版
      this.setFullScreen(false)
    },
    open () { // 打开全屏版
      this.setFullScreen(true)
    },
    openList () { // 打开列表 在mini中点击的列表
      this.$refs.playlist.showPlaylist()
    },
    // 点击按钮后收藏歌曲
    shoucang (song) {
      this.likeFlag = !this.likeFlag
      if (this.likeFlag) {
        this.deleteShouCang(song)
      } else {
        this.saveShouCang(song)
      }
    },
    ...mapMutations({ // 设置全屏/mini模式参数
      setFullScreen: 'SET_FULL_SCREEN'
      // setPlaying: 'SET_PLAYING_STATE'
      // setCurrentIndex: 'SET_CURRENT_INDEX',
      // setPlayMode: 'SET_PLAY_MODE',
      // setPlayList: 'SET_PLAYLIST'
    }),
    ...mapActions(['savePlayHistory', 'saveShouCang', 'deleteShouCang']),
    enter (el, done) { // transition显示时
      const {x, y, scale} = this._getPosAndScale()
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.2)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      }
      // 注册动画
      animations.registerAnimation({
        name: 'move', // 动画名称
        animation, // 动画
        presets: {
          duration: 800,
          easing: 'linear'
        }
      })
      // 运行动画
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      // console.log('enter')
    },
    afterEnter () { // 过渡执行完，取消过渡
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave (el, done) { // transition离开时 缩小的过渡效果
      this.$refs.cdWrapper.style.transition = 'all 0.8s'
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave () { // 在过渡完成时，取消过渡
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    _getPosAndScale () { // 获取缩放比例和两个中心的相对位置
      const targetWidth = 40 // 左下角图片宽度为40
      const paddingTop = 80 // middle的padding-top为80
      const paddingBottom = 30 // mini的高度为60 是一半
      const paddingLeft = 40 // mini的padding-left为20 图片宽度的一半为20 求和
      const width = window.innerWidth * 0.8 // 大图的宽度为整个屏幕的80%
      const scale = targetWidth / width // 缩放比例
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - paddingBottom - width / 2
      return {
        x,
        y,
        scale
      }
    },
    togglePlaying () { // 改变播放状态 改变playing的值 点击按钮时
      if (!this.songReady) {
        return
      }
      try {
        this.setPlaying(!this.playing)
      } catch (e) {
        // console.log(e)
      }
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    shangyiqu () {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
        return
        // this.songReady = false
      }
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playList.length - 1
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    xiayiqu () {
      console.log('253this.currentIndex:' + this.currentIndex)
      console.log('254this.playing:' + this.playing)
      console.log('255this.songReady:' + this.songReady)
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
        return
        // this.songReady = false
      }
      let index = this.currentIndex + 1
      if (index === this.playList.length) {
        index = 0
      }
      // console.log(index)
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    ready () { // canplay事件的回调函数
      console.log('准备就绪')
      // console.log(this.currentSong)
      this.songReady = true
      this.savePlayHistory(this.currentSong)
    },
    error () { // error事件的回调函数
      // console.log('发生错误')
      this.songReady = true
    },
    bofangzhong (e) { // 获取播放的当前时间 timeupdate事件的回调函数
      this.currentTime = e.target.currentTime
      // console.log('当前时长：' + this.currentTime)
      // console.log('总时长：' + this.currentSong.duration)
    },
    format (interval) { // 求分秒 直接应用在template中了
      interval = interval | 0 // 取整
      const minute = interval / 60 | 0 // 分
      const second = this._pad(interval % 60) // 秒
      return `${minute}:${second}`
    },
    _pad (num, n = 2) { // 不足2位的前面补个0
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    baifenbichange (baifenbi) { // 拖动进度条结束时触发的函数
    // this.$refs.audio.currentTime变化时，会改变bofangzhong方法里的this.currentTime
    // this.currentTime改变时，会执行计算属性里的percent
      const bofangtime = baifenbi * this.currentSong.duration // 单位是s
      this.$refs.audio.currentTime = bofangtime
      // console.log('是否正在播放中：' + this.playing)
      this.$nextTick(() => {
        this.$refs.audio.play()
      })
      if (!this.playing) {
        this.togglePlaying()
      }
      if (this.currentLyric) { // 歌词从头开始
        this.currentLyric.seek(bofangtime * 1000) // 单位是ms
      }
    },
    // toggleMoshi () { // 切换模式  顺序  单曲循环  随机
    //   const mode = (this.mode + 1) % 3
    //   this.setPlayMode(mode)
    //   let list = []
    //   if (mode === playMode.random) {
    //     list = shuffle(this.sequenceList) // 打乱数组顺序
    //   } else {
    //     list = this.sequenceList
    //   }
    //   // 找到正在播放的歌曲在打乱后的数组中的索引
    //   this.resetCurrentIndex(list)
    //   this.setPlayList(list) // 把打乱的数组给playList数组
    // },
    // resetCurrentIndex (list) { // 返回指定元素在数组中的索引
    //   let index = list.findIndex((item) => {
    //     return item.id === this.currentSong.id
    //   })
    //   this.setCurrentIndex(index)
    // },
    end () { // 音乐播放完成时
      console.log('播放完毕' + this.mode)
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.xiayiqu()
      }
    },
    loop () { // 单曲循环模式
      this.currentSong.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) { // 歌词从头开始
        this.currentLyric.seek(0)
      }
    },
    _getLyric () { // 处理base64处理后的字符串 得到我们想要的数据格式
      this.currentSong.getLyric().then((lyric) => {
        // 当我们快速切换下一曲 但是上一首的歌词还没有请求过来时
        // 此时this.currentSong变化了  但是lyric还没变，因为它还没有从
        // 服务器端拿到数据  此时它还是上一首的歌词
        if (this.currentSong.lyric !== lyric) {
          return
        }
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
        // console.log(this.currentLyric)
      }).catch((e) => {
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
      // this.$axios('../static/json/shuju.json').then((res) => {
      //   if (res.data.total === 100) {
      //     this.lyrics = this._normalizeLyric(res.data.rows)
      //     console.log(this.lyrics)
      //   }
      // })
    },
    handleLyric ({lineNum, txt}) { // 当歌词播放时，不断回调这个函数
      // console.log('lineNum' + lineNum)
      this.currentLineNum = lineNum
      if (lineNum > 3) {
        let lineEl = this.$refs.lyricLine[lineNum - 3]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    middleTouchStart (e) {
      this.touch.initdd = true
      const touch = e.touches[0]
      this.touch.startX = touch.pageX // 手指刚接触屏幕时，距离屏幕左边的距离
      this.touch.startY = touch.pageY
    },
    middleTouchMove (e) {
      if (!this.touch.initdd) { // 必须要经过start
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX // 手指移动的距离 有可能为负值
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) - Math.abs(deltaX) > 0) {
      // 之所以写Y是因为，在歌词部分即使你的手指没有动，由于歌词在滚动，也会产生Y轴的滚动距离
        return
      }
      // 初始化middle-r移动的距离
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      // middle-r实际移动的距离 范围 0到-屏幕的宽度
      const yidongwidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(yidongwidth / window.innerWidth)
      // 通过transform实现移动
      this.$refs.lyricList.$el.style[transform] = `translate3d(${yidongwidth}px, 0, 0)`
      this.$refs.lyricList.$el.style[transition] = `transform 0`
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style[transition] = `opacity 0`
    },
    middleTouchEnd (e) {
      this.touch.initdd = false
      let yidongwidth
      let opacity
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          yidongwidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          yidongwidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          yidongwidth = 0
          this.currentShow = 'cd'
          opacity = 1
        } else {
          yidongwidth = -window.innerWidth
          opacity = 0
        }
      }
      const time = 300
      this.$refs.lyricList.$el.style[transform] = `translate3d(${yidongwidth}px, 0, 0)`
      this.$refs.lyricList.$el.style[transition] = `transform ${time}ms`
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style[transition] = `opacity ${time}ms`
    }
  },
  watch: {
    currentSong (newSong, oldSong) { // 监听当歌曲改变时 开始播放
      console.log('445this.currentIndex:' + this.currentIndex)
      console.log('446this.playing:' + this.playing)
      // 如果删除了一首歌曲，currentIndex改变了，最后仅剩一首歌曲时
      // 再删除掉，就没有newSong了
      if (!newSong.id) {
        return
      }
      if (oldSong.id === newSong.id) {
        return
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
        this.currentTime = 0
        this.playingLyric = ''
        this.currentLineNum = 0
      }
      clearTimeout(this.timer)
      this.timer = setTimeout(function () {
        this.$refs.audio.play() // 在歌曲改变时，此次歌曲开始播放
        this._getLyric() // 在歌曲改变时，获取此次歌曲的歌词
      }, 1000)
      // this.$nextTick(() => {
      //   this.$refs.audio.play() // 在歌曲改变时，此次歌曲开始播放
      //   this._getLyric() // 在歌曲改变时，获取此次歌曲的歌词
      // })
    },
    playing (newState) { // 监听playing值的改变  来决定是播放还是暂停
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newState ? audio.play() : audio.pause()
      })
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
    Playlist
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
