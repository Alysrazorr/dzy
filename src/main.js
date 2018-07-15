import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import axios from './axios'
import utils from './utils'
import echarts from 'echarts'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

Vue.prototype.$axios = axios
Vue.prototype.$utils = utils
Vue.prototype.$echarts = echarts

Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
