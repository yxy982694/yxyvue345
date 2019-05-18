import * as types from './mutations-type'
import { playMode } from 'common/js/config.js'
import { shuffle } from 'common/js/shuffle.js' // 引入打乱的数组
import { saveSearch, remove, clear, savePlayCache, saveShouCangCache, deleteShouCangCache } from 'common/js/cache.js'
function findIndex (list, song) { // 查找song元素在list中的索引
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
// 正常进入歌曲列表时，要同时改变的字段
export const selectPlay = function ({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let Randomlist = []
    Randomlist = shuffle(list)
    commit(types.SET_PLAYLIST, Randomlist)
    index = findIndex(Randomlist, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
// 点击随机播放时，要同时改变的字段
export const randomPlay = function ({ commit }, { list }) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let Randomlist = []
  Randomlist = shuffle(list)
  commit(types.SET_PLAYLIST, Randomlist)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
// 点击搜索页中的某个歌曲时，要同时改变的字段
export const insertSong = function ({ commit, state }, song) {
  // 如果歌曲中没有这首歌曲  则直接插入
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let currentSong = playList[currentIndex]
  // 改变playList
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndexPlay = findIndex(playList, song)
  // 把歌曲插入到当前索引的下一个位置
  currentIndex++
  playList.splice(currentIndex, 0, song)
  if (fpIndexPlay > -1) {
    // 我们插入的歌曲之前有，而且在当前播放歌曲的前面
    if (currentIndex > fpIndexPlay) {
      playList.splice(fpIndexPlay, 1)
      currentIndex--
    } else {
      playList.splice(fpIndexPlay + 1, 1)
    }
  }
  // 改变sequenceList
  // 当前播放的歌曲在顺序列表中的位置
  let currentIndexSequence = findIndex(sequenceList, currentSong)
  let fpIndexSequence = findIndex(sequenceList, song)
  sequenceList.splice(currentIndexSequence, 0, song)
  if (fpIndexSequence > -1) {
    if (currentIndexSequence > fpIndexSequence) {
      sequenceList.splice(fpIndexSequence, 1)
    } else {
      sequenceList.splice(fpIndexSequence + 1, 1)
    }
  }
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
// 把数据插入到历史中 得到一个新数组 保存到localstorage和store中
export const saveSearchHistory = function ({ commit, state }, inputData) {
  commit(types.SET_SEARCHHISTORY, saveSearch(inputData))
}

// 把删除历史中的一条数据 得到一个新数组 保存到localstorage和store中
export const removeSearchHistory = function ({ commit }, lishiData) {
  commit(types.SET_SEARCHHISTORY, remove(lishiData))
}

// 清空数据 得到一个空数组 保存到localstorage和store中
export const clearSearchHistory = function ({ commit }) {
  commit(types.SET_SEARCHHISTORY, clear())
}

// 删除一首歌曲
export const deleteSong = function ({ commit, state }, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 查找点击的歌曲的索引，在playList中的位置
  let fpIndexPlay = findIndex(playList, song)
  // 查找点击的歌曲的索引，在sequenceList中的位置
  let fpIndexSequence = findIndex(sequenceList, song)
  playList.splice(fpIndexPlay, 1)
  sequenceList.splice(fpIndexSequence, 1)
  // 如果删除的是正在播放的歌曲，currentIndex不变
  // 但是已经切换到下一首歌曲了
  if (fpIndexPlay < currentIndex || currentIndex === playList.length - 1) {
    currentIndex--
  }
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  const playingState = playList.length > 0
  commit(types.SET_PLAYING_STATE, playingState)
}

// 清空数据 列表中的歌曲
export const clearList = function ({ commit }) {
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_PLAYING_STATE, false)
  commit(types.SET_CURRENT_INDEX, -1)
}
// 当一首歌曲准备好可以播放时，把这首歌曲放到最近播放列表中
// 把正在播放的歌曲插入到播放列表数组中 得到一个新数组 保存到localstorage和store中
export const savePlayHistory = function ({ commit, state }, song) {
  commit(types.SET_PLAYHISTORY, savePlayCache(song))
}

// 点击收藏按钮后，将本首歌曲 保存到localstorage和store中
export const saveShouCang = function ({ commit, state }, song) {
  // alert('收藏成功')
  commit(types.SET_SHOUCANGLIST, saveShouCangCache(song))
}

// 删除收藏列表中一首歌曲， 保存到localstorage和store中
export const deleteShouCang = function ({ commit, state }, song) {
  commit(types.SET_SHOUCANGLIST, deleteShouCangCache(song))
}
