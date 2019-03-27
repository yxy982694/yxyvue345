<template>
  <swiper :options="swiperOption">
    <slot></slot>
    <div class="swiper-pagination"  slot="pagination"></div>
  </swiper>
</template>
<script>
export default {
  name: 'slider',
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Number,
      default: 5000
    }
  },
  data () {
    return {
      swiperOption: {
        autoplay: this.autoPlay,
        loop: this.loop,
        pagination: '.swiper-pagination'
      }
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  >>>.swiper-pagination-bullet-active
    background: #f00
    width: 30px
    height: 8px
    border-radius: 10px
</style>
