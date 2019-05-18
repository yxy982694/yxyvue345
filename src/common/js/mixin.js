import { mapGetters, mapMutations, mapActions } from 'vuex'
import { shuffle } from 'common/js/shuffle.js' // 引入打乱的数组
import { playMode } from 'common/js/config.js'
export const playListMixin = {
  computed: {
    ...mapGetters(['playList'])
  },
  mounted () { // 挂载点
    this.handlePlayList(this.playList)
  },
  activated () { // keep-alive执行的时候，会触发这个方法 在切换router-view
    this.handlePlayList(this.playList)
  },
  watch: {
    playList (newVal) {
      this.handlePlayList(this.playList)
    }
  },
  methods: {
    handlePlayList () {
      throw new Error('必须执行handlePlayList这个方法')
    }
  }
}

export const playerMixin = {
  computed: {
    ...mapGetters(['sequenceList', 'currentSong', 'mode', 'playList']),
    iconMode () { // 根据播放模式 来显示对应模式的样式
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    }
  },
  methods: {
    toggleMoshi () { // 切换模式  顺序  单曲循环  随机
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = []
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList) // 打乱数组顺序
      } else {
        list = this.sequenceList
      }
      // 找到正在播放的歌曲在打乱后的数组中的索引
      this.resetCurrentIndex(list)
      this.setPlayList(list) // 把打乱的数组给playList数组
    },
    resetCurrentIndex (list) { // 返回指定元素在数组中的索引
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    ...mapMutations({
      'setCurrentIndex': 'SET_CURRENT_INDEX',
      'setPlayMode': 'SET_PLAY_MODE',
      'setPlayList': 'SET_PLAYLIST',
      'setPlaying': 'SET_PLAYING_STATE'
    })
  }
}

export const searchMixin = {
  data () {
    return {
      inputData: '',
      timeff: 101
    }
  },
  computed: {
    ...mapGetters(['searchHistory'])
  },
  methods: {
    inputDataChange (newData) { // 在input中的值发生变化时，回调
      this.inputData = newData
    },
    clicklist () { // 点击搜索结果列表中的某一项时执行的函数
      this.saveSearchHistory(this.inputData)
    },
    // 点击搜索历史中的数据时
    selectHotKey (k) {
      this.$refs.searchBox.setInputData(k)
    },
    yaolundongle () { // 即将开始滚动搜索列表时执行
      this.$refs.searchBox.blur()
    },
    ...mapActions(['saveSearchHistory', 'removeSearchHistory'])
  }
}
