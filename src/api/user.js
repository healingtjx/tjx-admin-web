import request from '@/utils/request'
import md5 from 'js-md5'

export function login(data) {
  // 密码需要md5加密
  data.password = md5(data.password)
  return request({
    url: '/admin/authentication/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/authentication/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/admin/authentication/logout',
    method: 'post'
  })
}
