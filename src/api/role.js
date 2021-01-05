import request from '@/utils/request'

export function roleList(query) {
  return request({
    url: '/ums/role/list',
    method: 'get',
    params: query
  })
}

export function updateRoleStatus(data) {
  return request({
    url: '/ums/role/updateStatus',
    method: 'post',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: '/ums/role/delete',
    method: 'post',
    params: {
      id: id
    }
  })
}

export function changeRole(data) {
  return request({
    url: '/ums/role/change',
    method: 'post',
    data
  })
}

export function allocMenu(data) {
  return request({
    url: '/ums/role/allocMenu',
    method: 'post',
    data
  })
}
