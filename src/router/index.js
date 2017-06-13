/**
 * 路由设置
 * @author lmh
 * @description meta.as用来指定访问该路由所需的权限，多个权限用'|'隔开
 */

import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import * as views from '@/views'
import { GLOBAL } from '@/store/mutationTypes'

// 路由模块插入
import business from './business'
import arrange from './arrange'
import analysis from './analysis'
import system from './system'
import student from './student'


Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/auth/login',
      name: 'Login',
      component: views.Login,
      meta: {
        breadcrumb: [
          { name: '登录' },
        ],
      },
    },
    {
      path: '/',
      name: 'Main',
      component: views.Main,
      children: [
        {
          path: '/index',
          name: 'Index',
          component: views.Home,
          meta: {
            breadcrumb: [
              { name: '我的首页' },
            ],
          },
        },
        {
          path: '/arrange',
          name: 'Arrange',
          component: views.Arrange,
          meta: {
            breadcrumb: [
              { name: '排课管理' },
            ],
          },
        },
        {
          path: '/prepare',
          name: 'Prepare',
          component: views.Prepare,
          meta: {
            breadcrumb: [
              { name: '备课管理' },
            ],
          },
        },
        {
          path: '/feedback',
          name: 'Feedback',
          component: views.Feedback,
          meta: {
            breadcrumb: [
              { name: '意见反馈' },
            ],
          },
        },
        {
          path: '/error',
          name: 'AccessError',
          component: views.AccessError,
        },
        ...business,
        ...arrange,
        ...analysis,
        ...system,
        ...student,
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  // 显示数据加载动画
  store.commit(GLOBAL.LOADING.SHOW)

  // 更换页面title
  document.title = to.meta.breadcrumb
    .reduce((title, item) => (
      title ? `${item.name} - ${title}` : item.name
    ), '')

  next()
})

export default router