<template>
  <transition name="silde">
    <music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
  </transition>
</template>
<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import { getSingerDetail } from 'api/singer.js'
import { createSong } from 'common/js/song.js'
import { ERR_OK } from 'api/config'
import { mapGetters } from 'vuex'
// import { getSongList } from 'api/recommend'
export default {
  data () {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters(['disc', 'singerId']),
    title () {
      return '中国排行榜'
    },
    bgImage () {
      return this.disc.picUrl
    }
  },
  created () {
    // this._getSongList()
    this._getDetail()
  },
  methods: {
    // _getSongList () {
    //   getSongList('3261874488').then((res) => {
    //     // this.songs = res
    //     console.log(res)
    //     if (res.code === ERR_OK) {
    //       console.log(res.cdlist[0].songlist)
    //     }
    //   })
    // },
    _getDetail () {
      if (!this.singerId) {
        this.$router.push('/recommend')
        return
      }
      getSingerDetail('002J4UUk29y8BY').then((res) => {
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
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
