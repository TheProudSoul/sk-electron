import store from '../store'
import api from './api'
import NotificationWatcher from './notificationWatcher'


function load() {
    const userId = localStorage.getItem('userId');
    const Authorization = localStorage.getItem('Authorization');
    store.dispatch("setJournalId", localStorage.getItem('journalId'));
    store.dispatch("setUserDefault", localStorage.getItem('userDefault'));


    if (Authorization != '' && userId != '') {
        api.userApi.getUserInformation(userId).then(res => {
            if (res.errCode == '00') {
                store.commit("COMMIT_LOGIN", { token: Authorization, id: userId, getInfo: false });
                store.dispatch("SET_USER_INFO", res.data);
            } else {
                localStorage.setItem('Authorization', '')
                localStorage.setItem('userId', '')
            }
        })
    }

    new NotificationWatcher()
}


export default load