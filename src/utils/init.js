import fs from 'fs-extra';
import path from 'path';
import { remote } from 'electron'

export default function () {
    const app = remote.app;
    const STORE_PATH = app.getPath('userData')
    // STORE_PATH = localStorage.getItem('STORE_PATH');
    // const dbFolder = path.join(STORE_PATH, 'db')
    const userDefault = path.join(STORE_PATH, 'library', 'default')
    if (!fs.existsSync(userDefault)) {
        fs.mkdirsSync(userDefault)
    }

    localStorage.setItem('STORE_PATH', STORE_PATH);
    localStorage.setItem('userDefault', userDefault);
    localStorage.setItem('userId', '')
    localStorage.setItem('Authorization', '')
    localStorage.setItem('journalId', '0')
    localStorage.setItem("Initialized",'true')
}