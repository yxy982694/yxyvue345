import * as types from './mutations-type.js'
export const mutations = { // [types.SET_SINGER]是方法名
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING_STATE] (state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN] (state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST] (state, list) {
    state.playList = list
  },
  [types.SET_SEQUENCE_LIST] (state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE] (state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX] (state, index) {
    state.currentIndex = index
  },
  [types.SET_DISC] (state, disc) {
    state.disc = disc
  },
  [types.SET_SINGERID] (state, singerId) {
    state.singerId = singerId
  },
  [types.SET_TOPLIST] (state, topList) {
    state.topList = topList
  },
  [types.SET_SEARCHHISTORY] (state, searchHistory) {
    state.searchHistory = searchHistory
  },
  [types.SET_PLAYHISTORY] (state, playHistory) {
    state.playHistory = playHistory
  },
  [types.SET_SHOUCANGLIST] (state, shoucangList) {
    state.shoucangList = shoucangList
  }
}
