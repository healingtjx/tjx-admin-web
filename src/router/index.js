import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

/**
 * constantRoutes
 * 必要的路由
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/common/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/common/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/common/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * 可以根据权限动态添加的路由
 */
export const asyncRoutes = [
  {
    path: '/ums',
    component: Layout,
    redirect: '/test/index',
    name: 'ums',
    meta: { title: '权限管理', icon: 'ums' },
    children: [
      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/views/ums/admin/index'),
        meta: { title: '用户列表', icon: 'ums-admin' },
        hidden: true
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/ums/role/index'),
        meta: { title: '角色列表', icon: 'ums-role' },
        hidden: true
      },
      {
        path: 'alloc',
        name: 'alloc',
        component: () => import('@/views/ums/role/alloc'),
        meta: { title: '分配权限' },
        hidden: true
      },
      // {
      //   path: 'allocResource',
      //   name: 'allocResource',
      //   component: () => import('@/views/ums/role/allocResource'),
      //   meta: { title: '分配资源' },
      //   hidden: true
      // },
      {
        path: 'menu',
        name: 'menu',
        component: () => import('@/views/ums/menu/index'),
        meta: { title: '菜单列表', icon: 'ums-menu' },
        hidden: true
      },
      {
        path: 'resource',
        name: 'resource',
        component: () => import('@/views/ums/resource/index'),
        meta: { title: '菜单列表', icon: 'ums-resource' },
        hidden: true
      },
      {
        path: 'resourceCategory',
        name: 'resourceCategory',
        component: () => import('@/views/ums/resource/categoryList'),
        meta: { title: '资源分类' },
        hidden: true
      }
    ]
  },
  {
    path: '/config',
    component: Layout,
    redirect: '/config/upload',
    name: 'config',
    meta: { title: '系统设置', icon: 'config' },
    children: [
      {
        path: 'upload',
        name: 'upload',
        component: () => import('@/views/sys/config/upload'),
        meta: { title: '文件上传', icon: 'config-upload' },
        hidden: true
      }
    ]
  },
  // 404 必须放到路由最后
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
