import store from '@/store'
const chokidar = require('chokidar');


var watcher = null;
function FileWatcher(library) {
     store.dispatch('finished_initialiaze', false);

     // let {ADD_NODE} = FileSystem.mutations
     if (watcher === null) {
          watcher = chokidar.watch(library, {
               ignored: /[\/\\]\./,
               persistent: true
          })
     } else {
          watcher.close()
          watcher = chokidar.watch(library, {
               ignored: /[\/\\]\./,
               persistent: true
          })
     }


     function onWatcherReady() {
          console.info('From here can you check for real changes, the initial scan has been completed.');
          store.dispatch('finished_initialiaze', true)
     }

     // Declare the listeners of the watcher
     watcher.on('add', function (path, stats) {
          console.log('File', path, 'has been added');
          store.dispatch('ADD_NODE_ACTION', { fn: path.slice(library.length + 1), stats: stats, isDir: false })
          // console.log(`${util.inspect(store)}`)
          // ADD_NODE(path.slice(userPkm.length + 1), stats, false)
          // messageBus.$emit('file', path.slice(userPkm.length + 1), stats);
          //   ipcRenderer.send('file', path.slice(userPkm.length + 1), stats);
     }).on('addDir', function (path, stats) {
          console.log('Directory', path, 'has been added');
          store.dispatch('ADD_NODE_ACTION', { fn: path.slice(library.length + 1), stats: stats, isDir: true })
          // ADD_NODE(path.slice(userPkm.length + 1), stats, true)
          // messageBus.$emit('directory', path.slice(userPkm.length + 1), stats);
          //   ipcRenderer.send('directory', path.slice(userPkm.length + 1), stats);
     }).on('change', function (path, stats) {
          console.log('File', path, 'has been changed');
     }).on('unlink', function (path) {
          store.commit('REMOVE_NODE_MUTATION', path.slice(library.length + 1))
          // messageBus.$emit('unlink', path.slice(userPkm.length + 1));
          console.log('File', path, 'has been removed');
     }).on('unlinkDir', function (path) {
          store.commit('REMOVE_NODE_MUTATION', path.slice(library.length + 1))
          console.log('Directory', path, 'has been removed');
     }).on('error', function (error) {
          console.log('Error happened', error);
     }).on('ready', onWatcherReady).on('raw', function (event, path, details) {
          // This event should be triggered everytime something happens.
          console.log('Raw event info:', event, path, details);
     });
}

export default FileWatcher
