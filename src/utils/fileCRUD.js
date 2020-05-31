import fs from 'fs-extra';
import path from 'path';
import db from '@/utils/db'


function checkForRepeat(pathName, isFile) {
    if (isFile) {
        if (fs.pathExists(pathName + '.md')) {
            return checkForRepeatNumber(pathName, 1, true);
        } else {
            return pathName + '.md';
        }
    } else {
        if (fs.pathExistsSync(pathName)) {
            return checkForRepeatNumber(pathName, 1, false);
        } else {
            return pathName;
        }
    }
}

function checkForRepeatNumber(pathName, number, isFile) {
    if (isFile) {
        if (fs.pathExists(pathName + ' (' + number + ')' + '.md')) {
            return checkForRepeatNumber(pathName, number + 1, true);
        } else {
            return pathName + ' (' + number + ')' + '.md';
        }
    } else {
        if (fs.pathExists(pathName + ' (' + number + ')')) {
            return checkForRepeatNumber(pathName, number + 1, false);
        } else {
            return pathName + ' (' + number + ')';
        }
    }

}

export function checkRepeat(pathname) {
    return fs.existsSync(pathname);
}

export function createFile(fileName) {
    // if (isLeaf) {
    //     pathname = path.dirname(pathname)
    // }
    // let longPath = path.join(userDefault, pathname, fileName)
    // // 检查重名
    // console.log(`checkForRepeat ${checkForRepeat(longPath, true)}`)
    // longPath = checkForRepeat(longPath, true)
    fs.createFile(fileName);
    // return longPath.slice(userDefault.length + 1);
}

export function createFolder(folderName) {
    fs.mkdirsSync(folderName);
}
export function createFolderIfNotExist(folderName, pathname, isLeaf) {
    if (isLeaf) {
        pathname = path.dirname(pathname)
    }
    let longPath = path.join(userDefault, pathname, folderName);
    if (fs.exists(longPath)) {
        return;
    }

    longPath = checkForRepeat(longPath, false)
    fs.mkdir(longPath);
    return longPath.slice(userDefault.length + 1);
}

export function move(oldPath, newPath) {
    // fs.moveSync(oldPath, newPath)
    fs.copySync(oldPath, newPath)
    fs.remove(oldPath);
}

export function remove(pathname) {
    fs.remove(pathname);
}


export function write(pathname, data) {
    // const filepath = path.resolve(userDefault, pathname);
    const dirname = path.dirname(pathname)
    if (!fs.existsSync(dirname)) {
        fs.mkdirsSync(dirname);
    }
    fs.writeFile(pathname, data)
}

export function read(pathname) {
    // const filepath = path.resolve(userDefault, pathname);
    return fs.readFileSync(pathname, "utf8")
}