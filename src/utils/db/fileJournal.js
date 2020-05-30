import { db } from './schema'
const normalize = require('normalize-path');

export function get() {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM 'file_journal' LIMIT 1", (err, res) => {
            if (err)
                reject(err);
            resolve(res);
        })
    })
}

export function insert(pathname, type, description) {
    db.run("INSERT INTO 'file_journal'(pathname, type, description) VALUES($d1, $d2, $d3)",
        { $d1: normalize(pathname), $d2: type, $d3: description }, (err) => {
            if (err) throw err;
        })
}

export function deleteById(id) {
    db.run("delete from 'file_journal' where id=?", [id], (err) => {
        if (err) throw err;
    })
}