import Vue from 'vue'
import Router from 'vue-router'
import mergeTable from '@/components/mergeTable'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'mergeTable',
      component: mergeTable
    }
  ]
})
