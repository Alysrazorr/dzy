import Vue from 'vue'
import Router from 'vue-router'
import QuestionnaireList from '@/views/QuestionnaireList'
import Questionnaire from '@/views/Questionnaire'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/questionnaire/list',
      component: QuestionnaireList
    },
    {
      path: '/questionnaire/:id',
      component: Questionnaire
    }
  ]
})
