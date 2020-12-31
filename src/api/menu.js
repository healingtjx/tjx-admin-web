import request from '@/utils/request'

export function menuList(query) {
  return request({
    url: '/ums/menu/list',
    method: 'get',
    params: query
  })
}

export function updateMenuHidden(data) {
  return request({
    url: '/ums/menu/updateHidden',
    method: 'post',
    data
  })
}

export function deleteMenu(id) {
  return request({
    url: '/ums/menu/delete',
    method: 'post',
    params: {
      id: id
    }
  })
}

export function changeMenu(data) {
  return request({
    url: '/ums/menu/change',
    method: 'post',
    data
  })
}

