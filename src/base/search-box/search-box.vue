<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="inputK" v-model="inputData" class="box" :placeholder="placeholder" />
    <i v-show="inputData" class="icon-dismiss" @click="clearInputData"></i>
  </div>
</template>

<script type="text/ecmascript-6">
import { debounce } from 'common/js/shuffle'
export default {
  data () {
    return {
      inputData: ''
    }
  },
  props: {
    placeholder: { // 由于许多组件要引用input，而每个组件的占位是不一样的
      type: String,
      default: '搜索歌手、歌曲'
    }
  },
  created () {
    this.$watch('inputData', debounce((newData) => {
      this.$emit('inputDataChange', newData)
    }, 200))
  },
  methods: {
    clearInputData () { // 点击后面的×号时，清空input中的数据
      this.inputData = ''
    },
    setInputData (k) { // 给父组件利用的方法，为了把父组件中的值传给子组件
      this.inputData = k
    },
    blur () { // 让input框失去焦点
      this.$refs.inputK.blur()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>
