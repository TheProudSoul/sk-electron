import { db } from './schema'

export function getLocalPathByName(name) {
    return new Promise((resolve, reject) => {
        db.get("SELECT local_path FROM 'library' where name=?", [name], (err, res) => {
            console.log(res)
            if (err)
                reject(err);
            resolve(res.local_path);
        })
    })
}

export function insert(name, local_path) {
    db.run("INSERT INTO 'library'(name, local_path) VALUES($d1,$d2)", { $d1: name, $d2: local_path }, (err) => {
        if (err) throw err;
    })
}