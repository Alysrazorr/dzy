import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import Login from '@/views/Login'
import QuestionnaireList from '@/views/QuestionnaireList'
import Questionnaire from '@/views/Questionnaire'
import Success from '@/views/Success'

Vue.use(Router)

if (window.sessionStorage.getItem('token')) {
  store.commit('setToken', window.sessionStorage.getItem('token'))
}

const router = new Router({
  routes: [
    {
      path: '/login',
      component: Login,
      meta: {
        auth: false
      }
    },
    {
      path: '/',
      component: QuestionnaireList,
      meta: {
        auth: true
      }
    },
    {
      path: '/success',
      component: Success,
      meta: {
        auth: false
      }
    },
    {
      path: '/questionnaire/:id',
      component: Questionnaire,
      meta: {
        auth: false
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/login') {
    if (!to.meta.auth) {
      next()
    } else {
      if (store.state.token) {
        next()
      } else {
        next({
          path: '/login'
        })
      }
    }
  } else {
    if (store.state.token) {
      next({
        path: '/'
      })
    } else {
      next()
    }
  }
})

export default router
