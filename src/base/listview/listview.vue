<template>
  <scroll class="listview" :data="data" ref="listview" :listenScroll="listenScroll" @scroll="scroll" :probeType="probeType">
    <ul>
      <li v-for="(group, index) in data" class="list-group" :key="index" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" :key="item.id" class="list-group-item">
            <img v-lazy="item.avatar" class="avatar" />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList" :key="index" :data-index="index" :class="{'current':currentIndex===index}" class="item">{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import getData from 'common/js/dom' // 通过属性获取属性值
const ANCHOR_HEIGHT = 18 // 右侧字母表中每个字母的高度
const TITLE_HEIGHT = 30 // 标题的高度
export default {
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      scrollY: -1, // 滚动的距离
      currentIndex: 0, // 当前显示的是哪个元素 通过滚动左侧歌手计算来的
      listenHeight: [], // 把第0个group的高度，第0+1个，第0+1+2个，...等等的高度保存到数组中
      probeType: 3,
      diff: -1
    }
  },
  created () {
    this.touch = {}
    this.listenScroll = true
  },
  computed: {
    shortcutList () {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    refresh () {
      this.$refs.listview.refresh()
    },
    onShortcutTouchStart (e) { // 手指触摸事件 相当于点击事件
      let anchorIndex = getData(e.target, 'index')
      this.touch.anchorIndex = anchorIndex
      let firstTouch = e.touches[0] // 手指首先接触的点
      this.touch.y1 = firstTouch.pageY
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove (e) { // 手指滑动事件
      let lastTouch = e.touches[0] // 手指最后接触的点
      this.touch.y2 = lastTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0 // 取整
      let anchorIndex = this.touch.anchorIndex + delta
      this._scrollTo(anchorIndex)
    },
    selectItem (item) {
      // console.log(item)
      this.$emit('select', item)
    },
    scroll (pos) { // 通过子组件触发的滚动事件 可以获得滚动距离
      this.scrollY = pos.y // 滚动左侧的歌手时，滚动高度 是个负值
    },
    _scrollTo (index) { //  点击右侧的字母表时 滑动右侧的字母表时
      // 让左侧歌手滚动的距离  滚动到指定的元素
      if (!index && index !== 0) { // 如果index为null时，什么都不做
        // 在点击字母表的头和底时，做的边界处理
        return
      }
      // 在滑动到头和底部时做的边界处理
      if (index < 0) { // index的取值必须在0到this.listenHeight.length-2之间
        // 或者是0到this.$refs.listGroup.length-1之间
        index = 0
      } else if (index > this.listenHeight.length - 2) {
        index = this.listenHeight.length - 2
      }
      console.log(index)
      this.scrollY = -this.listenHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    _calculateHeight () { // 让左侧的歌手形成一个数组
      this.listenHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listenHeight.push(height) // 为什么把0放到里面作第一元素？？
      // 为了与newY进行比较，形成前后2个值
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight // item是个dom元素，可以通过clientHeight获取它的高度
        this.listenHeight.push(height)
      }
    }
  },
  watch: {
    data () { // 只要data数据变化，就会计算每个group的高度
      // 让左侧的歌手列表也形成一个数组，为了与右侧的字母表数组形成对照
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY (newY) { // 滚动后，滚动y的值 在滚动左侧歌手的过程中当前index是几
      // 来让对应字母表中的第几个字母高亮显示
      const listenHeight = this.listenHeight
      // console.log(newY)
      // 当滚动到顶部，newY>0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限  8500可以先假定下
      if (-newY > listenHeight[listenHeight.length - 1]) {
        console.log('kkk')
        this.currentIndex = listenHeight.length - 2
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < listenHeight.length - 1; i++) { // for循环并没有执行,之前少写了个length
        let height1 = listenHeight[i]
        let height2 = listenHeight[i + 1]
        // console.log(i)
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i // newY落在哪个区间，当前对应的字母索引就是i
          // 就可以给list中谁的索引与this.currentIndex相等就给添加类
          // console.log(this.currentIndex)
          this.diff = height2 + newY // 获取滚动高度与上限的差值
          // console.log(this.diff)
          return
        }
      }
    },
    diff (newVal) { // diff在变化，实时监控diff的变化 newVal是最新的差值
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      // console.log(fixedTop)
      if (this.fixedTop === fixedTop) {
        // 在滚动到不是临界处时，也就是fixedTop为0时  不执行下面的代码
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  components: {
    Scroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
