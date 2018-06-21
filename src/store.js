import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null
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
