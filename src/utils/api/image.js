import http from './http'
import store from '@/store'

const url = "/image";

export function upload(form) {
    return http.post(`${url}/${store.state.account.userId}`, form)
}

export function deleteOne(id) {
    return http({
        url: `${url}/${store.state.account.userId}/${id}`,
        method: 'delete'
    })
}

export function fetchList(pageNum, pageSize) {
    return http({
        url: `${url}/${store.state.account.userId}`,
        method: 'get',
        params: { pageNum: pageNum, pageSize: pageSize }
    })
}

export function getCount() {
    return http({
        url: `${url}/${store.state.account.userId}/total`,
        method: 'get'
    })
}