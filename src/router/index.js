import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
    path: '/',
    component: () => import('@/views/dashboard/index'),
    children: [
      // Library
      {
        name: 'dashboard-library',
        path: '/',
        component: () => import('@/views/dashboard/Library'),
      }, {
        name: 'Version Control',
        path: '/version-control',
        component: () => import('@/views/dashboard/VersionControl'),
      }, {
        name: 'Upload',
        path: '/picbed/upload',
        component: () => import('@/views/dashboard/Upload'),
      }, {
        name: 'Gallery',
        path: '/picbed/gallery',
        component: () => import('@/views/dashboard/Gallery'),
      }, {
        name: 'Settings',
        path: '/settings',
        component: () => import('@/views/dashboard/Settings'),
      },
    ]
  },
  {
    path: '/library',
    name: 'library',
    component: () => import(/* webpackChunkName: "about" */ '../views/library/index')
  }]
})

export default router
