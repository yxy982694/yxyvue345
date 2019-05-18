<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"></circle><!-- 内层的圆 -->
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dasharray" :stroke-dashoffset="dashoffset"></circle><!-- 外层的圆 -->
    </svg>
    <slot></slot>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    radius: { // 定义画布的宽高
      type: Number,
      default: 100
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      dasharray: Math.PI * 100
    }
  },
  computed: {
    dashoffset () {
      return (1 - this.percent) * this.dasharray
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-circle
    position: relative
    circle
      stroke-width: 8px
      transform-origin: center
      &.progress-background
        transform: scale(0.9)
        stroke: $color-theme-d
      &.progress-bar
        transform: scale(0.9) rotate(-90deg) // -90度为了让从顶部开始转
        stroke: $color-theme
</style>
