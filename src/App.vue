<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view/>
      <!-- <transition name="fade"> -->
        <!-- <router-view/> -->
        <!-- <router-view name="a" /> -->
      <!-- </transition> -->
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
window.onhashchange = function (event) {
  let hash = location.hash.slice(2)
  document.body.style.backgroundColor = hash
}
window.history.pushState(null, null, '/book')
window.addEventListener('popstate', function () {
  console.log('history  popstate执行了')
})
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .fade-enter-active, .fade-leave-active
    transition: opacity .5s
  .fade-enter, .fade-leave-to
    opacity: 0
</style>
