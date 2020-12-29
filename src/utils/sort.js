/**
 * 根据key sort
 *
 * @param {*} that
 * @param {*} order
 * @param {*} key
 */
export function sortByKey(that, order, key, refresh) {
  if (order === 'ascending') {
    that.listQuery.sortKey = key
    that.listQuery.sortDescen = false
  } else {
    that.listQuery.sortKey = key
    that.listQuery.sortDescen = true
  }
  refresh()
}

/**
 * 根据key 获取排序样式
 * @param {*} key
 */
export function getSortClass(key) {
  const sortKey = this.listQuery.sortKey
  const sortDescen = this.listQuery.sortDescen
  if (sortKey === key) {
    return sortDescen ? 'descending' : 'ascending'
  } else {
    'none'
  }
}
