import path from "path";
import util from "util";
import splitter from "@/utils/path-splitdirs";
import * as fileCRUD from "@/utils/fileCRUD";
import Vue from 'vue'

const state = {
    currentLibrary: { id: 1, name: 'default' },
    currentFile: null,
    fileList: [],
    initial: false,
    content: '',
    isChange: false,
}

const getters = {
    currentFileTitle: state => (state.currentFile ? path.basename(state.currentFile.pathname, '.md') : ''),
    contentCount: state => state.content.length
}

const mutations = {
    commitCurrentLibrary(state, currentLibrary) {
        state.currentLibrary = currentLibrary
    },
    commitCurrentFile(state, file) {
        state.currentFile = file
    },
    commitContent(state, content) {
        state.content = content
    },
    commitFileList(state, fileList) {
        state.fileList = fileList
    },
    setInitial(state, initial) {
        state.initial = initial;
    },
    ADD_NODE_MUTATION(state, payload) {// 讲文件名格式统一 eg.pkm\ccccc1111\untitled.md
        let { fn, stats, isDir } = payload;
        console.log(`addPathToTree ${fn} ${util.inspect(stats)} ${isDir}`);
        const basenm = path.basename(fn); // 文件名 eg.untitled.md
        const split = splitter(fn); // 文件的所有文件夹
        let curnodes = state.fileList;
        for (let dir of split.dirs) {
            if (dir === "." || dir === "") continue;
            let found = undefined;
            for (let cur of curnodes) {
                if (cur.isDir && cur.title === dir) {
                    found = cur;
                    break;
                }
            }
            if (!found) {
                let newnode = {
                    title: dir,
                    isDir: true,
                    children: [],
                    pathname: fn,
                    stats
                };
                // console.log(`addPathToTree !found push newnode ${util.inspect(newnode)}`);
                curnodes.push(newnode);
                curnodes = newnode.children;
            } else {
                curnodes = found.children;
            }
        }
        let newnode = {
            title: basenm,
            isDir: isDir,
            pathname: fn,
            stats
        };
        if (newnode.isDir) newnode.children = [];
        // console.log(`addPathToTree FINAL push newnode ${util.inspect(newnode)}`);
        curnodes.push(newnode);
    },
    REMOVE_NODE_MUTATION(state, pathname) {
        // console.log(payload)
        const split = splitter(pathname);
        console.log(split)
        let curnodes = state.fileList;
        for (let dir of split.dirs) {
            if (dir === "." || dir === "") continue;
            let found = undefined;
            for (let cur of curnodes) {
                if (cur.isDir && cur.title === dir) {
                    found = cur;
                    break;
                }
            }
            if (!found) return;
            else curnodes = found.children;
        }
        const index = curnodes.findIndex(item => item.pathname === pathname);
        curnodes.splice(index, 1)
    },
    setChange(state, isChange) {
        state.isChange = isChange
    }
}

const actions = {
    ADD_NODE_ACTION({ commit, state }, payload) {
        console.log(payload)
        if (payload.fn === "") return;
        payload.fn = path.normalize(payload.fn);
        commit('ADD_NODE_MUTATION', payload)
    },
    finished_initialiaze({ commit }, initial) {
        commit('setInitial', initial)
    },
    setCurrentFile({ state, commit, getters, rootState }, activeItem) {
        commit('commitCurrentFile', activeItem)
        commit('commitContent', fileCRUD.read(path.join(rootState.fileJournal.userDefault, activeItem.pathname)))

    }
}

export default {
    state,
    getters,
    mutations,
    actions
}
