import request from '@/utils/request'

export function saveConfig(data) {
  return request({
    url: '/sys/config/saveOSS',
    method: 'post',
    data
  })
}

export function configInfo() {
  return request({
    url: '/sys/config/configOSS',
    method: 'get'
  })
}

