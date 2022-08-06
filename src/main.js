import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
//自定义指令
//v-focus
Vue.directive('focus', {
  //调用自定义指令的钩子函数，将被绑定的元素插入的dom中
  inserted: function (el) {
    //聚焦元素
    el.focus()
  }
})
//v-throttle自定义指令:表单防止重复提交
Vue.directive('throttle', {
  bind: (el, binding) => {
    let throttleTime = binding.value; //节流时间
    if (!throttleTime) { //用户若不设置节流时间，则默认节流时间为2s
      throttleTime = 10000
    }
    let cbFun;
    el.addEventListener('click', event => {
      if (!cbFun) {//第一次执行
        cbFun = setTimeout(() => {
          cbFun = null;
        }, throttleTime)
      } else {
        event && event.stopImmediatePropagation()
      }
    }, true)
  }
})
new Vue({
  render: h => h(App),
}).$mount('#app')
