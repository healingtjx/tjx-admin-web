import request from '@/utils/request'

export function logList(query) {
  return request({
    url: '/sys/log/list',
    method: 'get',
    params: query
  })
}
