import path from 'path';
import sqlite3 from 'sqlite3';
import fs from 'fs-extra'
import { remote, ipcRenderer } from 'electron'


const app = remote.app;
const STORE_PATH = app.getPath('userData')
const dbFolder = path.join(STORE_PATH, 'db')
const userDefault = path.join(STORE_PATH, 'library', 'default')
if (!fs.existsSync(dbFolder)) {
    fs.mkdirsSync(dbFolder)
}
const dbFile = path.join(dbFolder, 'super_knowledge.db')
export const db = new sqlite3.Database(dbFile);

db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS file_journal (id INTEGER PRIMARY KEY autoincrement, library TEXT NOT NULL DEFAULT 'default', pathname TEXT NOT NULL DEFAULT '', type INTEGER NOT NULL DEFAULT '0', description TEXT NOT NULL DEFAULT '')");
    db.run("CREATE TABLE IF NOT EXISTS library (id INTEGER PRIMARY KEY autoincrement, name TEXT NOT NULL DEFAULT '', local_path TEXT UNIQUE NOT NULL DEFAULT '', workspace TEXT NOT NULL DEFAULT '')");
    db.run("INSERT INTO 'library'(name, local_path) VALUES($d1,$d2)", { $d1: 'default', $d2: userDefault }, (err) => {
        if (err) throw err;
    })
    // db.run("INSERT INTO file_journal(pathname, description) VALUES($d1,$d2)", { $d1: "测试", $d2: "ceshi" }, function (err, res) {
    //     console.log(err, res, this.lastID);
    //     const id = this.lastID
    //     db.get("select * from file_journal where id=?", [id], function (err, res) {
    //         console.log(err, res);
    //     });
    //     db.run("delete from file_journal where id=?", [id], function (err, res) {
    //         console.log(err, res, this.changes, this.lastID);
    //     });
    // });
});

ipcRenderer.on('db-close', () => db.close())