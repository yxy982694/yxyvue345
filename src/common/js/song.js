// import { getSongVkey } from 'api/singer.js'
import { Base64 } from 'js-base64'
export default class Song {
  constructor ({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
  getLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      let res = 'W3RpOua8lOWRmF0KW2FyOuiWm+S5i+iwpl0KW2FsOue7heWjq10KW2J5Ol0KW29mZnNldDowXQpbMDA6MDAuNTZd5ryU5ZGYIC0g6Jab5LmL6LCmClswMDowMi40Ml3or43vvJrolpvkuYvosKYKWzAwOjAzLjk5Xeabsu+8muiWm+S5i+iwpgpbMDA6MDUuMzhd57yW5puy77ya6YOR5LyfL+W8oOWuneWuhwpbMDA6MDcuNDVd5Yi25L2c5Lq677ya6LW16Iux5L+KClswMDowOS4wOV3lkIjlo7DvvJrotbXoi7Hkv4oKWzAwOjEwLjQ4XeW9lemfs+W4iO+8mueOi+aZk+a1twpbMDA6MTEuNzRdClswMDoxMi4zNF3mt7fpn7PluIjvvJrpso3plJAKWzAwOjEzLjg4XeavjeW4puWkhOeQhuW3peeoi+W4iO+8mumyjemUkApbMDA6MTYuMTBdClswMDoyMS4yNV3nroDljZXngrkKWzAwOjIyLjIxXQpbMDA6MjUuMTZd6K+06K+d55qE5pa55byP566A5Y2V54K5ClswMDoyOC4yN10KWzAwOjMwLjIyXemAkui/m+eahOaDhee7quivt+ecgeeVpQpbMDA6MzMuNTdd5L2g5Y+I5LiN5piv5Liq5ryU5ZGYClswMDozNi4yN13liKvorr7orqHpgqPkupvmg4XoioIKWzAwOjM5LjA4XQpbMDA6NDIuMjBd5rKh5oSP6KeBClswMDo0My43NF0KWzAwOjQ2LjE3XeaIkeWPquaDs+eci+eci+S9oOaAjuS5iOWchgpbMDA6NDkuNDddClswMDo1MS43NF3kvaDpmr7ov4fnmoTlpKrooajpnaIKWzAwOjU0LjYwXeWDj+ayoeWkqei1i+eahOa8lOWRmApbMDA6NTcuMjFd6KeC5LyX5LiA55y86IO955yL6KeBClswMDo1OS42OF0KWzAxOjAyLjQ2XeivpemFjeWQiOS9oOa8lOWHuueahOaIkea8lOinhuiAjOS4jeingQpbMDE6MDcuMDJdClswMTowNy41Nl3lnKjpgLzkuIDkuKrmnIDniLHkvaDnmoTkurrljbPlhbTooajmvJQKWzAxOjEyLjE5XQpbMDE6MTIuODZd5LuA5LmI5pe25YCZ5oiR5Lus5byA5aeL5pS26LW35LqG5bqV57'
      this.lyric = Base64.decode(res)
      resolve(this.lyric)
    })
  }
}
export function createSong (musicData) {
// let vkey = ''
// getSongVkey(musicData.songmid).then((res) => {
  // console.log(333)
  // vkey = res.data.list.vkey;
// })
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: randomSong()
    // url: `http://amobile.music.tc.qq.com/C400${musicData.songmid}.m4a?vkey=${vkey}&guid=7495539901&uin=0&fromtag=66`
  })
}

const songs = ['http://dl.stream.qqmusic.qq.com/C4000032UZe62rZk9K.m4a?guid=6684769596&vkey=C6D2091BFA30E91A25FFB58A836766083D87C6F28B769BB3AB345CB174F87FE6A801CCE2B70B03A46F73B3EEAA03CFE4A7D31CB1811F6D05&uin=5702&fromtag=66', 'http://dl.stream.qqmusic.qq.com/C400003MsMD70D1xC9.m4a?guid=6684769596&vkey=002F849A900FEF14B40F4AA7533359CB494E8053F52EDE259125F502143FC5F3DCAB61FB40EA2F427FE5391D9E4E4FAF9710A1E5EB32EE4D&uin=5702&fromtag=66']
function randomSong () {
  let num = parseInt(Math.random() * 4)
  return songs[num]
}

export function filterSinger (singer) { // 将多个歌手连到一起
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
