const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const gkm = require('gkm');
const fs = require('fs');
let dir = fs.readdirSync(path.join(__dirname, 'cfg/'))
let currentlayout
let rawKeys = fs.readFileSync(path.join(__dirname, 'cfg/qwerty.json'));
let keys = JSON.parse(rawKeys);
const rawStyles = fs.readFileSync(path.join(__dirname, 'styles/style.json'));
const jsonstyle = JSON.parse(rawStyles);
let preloadEvent
let _x = 0;
let _y = 0;

//CREATE MENU
let template = [
  {
    label: 'Keyboard layout',
    submenu: [
      
    ]
  }
]
for(let item in dir) {
  template[0].submenu.push({ label: `${dir[item]}`,
  click: async () => {
    currentlayout = `${dir[item]}`
    updateLayout()
  }} )
  template[0].submenu.push({ type: 'separator' })
}
let menu = Menu.buildFromTemplate(template)

Menu.setApplicationMenu(menu)

// IPC MAIN
ipcMain.handle('get-keys', async (event, arg) => {
    return keys;
});
ipcMain.handle('get-jsonstyle', async (event, arg) => {
    preloadEvent = event;
    return jsonstyle;
});
function updateLayout() {
  fs.readFile(path.join(__dirname, `cfg/${currentlayout}`), (err, data) => {
    if (err) throw err;
    keys = JSON.parse(data);
    preloadEvent.sender.send('update-layout', keys);
  });
}


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
    for (let x of keys) {
      if (_x <= x.pos.x) _x = x.pos.x;
    }
    for (let y of keys) {
      if (_y <= y.pos.y) _y = y.pos.y;
    }
    

const createWindow = () => {
    const window = new BrowserWindow({
        width: _x*51 + 75,
        height: _y*51 + 125,
        icon: __dirname + '/favicon.ico',
        //autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    window.loadFile(path.join(__dirname, 'index.html'));
    //window.openDevTools();

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
  
  