import request from './http'
let url = "/account";

export function login(data) {
    return request({
        url: `${url}/login`,
        method: 'post',
        data
    })
}

export function registration(data) {
    return request({
        url: `${url}/registration`,
        method: 'post',
        data
    })
}

export function sendResetLink(email) {
    return request({
        url: `${url}/resendRegistrationToken`,
        method: 'get',
        params: email
    })
}

export function getUserInformation(userId) {
    return request({
        url: `/user/${userId}`,
        method: 'get',
    })
}