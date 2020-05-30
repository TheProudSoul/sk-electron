import { ipcMain } from 'electron'

class IPCHandler {

  constructor(window, dbFolder) {
    this.window = window;
    this.dbFolder = dbFolder
  }

  listen() {

    // 关闭窗口
    ipcMain.on('dbFolder', (event) => {
      this.window.webContents.send('dbFolder', this.dbFolder)
    })

    ipcMain.on('close', () => {
      this.window.close();
    });

    // 最小化窗口
    ipcMain.on('minimize', () => {
      this.window.minimize();
    });

    //最大化窗口
    ipcMain.on('maximize', () => {
      if (this.window.isMaximized()) {
        this.window.unmaximize();
      } else {
        this.window.maximize();
      }
    });



  }

}
export default IPCHandler