import request from '@/utils/request'
import md5 from 'js-md5'

export function adminList(query) {
  return request({
    url: '/ums/admin/list',
    method: 'get',
    params: query
  })
}

export function updateAdminStatus(data) {
  return request({
    url: '/ums/admin/updateStatus',
    method: 'post',
    data
  })
}

export function changeAdmin(data) {
  // 处理密码需要md5加密
  if (data.password) {
    data.password = md5(data.password)
  }
  return request({
    url: '/ums/admin/change',
    method: 'post',
    data
  })
}

export function deleteAdmin(id) {
  return request({
    url: '/ums/admin/delete',
    method: 'post',
    params: {
      id: id
    }
  })
}
