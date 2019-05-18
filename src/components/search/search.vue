<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @inputDataChange="inputDataChange" :placeholder="placeholder"></search-box>
    </div>
    <div ref="search" class="shortcut-wrapper" v-show="!inputData">
      <scroll :time="timeff" ref="scroll" class="shortcut" :data="shortData">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="selectHotKey(item.k)" class="item" v-for="(item) in hotKeys" :key="item.n">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="qingkonglishi">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-history @removeone="removeSearchHistory" @geiinput="selectHotKey" :searches="searchHistory"></search-history>
          </div>
        </div>
      </scroll>
    </div>
    <div ref="searchResult" class="search-result" v-show="inputData">
      <suggest @clicklist="clicklist" @yaolundongle="yaolundongle" :inputData="inputData" :showSinger="showSinger" ref="suggest"></suggest>
    </div>
    <confirm text="是否清空所有搜索历史" confirmBtnText="清空" ref="confirm" @quEvent="clearSearchHistory"></confirm>
    <router-view/>
  </div>
</template>
<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box'
import { getHotKey } from 'api/search'
import {ERR_OK} from 'api/config'
import Scroll from 'base/scroll/scroll'
import Suggest from 'components/suggest/suggest'
import { mapActions } from 'vuex'
import SearchHistory from 'base/searchHistory-list/search-history'
import Confirm from 'base/confirm/confirm'
import { playListMixin, searchMixin } from 'common/js/mixin.js'
export default {
  mixins: [playListMixin, searchMixin],
  data () {
    return {
      placeholder: '搜索歌曲、歌手',
      hotKeys: [],
      // inputData: '',
      showSinger: true
      // timeff: 101
    }
  },
  components: {
    SearchBox,
    Suggest,
    SearchHistory,
    Confirm,
    Scroll
  },
  created () {
    this._getHotKey()
  },
  watch: {
    inputData (newData) {
      if (!newData) { // 在数据改变时，刷新一下滚动组件
        setTimeout(() => {
          this.$refs.scroll.refresh()
        }, 20)
      }
    }
  },
  computed: {
    shortData () { // 将热门搜索和历史数据合并 scroll的高度
      return this.hotKeys.concat(this.searchHistory)
    }
    // ...mapGetters(['searchHistory'])
  },
  methods: {
    handlePlayList (playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.search.style.bottom = bottom
      this.$refs.searchResult.style.bottom = bottom

      this.$refs.scroll.refresh()
      this.$refs.suggest.refresh()
    },
    // inputDataChange (newData) { // 在input中的值发生变化时，回调
    //   // console.log('newData:' + newData)
    //   this.inputData = newData
    // },
    _getHotKey () { // 获取热门搜索关键词数据
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          // console.log(res.data.hotkey)
          this.hotKeys = res.data.hotkey.slice(0, 10)
        }
      })
    },
    // 点击热门关键词执行的回调
    // 点击搜索历史中的数据时
    // selectHotKey (k) {
    //   this.$refs.searchBox.setInputData(k)
    // },
    // yaolundongle () { // 即将开始滚动搜索列表时执行
    //   this.$refs.searchBox.blur()
    // },
    // clicklist () { // 点击搜索结果列表中的某一项时执行的函数
    //   this.saveSearchHistory('inputData')
    // },
    qingkonglishi () { // 点击clear按钮，清空搜索历史中的数据
      this.$refs.confirm.show()
    },
    // removeone (item) { // 删除一条数据
    //   this.removeSearchHistory(item)
    // },
    ...mapActions(['clearSearchHistory'])
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
