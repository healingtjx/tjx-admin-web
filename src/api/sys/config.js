import request from '@/utils/request'

export function saveConfig(data) {
  return request({
    url: '/sys/config/save',
    method: 'post',
    data
  })
}

export function configInfo() {
  return request({
    url: '/sys/config/config',
    method: 'get'
  })
}

