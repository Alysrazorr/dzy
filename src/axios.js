import axios from 'axios'
import store from './store'
import router from './router'

axios.defaults.baseURL = '/apis'
axios.interceptors.request.use(
  config => {
    if (store.state.token) { config.headers.Authorization = `${store.state.token}` }
    return config
  },
  err => { return Promise.reject(err) }
)

axios.interceptors.response.use(
  response => { return response },
  err => {
    if (err.response) {
      switch (err.response.status) {
        case 490:
          store.commit('clearToken')
          router.replace({
            path: '/login',
            query: {redirect: router.currentRoute.fullPath}
          })
      }
    }
    return Promise.reject(err.response.data)
  }
)

export default axios
