import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, menus) {
    return new Promise(resolve => {
      // 遍历需要权限的菜单
      const accessedRoutes = asyncRoutes.filter(v => {
        if (hasPermission(menus, v)) {
          if (v.children && v.children.length > 0) {
            v.children = v.children.filter(child => {
              console.log(hasPermission(menus, child))
              if (hasPermission(menus, child)) {
                return child
              }
              return false
            })
            return v
          } else {
            return v
          }
        }
        return false
      })
      // 对菜单进行排序
      sortRouters(accessedRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

/**
 * 根据路由名称获取菜单
 * @param name
 * @param menus
 * @returns {*}
 */
function getMenu(name, menus) {
  for (let i = 0; i < menus.length; i++) {
    const menu = menus[i]
    if (name === menu.name) {
      return menu
    }
  }
  return null
}

/**
 * 判断菜单是否有权限
 * @param menus  用户有权限的菜单(userInfo返回)
 * @param route  当前需要对比的菜单
 * @returns {boolean}
 */
function hasPermission(menus, route) {
  if (route.name) {
    const currMenu = getMenu(route.name, menus)
    if (currMenu != null) {
      // 设置菜单的标题、图标和可见性
      if (currMenu.title != null && currMenu.title !== '') {
        route.meta.title = currMenu.title
      }
      if (currMenu.icon != null && currMenu.title !== '') {
        route.meta.icon = currMenu.icon
      }
      if (currMenu.hidden != null) {
        route.hidden = currMenu.hidden !== 0
      }
      if (currMenu.sort != null && currMenu.sort !== '') {
        route.sort = currMenu.sort
      }
      return true
    } else {
      route.sort = 0
      if (route.hidden !== undefined && route.hidden === true) {
        return true
      } else {
        return false
      }
    }
  } else {
    return true
  }
}

/**
 * 降序
 * @param p
 * @returns {function(*, *): number}
 */
function compare(p) {
  return function(m, n) {
    const a = m[p]
    const b = n[p]
    return b - a
  }
}

/**
 * 对菜单进行排序
 * @param accessedRouters
 */
function sortRouters(accessedRouters) {
  for (let i = 0; i < accessedRouters.length; i++) {
    const router = accessedRouters[i]
    if (router.children && router.children.length > 0) {
      router.children.sort(compare('sort'))
    }
  }
  accessedRouters.sort(compare('sort'))
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
