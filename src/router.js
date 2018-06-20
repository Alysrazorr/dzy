import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import QuestionnaireList from '@/views/QuestionnaireList'
import Questionnaire from '@/views/Questionnaire'

Vue.use(Router)

export default new Router({
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
