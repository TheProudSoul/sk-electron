import store from '@/store'
import http from '@/utils/api'
import * as fileCRUD from './fileCRUD'
import db from '@/utils/db'
import path from 'path'

class NotificationWatcher {


    constructor() {
        this.loginState = store.state.account.isLogin;
        this.userDefault = store.state.fileJournal.userDefault
        if (this.loginState) {
            this.startList()
        }

        setInterval(() => {
            console.log("check user login state", this.loginState, store.state.account.isLogin)
            if (this.loginState != store.state.account.isLogin) {
                this.loginState = store.state.account.isLogin
                if (this.loginState) {
                    this.startList()
                } else this.stopList()
            }
        }, 20000) // 20 秒检查一次登录状态

    }

    startList() {
        console.log("开启local定时事件")
        this.intervalObj1 = setInterval(() => {
            this.listLocal()
        }, 3000) // 3 秒一次
        console.log("开启remote定时事件")
        this.intervalObj2 = setInterval(() => {
            this.listRemote()
        }, 10000) // 10 秒一次
    }

    listLocal() {
        db.fileJournalDao.get().then(item => {
            if (item) {
                console.log('local list item ', item)
                // {id: 4, pathname: "测试", type: 0, description: "ceshi"}
                switch (item.type) {
                    case 0: {
                        http.notificationApi.commitAdd(item.pathname, false).then(res => {
                            store.dispatch('setJournalId', res.data)
                            db.fileJournalDao.deleteById(item.id)
                        })
                        break;
                    }
                    case 1: {
                        http.notificationApi.commitDelete(item.pathname, false).then(res => {
                            store.dispatch('setJournalId', res.data)
                            db.fileJournalDao.deleteById(item.id)
                        })
                        break;
                    }
                    case 2: {
                        http.notificationApi.commitAdd(item.pathname, true).then(res => {
                            store.dispatch('setJournalId', res.data)
                            db.fileJournalDao.deleteById(item.id)
                        })
                        break;
                    }
                    case 3: {
                        http.notificationApi.commitDelete(item.pathname, true).then(res => {
                            store.dispatch('setJournalId', res.data)
                            db.fileJournalDao.deleteById(item.id)
                        })
                        break;
                    }
                    case 4: {
                        db.libraryDao.getLocalPathByName(item.library).then(localPath => {
                            const content = fileCRUD.read(path.join(localPath, item.pathname))
                            http.notificationApi.commitEdit(item.pathname, content).then(res => {
                                store.dispatch('setJournalId', res.data)
                                db.fileJournalDao.deleteById(item.id)
                            })
                        })
                        break;
                    }
                    case 5: {
                        http.notificationApi.commitMove(item.pathname, item.description).then(res => {
                            store.dispatch('setJournalId', res.data)
                            db.fileJournalDao.deleteById(item.id)
                        })
                        break;
                    }
                    default: {
                        console.log('if this shows up, it might means test info.')
                    }
                }
            }
        })
    }

    remoteToLocal(data) {
        data.forEach(element => {
            if (element.journalId > store.state.fileJournal.journalId) {
                switch (element.eventType) {
                    case 0: { fileCRUD.createFile(path.join(tthis.userDefault, element.path)); break; };
                    case 1: { fileCRUD.remove(element.path); break; }
                    case 2: { if (fileCRUD.checkRepeat(element.path)) { fileCRUD.createFolder(element.path) }; break; }
                    case 3: { fileCRUD.remove(element.path); break; }
                    case 4: { http.fileApi.fetchContent(element.path).then(res => { if (res.errCode == '00') { fileCRUD.write(element.path, res.data) } }); break; }
                    case 5: { fileCRUD.move(element.description, element.path); break; }
                    default: console.error("unknown event type")
                }
                store.dispatch('setJournalId', element.journalId)
            }
        });
    }

    listRemote() {
        http.notificationApi.list().then(res => {
            console.log('remote list', res)
            if (res != null && res.length > 0) {
                setTimeout(() => {
                    // this.remoteToLocal(res.data)
                    store.dispatch('handleRemoteJournal', res)
                }, 1000);
            }
        })
    }

    stopList() {
        console.log("取消定时事件")
        clearInterval(this.intervalObj1);
        clearInterval(this.intervalObj2);
    }
}

export default NotificationWatcher