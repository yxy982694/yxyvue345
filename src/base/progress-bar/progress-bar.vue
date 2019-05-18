<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent="start" @touchmove.prevent="move" @touchend="end">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { prefixStyle } from 'common/js/dom.js'
const transform = prefixStyle('transform')
const progressBtnWidth = 16
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    start (e) {
      this.touch.init = true
      this.touch.startX = e.touches[0].pageX // 手指刚接触屏幕时，距离屏幕左边的距离
      this.touch.left = this.$refs.progress.clientWidth // 小球距离进度条左边的距离
    },
    move (e) {
      if (!this.touch.init) { // 必须要经过start
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX // 手指移动的距离 有可能为负值
      // console.log('进度条长度：' + this.$refs.progressBar.clientWidth)
      // console.log('当前播放进度条长度：' + Math.max(0, this.touch.left + deltaX))
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
      this._offsetWidth(offsetWidth)
    },
    end () {
      this._triggerPercent()
      this.touch.init = false
    },
    _triggerPercent () { // 计算拖动进度条后 播放进度条的占比
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const progressWidth = this.$refs.progress.clientWidth // 是通过执行_offsetWidth()计算出来的
      const baifenbi = progressWidth / barWidth
      // console.log('拖动后占比：' + baifenbi)
      this.$emit('percentChange', baifenbi)
    },
    _offsetWidth (offsetWidth) { // 小球距离进度条左边的距离  播放进度的距离 封装起来
      // 加上min 为了兼容在点击最外层进度条的最右边时，
      // 让偏移量为this.$refs.progressBar.clientWidth - progressBtnWidth
      const width = Math.min(offsetWidth, this.$refs.progressBar.clientWidth - progressBtnWidth)
      this.$refs.progress.style.width = `${width}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${width}px, 0, 0)`
    },
    progressClick (e) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      this._offsetWidth(offsetWidth)
      // this._offsetWidth(e.offsetX) // 为了获取偏移量 和 当前播放进度
      this._triggerPercent() // 为了获得点击后，新的播放占比 为了把baifenbi传给player.vue组件
    }
  },
  watch: {
    percent (newPercent) {
      // console.log('是否拖动了:' + this.touch.init)
      if (newPercent >= 0 && !this.touch.init) {
      // 在拖动小球时，音乐也在播放中 percent
      // 也在改变中 移动时小球的偏移量会改变 percent改变时小球的偏移量也在改变
      // 要让移动时的优先级高
        // console.log('正常播放情况下，播放进度占比:' + newPercent)
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offsetWidth = newPercent * barWidth
        this._offsetWidth(offsetWidth)
      }
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
