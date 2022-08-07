const gkm = require('gkm');

gkm.events.on('key.pressed', (data) => {
    if (data == 'Undefined') return;
    console.log(data)
});
gkm.events.on('mouse.wheel.*', (data) => {
  if (data == 'Undefined') return;
  let slicedData = `MWheel${JSON.stringify(data).split(",")[0].split('"')[1] != 1 ? "Up" : "Down"}`
  console.log(slicedData ,data)
})