import http from './http'
import { shell } from "electron";
import store from '@/store'

let url = '/version'

export function fetchList() {
    return http.get(`${url}/${store.state.account.userId}`)
}

export function downloadVersion(id) {
    shell.openExternal(`${require('@/config.json').server}${url}/${store.state.account.userId}/retrieve/${id}`);
}

export function deleteVersion(id) {
    return http({
        url: `${url}/${store.state.account.userId}/${id}`,
        method: 'delete',
    })
}

export function createOne(name) {
    return http({
        url: `${url}/${store.state.account.userId}`,
        method: 'post',
        data: { name: name }
    })
}