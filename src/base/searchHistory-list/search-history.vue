<template>
  <div class="search-list">lll
    <transition-group tag="ul" name="list">
      <li @click="sousuo(item)" class="search-item" v-for="item in searches" :key="item">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="removeone(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>
<script>
export default {
  props: {
    searches: {
      type: Array,
      default: null
    }
  },
  methods: {
    removeone (item) { // 点击数据后面的叉号删除数据
      this.$emit('removeone', item)
    },
    sousuo (item) { // 点击历史数据，进行搜索
      this.$emit('geiinput', item) // 触发search.vue中的geiinput事件
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-list
    .search-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      &.list-enter-active, &.list-leave-active
        transition: all 0.5s
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
        color: $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>
