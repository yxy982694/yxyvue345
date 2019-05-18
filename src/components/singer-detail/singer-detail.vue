<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>
<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import MusicList from 'components/music-list/music-list'
import { getSingerDetail } from 'api/singer.js'
import {ERR_OK} from 'api/config'
import { createSong } from 'common/js/song.js'
export default {
  data () {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters(['chuli']),
    title () {
      return this.chuli.name
    },
    bgImage () {
      return this.chuli.avatar
    }
  },
  created () {
    this._getDetail()
    // console.log(this.chuli)
  },
  methods: {
    _getDetail () { // 在没有id的情况下，返回singer页面
      if (!this.chuli.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.chuli.id).then((res) => {
        if (res.code === ERR_OK) {
          // console.log(res.data.list)
          this.songs = this._normalizeSongs(res.data.list)
          // console.log(this.songs)
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((item) => {
        let {musicData} = item
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .singer-detail
    position: fixed
    z-index: 100000
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background
    color: yellow
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
