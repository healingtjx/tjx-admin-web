import request from '@/utils/request'

export function adminList(token) {
  return request({
    url: '/ums/admin/list',
    method: 'get'
  })
}
