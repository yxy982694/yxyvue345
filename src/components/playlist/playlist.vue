<template>
  <transition name="list-fade">
    <div class="playlist" @click="closePlaylist" v-show="playlistFlag">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click.stop="toggleMoshi"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click.stop="qingkong"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll :time="time" ref="scroll" :data="sequenceList" class="list-content">
          <transition-group tag="ul" name="list">
            <li ref='songLists' @click='selectItem(item, index)' class="item" v-for="(item, index) in sequenceList" :key="item.id">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like" @click.stop="shoucang(item, index)">
                <i ref="like" class="icon-not-favorite"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click.stop="addSongfn">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click.stop="closePlaylist">
          <span>关闭</span>
        </div>
      </div>
      <confirm text="是否清空列表歌曲" confirmBtnText="清空" ref="confirm" @quEvent="clearList"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
import { mapMutations, mapActions } from 'vuex'
import Scroll from 'base/scroll/scroll'
import { playMode } from 'common/js/config.js'
import Confirm from 'base/confirm/confirm'
// import { shuffle } from 'common/js/shuffle.js' // 引入打乱的数组
import { playerMixin } from 'common/js/mixin.js'
import AddSong from 'components/add-song/add-song'
export default {
  mixins: [playerMixin],
  data () {
    return {
      playlistFlag: false,
      time: 101
    }
  },
  computed: {
    // ...mapGetters(['sequenceList', 'currentSong', 'mode', 'playList']),
    // iconMode () { // 根据播放模式 来显示对应模式的样式
    //   return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    // }
    modeText () {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.loop ? '单曲循环' : '随机播放'
    }
  },
  methods: {
    // 关闭这个列表
    closePlaylist () {
      this.playlistFlag = false
    },
    // 打开这个列表
    showPlaylist () { // 在组件显示时，延时刷新一下scroll组件
      this.playlistFlag = true
      setTimeout(() => {
        this.$refs.scroll.refresh()
        if (!this.currentSong) {
          this.scrollToCurrent(this.currentSong)
        }
      }, 20)
    },
    // 点击按钮后收藏歌曲
    shoucang (song, index) {
      if (this.$refs.like[index].classList.contains('icon-favorite')) {
        this.$refs.like[index].classList.remove('icon-favorite')
        this.$refs.like[index].classList.add('icon-not-favorite')
        this.deleteShouCang(song)
      } else if (this.$refs.like[index].classList.contains('icon-not-favorite')) {
        this.$refs.like[index].classList.remove('icon-not-favorite')
        this.$refs.like[index].classList.add('icon-favorite')
        this.saveShouCang(song)
      }
    },
    addSongfn () { // 打开add-song.vue组件
      this.$refs.addSong.show()
    },
    deleteOne (item) { // 删除一首歌曲
      this.deleteSong(item)
      // 当列表中的歌曲全部删除了，让这个列表关闭掉
      if (!this.playList.length) {
        this.closePlaylist()
      }
    },
    getCurrentIcon (item) { // 添加当前播放歌曲的样式
      return item.id === this.currentSong.id ? 'icon' : ''
    },
    selectItem (item, index) { // 点击了某个歌曲后执行的函数
      let suoyin
      this.setPlaying(true)
      if (this.mode === playMode.random) {
        suoyin = this.resetzhidingCurrentIndex(this.playList, item)
      } else {
        suoyin = index
      }
      this.setCurrentIndex(suoyin)
    },
    resetzhidingCurrentIndex (list, jj) { // 返回指定元素在数组中的索引
      let index = list.findIndex((item) => {
        return item.id === jj.id
      })
      return index
    },
    scrollToCurrent (current) { // 滚动到正在播放的歌曲位置
      const index = this.resetCurrentIndex(this.sequenceList, current)
      this.$refs.scroll.scrollToElement(this.$refs.songLists[index], 3000)
    },
    qingkong () { // 点击清空数据按钮，回调
      this.$refs.confirm.show()
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
    //   this.setCurrentIndex(this.resetCurrentIndex(list, this.currentSong))
    //   this.setPlayList(list) // 把打乱的数组给playList数组
    // },
    ...mapMutations({
      // 'setCurrentIndex': 'SET_CURRENT_INDEX',
      // 'setPlaying': 'setPlaying_STATE'
      // 'setPlayMode': 'SET_PLAY_MODE'
      // 'setPlayList': 'SET_PLAYLIST'
    }),
    ...mapActions(['deleteSong', 'clearList', 'saveShouCang', 'deleteShouCang'])
  },
  watch: {
    currentSong (newSong, oldSong) {
      // 当歌曲列表不显示时，不滚动。歌曲没切换时不滚动。否则滚动
      if (!this.playlistFlag || newSong.id === oldSong.id) {
        return false
      } else {
        this.scrollToCurrent(newSong)
      }
    }
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.9s
      .list-wrapper
        transition: all 0.9s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 140px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.5s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>
