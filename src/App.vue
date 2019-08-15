<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <transition name="fade">
        <router-view/>
        <!-- <router-view name="a" /> -->
      </transition>
    </keep-alive>
    <player></player>
    <!-- <router-view name="a" /> -->
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'
export default {
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .fade-enter-active, .fade-leave-active
    transition: opacity .5s
  .fade-enter, .fade-leave-to
    opacity: 0
</style>
