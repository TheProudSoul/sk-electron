# sk-electron

> An desktop application for personal knowledge management

## Project dependencies

- [Electron](https://www.electronjs.org/)
- [Vue](https://cn.vuejs.org/)
- [electron-builder](https://github.com/nklayman/vue-cli-plugin-electron-builder)
- [Vuetify](https://vuetifyjs.com/zh-Hans/)
- [TOAST UI Editor](https://github.com/nhn/tui.editor)
- [sqlite3](https://www.npmjs.com/package/sqlite3)

## Project setup

edit the `src/config` file content to config the server url:

```json
{
    "server":"http://localhost:9999"
}
```

```script
yarn install
```

### Compiles and hot-reloads for development

```script
yarn electron:serve
```

### Compiles and minifies for production

```script
yarn electron:build
```

## 说明

> 支持夜间模式切换
> 
> 菜单可收起栏可自由收缩

### `Library` 模块不可用，写死的设置好 default, 目前仅支持 default 一个库

![Library](https://github.com/TheProudSoul/sk-electron/blob/master/library.png)

### `Version Control` 模块可用且正常

操作：

- 查看
- 新建
- 删除
- 下载

![Version Control](https://github.com/TheProudSoul/sk-electron/blob/master/snapshot/vc_1.png)

### 图床模块可用且正常

操作：

- 上传
- 新建
- 复制
- 浏览

注：只有在当前有文件的情况下才可备份，单个账号最多可拥有15个备份

![Upload](https://github.com/TheProudSoul/sk-electron/blob/master/snapshot/image_1.png)

![Upload](https://github.com/TheProudSoul/sk-electron/blob/master/snapshot/image_2_2.png)

### 编辑模块， 应该还有 bugs，但是目前来说还算正常

> 在联网下与服务端自动同步备份，因此可与网页端或手机端实时同步

操作：

- 新建文件
- 新建文件夹
- 改名字
- 删除
- 文件夹搜索
- 打开文件的本地位置

![editor_mode1](https://github.com/TheProudSoul/sk-electron/blob/master/snapshot/e_1.png)

![editor_mode2](https://github.com/TheProudSoul/sk-electron/blob/master/snapshot/e_2.png)

注：dark 模式下显示不理想，如下图

![editor_darkmode](https://github.com/TheProudSoul/sk-electron/blob/master/snapshot/e_3.png)
