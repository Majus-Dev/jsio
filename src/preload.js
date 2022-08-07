const { contextBridge, ipcRenderer } = require('electron');
let container
let jsonstyle

//GET KEYS WHEN APP IS LOADED
window.addEventListener('DOMContentLoaded', async () => {
    container = document.getElementById('container');

    if (!container) console.log('container not found'); 
    ipcRenderer.invoke('get-jsonstyle', null).then(json => {
        jsonstyle = json;
    });
    ipcRenderer.invoke('get-keys', null).then(keys => {
        updateLayout(keys);
    })
    loop();
});

ipcRenderer.on('update-layout', (event, keys) => {
    container.innerHTML = '';
    updateLayout(keys);
});

function updateLayout( keys ) {
  for (let key of keys) {
    let _div = document.createElement('div');
    _div.classList.add('grid-item');
    _div.classList.add('key');
    if (jsonstyle[0].activebackground == "rainbow") {
        _div.classList.add('rainbow');
    }
    else {
        _div.style.backgroundColor = jsonstyle[0].activebackground;
    }
    _div.id = key.value;
    _div.innerText = key.name;
    _div.style.gridColumnStart = key.pos.x;
    if (!key.width) _div.style.gridColumnEnd = key.pos.x + 2;
    if(key.width) _div.style.gridColumnEnd = key.pos.x + key.width //if key is wider, set gridColumnEnd to width + 1
    _div.style.gridRowStart = key.pos.y;
    _div.style.gridRowEnd = key.pos.y + 2;
    container.appendChild(_div);
    }
}

function loop() {
    setTimeout(() => {
        keysGetSet();
        loop();
    }, 1);
}

function keysGetSet() {
    ipcRenderer.invoke('get-keys', null).then(keys => {
        for (let i of keys) {
            if (i.pressed) {
                if(!document.getElementById(i.value)) return
                document.getElementById(i.value).classList.remove('unpressed');
            } else {
                if(!document.getElementById(i.value)) return
                document.getElementById(i.value).classList.add('unpressed');
            }
        }   
    });
}