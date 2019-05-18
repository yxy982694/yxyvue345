<template>
  <transition name="slide">
    <div class="add-song" @click.stop v-show="addSongFlag">
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box @inputDataChange="inputDataChange" ref="searchBox" placeholder="搜索歌曲"></search-box>
      </div>
      <div class="shortcut" v-show="!inputData">
        <switches @toggleTab="toggleTab" :switches="switches" :currentIndex="currentIndex"></switches>
        <div class="list-wrapper">
          <scroll ref="songList" :data="playHistory" class="list-scroll" v-if="currentIndex===0">
            <div class="list-inner">歌曲
              <song-list :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </scroll>
          <scroll :time="timeff" :data="searchHistory" ref="searchList" class="list-scroll" v-if="currentIndex===1">
            <div class="list-inner">
              <search-history @removeone="removeSearchHistory" @geiinput="selectHotKey" :searches="searchHistory"></search-history>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="inputData">
        <suggest @clicklist="clicklist11" @yaolundongle="yaolundongle" :inputData="inputData" :showSinger="showSinger" ref="suggest"></suggest>
      </div>
      <top-tip ref="topTip" :time="time">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">一首歌曲已经被添加到播放队列</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box'
import SearchHistory from 'base/searchHistory-list/search-history'
import Suggest from 'components/suggest/suggest'
import { mapActions, mapGetters } from 'vuex'
import { searchMixin } from 'common/js/mixin.js'
import Switches from 'base/switches/switches'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import Song from 'common/js/song'
import TopTip from 'base/top-tip/top-tip'
export default {
  mixins: [searchMixin],
  data () {
    return {
      addSongFlag: false,
      shortcutFlag: true,
      // inputData: '',
      showSinger: false,
      switches: [{name: '最近播放'}, {name: '搜索历史'}],
      currentIndex: 0,
      time: 3000 // 延迟3s隐藏top-tip.vue组件
      // timeff: 101 // 延迟101ms刷新scroll组件
    }
  },
  computed: {
    ...mapGetters(['playHistory'])
  },
  components: {
    SearchBox,
    SearchHistory,
    Suggest,
    Switches,
    Scroll,
    SongList,
    TopTip
  },
  methods: {
    show () { // 显示add-song.vue组件
      this.addSongFlag = true
      setTimeout(function () {
        if (this.currentIndex === 0) {
          this.$refs.songList.refresh()
        } else if (this.currentIndex === 1) {
          this.$refs.searchList.refresh()
        }
      }, 20)
    },
    hide () { // 隐藏add-song.vue组件
      this.addSongFlag = false
    },
    // 点击了switches.vue中的切换按钮，改变currentIndex
    toggleTab (index) {
      this.currentIndex = index
    },
    // 点击了最近播放列表中的某个歌曲
    selectSong (song, index) {
      // if (index != 0) {
      //   this.insertSong(song)
      // }
      this.insertSong(new Song(song))
      this.$refs.topTip.show()
    },
    // 点击搜索历史中的数据时
    // selectHotKey (k) {
    //   this.$refs.searchBox.setInputData(k)
    // },
    // inputDataChange (newData) { // 在input中的值发生变化时，回调
    //   this.inputData = newData
    // },
    clicklist11 () { // 点击搜索结果列表中的某一项时执行的函数
      this.clicklist()
      this.$refs.topTip.show()
    },
    // yaolundongle () { // 即将开始滚动搜索列表时执行
    //   this.$refs.searchBox.blur()
    // },
    ...mapActions(['removeSearchHistory', 'insertSong'])
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>
