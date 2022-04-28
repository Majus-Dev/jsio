const gkm = require('gkm');

gkm.events.on('key.pressed', (data) => {
    if (data == 'Undefined') return;
    console.log(data)
});