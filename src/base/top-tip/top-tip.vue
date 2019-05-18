<template>
  <transition name="drop">
    <div class="top-tip" v-show="!topTipFlag" @click.stop="hide">
      <slot></slot>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    time: {
      type: Number,
      default: 2000
    }
  },
  data () {
    return {
      topTipFlag: false,
      timer: null
    }
  },
  methods: {
    show () {
      this.topTipFlag = true
      if (this.timer != null) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(function () {
        this.hide()
      }, this.time)
    },
    hide () {
      this.topTipFlag = true
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .top-tip
    position: fixed
    top: 0
    width: 100%
    z-index: 500
    background: $color-dialog-background
    &.drop-enter-active, &.drop-leave-active
      transition: all 0.3s
    &.drop-enter, &.drop-leave-to
      transform: translate3d(0, -100%, 0)
</style>
