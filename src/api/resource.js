import request from '@/utils/request'

export function resourceList(query) {
  return request({
    url: '/ums/resource/list',
    method: 'get',
    params: query
  })
}

export function resourceTreeList(query) {
  return request({
    url: '/ums/resource/treeList',
    method: 'get',
    params: query
  })
}

export function deleteResource(id) {
  return request({
    url: '/ums/resource/delete',
    method: 'post',
    params: {
      id: id
    }
  })
}

export function changeResource(data) {
  return request({
    url: '/ums/resource/change',
    method: 'post',
    data
  })
}

// 资源分类操作

export function resourceCategoryList(query) {
  return request({
    url: '/ums/resourceCategory/list',
    method: 'get',
    params: query
  })
}

export function deleteResourceCategory(id) {
  return request({
    url: '/ums/resourceCategory/delete',
    method: 'post',
    params: {
      id: id
    }
  })
}

export function changeResourceCategory(data) {
  return request({
    url: '/ums/resourceCategory/change',
    method: 'post',
    data
  })
}
