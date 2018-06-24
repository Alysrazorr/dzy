import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import Login from '@/views/Login'
import QuestionnaireList from '@/views/QuestionnaireList'
import Questionnaire from '@/views/Questionnaire'

Vue.use(Router)

if (window.sessionStorage.getItem('token')) {
  store.commit('setToken', window.sessionStorage.getItem('token'))
}

const router = new Router({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: QuestionnaireList
    },
    {
      path: '/questionnaire/:id',
      component: Questionnaire
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/login') {
    if (to.path.startsWith('/questionnaire/')) {
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
