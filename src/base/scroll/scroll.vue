<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>
<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: { // 让我们的scroll要不要监听滚动事件
      type: Boolean,
      default: false
    },
    pullup: {
      type: Boolean,
      default: false
    },
    pulldown: {
      type: Boolean,
      default: false
    },
    beforeScroll: { // 是否监听开始滚动事件
      type: Boolean,
      default: false
    },
    time: {
      type: Number,
      default: 20
    }
  },
  mounted () {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll () {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
      if (this.listenScroll) {
        let me = this
        this.scroll.on('scroll', (pos) => {
          me.$emit('scroll', pos)
          // console.log(pos)
        })
      }
      if (this.pullup) {
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            this.$emit('scrollToEnd')
          }
        })
      }
      if (this.pulldown) {
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y > 0) {
            this.$emit('scrollToDown')
          }
        })
      }
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('startScroll')
        })
      }
    },
    enable () {
      this.scroll && this.scroll.enable()
    },
    disable () {
      this.scroll && this.scroll.disable()
    },
    destroy () {
      this.scroll && this.scroll.destroy()
    },
    refresh () {
      // alert('我刷新了')
      this.scroll && this.scroll.refresh()
    },
    scrollTo () {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement () {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    data (newdata) {
      // console.log(newdata)
      setTimeout(() => {
        this.refresh()
        // alert('数据变了')
      }, this.time)
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
