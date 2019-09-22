<template>
  <div class="singer" ref="singer">
    <list-view :data="singers" @select="selectSinger" ref="list"></list-view>
    <router-view/>
  </div>
</template>
<script type="text/ecmascript-6">
import { getSingerList } from 'api/singer'
import Singer from 'common/js/singer'
import {ERR_OK} from 'api/config'
import listView from 'base/listview/listview'
import { mapMutations } from 'vuex'
import { playListMixin } from 'common/js/mixin.js'
const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10
export default {
  mixins: [playListMixin],
  data () {
    return {
      singers: []
    }
  },
  components: {
    listView
  },
  activated: function () {
    console.log('歌手activated')
  },
  deactivated: function () {
    console.log('歌手deactivated')
  },
  created () {
    this._getSingerList()
    console.log('歌手created')
  },
  // 路由跳转3
  beforeRouteEnter (to, from, next) {
    console.log('歌手beforeRouteEnter')
    next(vm => {
      // console.log(vm.title)
    })
  },
  // 同一个路由组件 不同的参数
  beforeRouteUpdate (to, from, next) {
    console.log('歌手beforeRouteUpdate')
    next()
  },
  beforeRouteLeave (to, from, next) {
    console.log('歌手beforeRouteLeave')
    // if (global.confirm('are you sure?')) {
    next()
    // }
  },
  beforeCreate: function () {
    console.log('歌手beforeCreate')
  },
  beforeMount: function () {
    console.log('歌手beforeMount')
  },
  mounted () {
    console.log('歌手mounted')
    console.log(this.$router)
  },
  beforeDestory: function () {
    console.log('歌手beforeDestory')
  },
  destroyed: function () {
    console.log('歌手destroyed')
  },
  methods: {
    handlePlayList (playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    },
    selectSinger (singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      console.log(this.$router)
      // return false
      this.setSinger(singer)
    },
    _getSingerList () {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list)
          // console.log(this._normalizeSinger(res.data.list))
        }
      })
    },
    _normalizeSinger (list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      // 为了达到有序列表，需要处理map
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => { // 对数组进行升序排列
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
