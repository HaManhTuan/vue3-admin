import request from '@/utils/request'

export function getListCate(query) {
  return request({
    url: '/category/list',
    method: 'get',
    params: query
  })
}

export function createCate(data) {
  return request({
    url: '/category/create',
    method: 'post',
    data
  })
}

export function editCate(id, data) {
  return request({
    url: '/category/edit/' + id,
    method: 'put',
    data
  })
}

export function deleteCate(id) {
  return request({
    url: '/category/delete/' + id,
    method: 'post',
  })
}


