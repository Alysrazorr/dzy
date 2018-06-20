import axios from 'axios'
import store from './store'
// import router from './router'

axios.defaults.baseURL = '/apis'
axios.interceptors.request.use(
  config => {
    if (store.state.auth.token) { config.headers.Token = `${store.state.auth.token}` }
    return config
  },
  err => { return Promise.reject(err) }
)

axios.interceptors.response.use(
  response => { return response },
  err => {
    switch (err.response.status) {
      case 401:
        return Promise.reject(err)
    }
  }
)

export default axios
