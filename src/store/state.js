import { playMode } from 'common/js/config.js'
import { loadSearch, loadPlayHistory, loadShouCangCache } from 'common/js/cache.js'
export default {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  singerId: '',
  topList: {},
  searchHistory: loadSearch(), // 保存搜索历史
  playHistory: loadPlayHistory(), // 保存最近播放歌曲
  shoucangList: loadShouCangCache() // 点击收藏后收藏的歌曲
}
