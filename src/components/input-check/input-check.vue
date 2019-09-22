<template>
  <div>
    测试中...
  </div>
</template>
<script type="text/ecmascript-6">
import Vue from 'vue'
export default {
  data: function () {
    return {
      provinceList: null
    }
  },
  created: function () {
    // Vue.http.interceptors.push(function (request, next) {
    //   console.log('拦截器')
    // })
    // console.log(Vue.http.interceptors)
    // var resource = this.$resource('../static/json/shuju.json', {id: 'jj'}, {zhangsan: {method: 'Post'}})
    // console.log(resource)
    Vue.http.interceptors.push({
      request: function (request) {
        // request.method = 'POST'
        console.log('请求发送前进行拦截')
        return request
      },
      response: function (response) {
        // response.data = [{
        //   custom: 'custom'
        // }]
        console.log('响应返回前进行拦截')
        return response
      }
    })
    Vue.http.interceptors[Vue.http.interceptors.length - 1].request()
    this.$http({
      url: '../static/json/shuju.json',
      method: 'Get'
    }).then(res => {
      Vue.http.interceptors[Vue.http.interceptors.length - 1].response()
      this.provinceList = res.data
      // console.log(this.provinceList.rows)
    })
    // this.$http.get('../static/json/shuju.json').then(res => {
    //   this.provinceList = res.data
    //   console.log(this.provinceList.rows)
    // }).catch(error => {
    //   console.log(error)
    // })
    // this.$axios('../static/json/shuju.json').then(res => {
    //   this.provinceList = res.data
    //   console.log(this.provinceList.rows)
    // }).catch(error => {
    //   console.log(error)
    // })
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
</style>
