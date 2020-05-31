import path from "path";
import * as fileCRUD from "@/utils/fileCRUD";
import db from '@/utils/db'
import http from '@/utils/api'

const state = {
    journalId: 0,
    userDefault: ''
}

const mutations = {
    commitJournalId(state, journalId) {
        state.journalId = journalId
    },
    commitUserDefault(state, userDefault) {
        state.userDefault = userDefault
    },
    unlink(state, pathname) {
        fileCRUD.remove(path.join(state.userDefault, pathname))
    }
}

const actions = {
    setJournalId({ commit }, payload) {
        commit('commitJournalId', payload)
        localStorage.setItem("journalId", payload)
    },
    setUserDefault({ commit }, userDefault) {
        commit('commitUserDefault', userDefault)
    },
    writeCurrentFile({ state, rootState }, content) {
        if (rootState.library.currentFile) {
            let pathname = rootState.library.currentFile.pathname
            fileCRUD.write(path.join(state.userDefault, pathname), content)
            db.fileJournalDao.insert(pathname, 4, '')
        }
        else {
            let filename = "untitle";
            let checkTimes = 0;
            while (fileCRUD.checkRepeat(path.join(state.userDefault, filename + ".md"))) {
                filename = filename + ' (' + (++checkTimes) + ')'
            }
            filename = filename + ".md"
            fileCRUD.write(path.join(state.userDefault, filename), content)
            db.fileJournalDao.insert(filename, 0, '')
            db.fileJournalDao.insert(filename, 4, '')
        }
    },
    handleRemoteJournal({ state, commit }, data) {
        data.forEach(element => {
            if (element.journalId > state.journalId) {
                switch (element.eventType) {
                    case 0: { fileCRUD.createFile(path.join(state.userDefault, element.path)); break; };
                    case 1: { fileCRUD.remove(path.join(state.userDefault, element.path)); break; }
                    case 2: {
                        if (!fileCRUD.checkRepeat(path.join(state.userDefault, element.path))) {
                            fileCRUD.createFolder(path.join(state.userDefault, element.path))
                        };
                        break;
                    }
                    case 3: { fileCRUD.remove(path.join(state.userDefault, element.path)); break; }
                    case 4: {
                        http.fileApi.fetchContent(element.path).then(res => {
                            if (res.errCode == '00') {
                                fileCRUD.write(path.join(state.userDefault, element.path), res.data)
                            }
                        }); break;
                    }
                    case 5: {
                        fileCRUD.move(path.join(state.userDefault, element.description), path.join(state.userDefault, element.path));
                        break;
                    }
                    default: console.error("unknown event type")
                }
                commit('commitJournalId', element.journalId)
            }
        });
    }

}

export default {
    state,
    mutations,
    actions
}
