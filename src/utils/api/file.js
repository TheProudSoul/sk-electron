import http from './http'
import store from '@/store'

export function fetchContent(path) {
    return http({
        url: `/api/file-system/${store.state.account.userId}/file`,
        method: 'get',
        params: { path: path }
    })
}
export function retrieve(path) {
    shell.openExternal(`${require('@/config.json').server}/file/${store.state.account.userId}/retrieve?path=${path}`)
}