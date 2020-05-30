import http from './http'
import store from '@/store'

const url = '/notification'
export function list() {
    return http({
        url: `${url}/${store.state.account.userId}/list`,
        method: 'get',
        params: { journalId: store.state.fileJournal.journalId}
    })
}
export function commitDelete(path, dir) {
    return http({
        url: `${url}/commit-delete`,
        method: 'post',
        data: {
            userId: store.state.account.userId,
            path: path,
            dir: dir
        }
    })
}
export function commitAdd(path, dir) {
    return http({
        url: `${url}/commit-add`,
        method: 'post',
        data: {
            userId: store.state.account.userId,
            path: path,
            dir: dir
        }
    })
}
export function commitEdit(path, data) {
    return http({
        url: `${url}/commit-edit`,
        method: 'post',
        data: {
            userId: store.state.account.userId,
            path: path,
            data: data
        }
    })
}
export function commitMove(oldPath, newPath) {
    return http({
        url: `${url}/commit-move`,
        method: 'post',
        data: {
            userId: store.state.account.userId,
            path: oldPath,
            data: newPath
        }
    })
}