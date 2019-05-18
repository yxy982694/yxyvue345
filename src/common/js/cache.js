import storage from 'good-storage'
const SEARCH_KEY = '__search__'
const PLAYHISTORY_KEY = '__playhistory__'
const SHOUCANG_KEY = '__shoucang__'
const SEARCH_MAX_LENGTH = 15
const PALYHISTORY_MAX_LENGTH = 200
// 插入一条数据 最多插入15条
function insertData (arr, value, compare, maxlength) {
  let index = arr.findIndex(compare)
  if (index === 1) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(value)
  if (maxlength && arr.length > maxlength) {
    arr.pop()
  }
}
// 把新数组存到localstorage中 并返回searches
// 在actions.js中使用这个方法
export function saveSearch (inputData) {
  let searches = storage.get(SEARCH_KEY, [])
  insertData(searches, inputData, (item) => {
    return item === inputData
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}
// 获取此次localstorage的值
export function loadSearch () {
  return storage.get(SEARCH_KEY, [])
}
// 清空localstorage的值
export function clear () {
  storage.remove(SEARCH_KEY)
  return []
}
// Array.prototype.remove = function (val) {
//   let index = this.indexOf(val)
//   if (index > -1) {
//     this.splice(index, 1)
//   }
// }
// 删除一条数据
function removeone (arr, compare) {
  const index = arr.findIndex(compare)
  if (index < 0) {
    return false
  } else {
    arr.splice(index, 1)
  }
}
// 移除localstorage的某个值
export function remove (lishiData) {
  let searches = storage.get(SEARCH_KEY, [])
  removeone(searches, (item) => {
    return item === lishiData
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}
// 把正在播放的歌曲放到缓存中
// 插入一条数据 最多插入200条
export function savePlayCache (song) {
  let playHistory = storage.get(PLAYHISTORY_KEY, [])
  if (!playHistory) {
    insertData(playHistory, song, (item) => {
      return item.id === song.id
    }, PALYHISTORY_MAX_LENGTH)
  } else {
    playHistory[0] = song
  }
  storage.set(PLAYHISTORY_KEY, playHistory)
  return playHistory
}

// 获取此次localstorage的值 在初始化的时候使用
export function loadPlayHistory () {
  return storage.get(PLAYHISTORY_KEY, [])
}

// 点击一首歌曲后，把歌曲插入到收藏列表中 最多插入200条
export function saveShouCangCache (song) {
  let shoucangList = storage.get(SHOUCANG_KEY, [])
  // if (!shoucangList) {
  insertData(shoucangList, song, (item) => {
    return item.id === song.id
  }, PALYHISTORY_MAX_LENGTH)
  // } else {
  // shoucangList[0] = song
  // }
  storage.set(SHOUCANG_KEY, shoucangList)
  return shoucangList
}

// 删除收藏列表中的一首歌曲
export function deleteShouCangCache (song) {
  let shoucangList = storage.get(SHOUCANG_KEY, [])
  removeone(shoucangList, (item) => {
    return item.id === song.id
  })
  storage.set(SHOUCANG_KEY, shoucangList)
  return shoucangList
}

// 获取此次localstorage的值 在初始化的时候使用
export function loadShouCangCache () {
  return storage.get(SHOUCANG_KEY, [])
}
