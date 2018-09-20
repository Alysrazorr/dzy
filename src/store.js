import Vue from 'vue'
import Vuex from 'vuex'
import constants from './constants'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    company: '典政院绩效咨询（深圳）有限公司',
    constants
  },
  mutations: {
    setToken: (state, token) => {
      window.sessionStorage.setItem('token', token)
      state.token = token
    },
    clearToken: (state) => {
      window.sessionStorage.removeItem('token')
      state.token = null
    }
  }
})
