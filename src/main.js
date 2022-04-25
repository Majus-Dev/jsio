const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const gkm = require('gkm');
const fs = require('fs');
const rawKeys = fs.readFileSync(path.join(__dirname, 'cfg/ggst.json'));
const rawStyles = fs.readFileSync(path.join(__dirname, 'cfg/style.json'));
const keys = JSON.parse(rawKeys);
const jsonstyle = JSON.parse(rawStyles);

//GKM KEY LOGIC
gkm.events.on('key.pressed', (data) => {
    if (data == 'Undefined') return;
    for(let i of keys) {
        if (i.value == data) {
            i.pressed = true;
        }
    }
});
gkm.events.on('key.released', (data) => {
    if (data == 'Undefined') return;
    for(let i of keys) {
        if (i.value == data) {
            i.pressed = false;
        }
    }
});
gkm.events.on('mouse.pressed', (data) => {
    if (data == 'Undefined') return;
    for(let i of keys) {
        if (i.value == `M${data}`) {
            i.pressed = true;
        }
    }
});
gkm.events.on('mouse.released', (data) => {
    if (data == 'Undefined') return;
    for(let i of keys) {
        if (i.value == `M${data}`) {
            i.pressed = false;
        }
    }
});

// ELECTRON WINDOW STUFF
let _x = 0;
let _y = 0;
for (let x of keys) {
    if (_x <= x.pos.x) _x = x.pos.x;
}
for (let y of keys) {
    if (_y <= y.pos.y) _y = y.pos.y;
}


const createWindow = () => {
    const window = new BrowserWindow({
        width: _x*102 + 50,
        height: _y*102 + 50,
        icon: __dirname + '/favicon.ico',
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    window.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
      })
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

// IPC MAIN
ipcMain.handle('get-keys', async (event, arg) => {
    return keys;
});
ipcMain.handle('get-jsonstyle', async (event, arg) => {
    return jsonstyle;
});
