"use strict";

const DEVICE_UUID     = "928a3d40-e8bf-4b2b-b443-66d2569aed50";
let connectButton;

var head;
window.addEventListener(
  "load",
  function() {
    connectButton = document.querySelector("#BLECONN");
    connectButton.addEventListener("click", mainFunction);
    head = document.querySelector("#head");
//    mainFunction();
  },
  false
);

async function mainFunction() {
  try {
    var bleDevice = await navigator.bluetooth.requestDevice({
      filters: [{ services: [DEVICE_UUID] }] });
    var i2cAccess = await navigator.requestI2CAccess(bleDevice);
    connectButton.hidden = true;
    var port = i2cAccess.ports.get(1);
    var generic = new GENERIC_I2C(port, 0x3e);
    await generic.init();

    while(1) {
      await generic.clearLcd();
      await generic.homeLcd();
//      await generic.setCharLcd(0x41);
      await generic.cursorLcd(0,0);
      await sleep(10);
      await generic.setStringLcd('hellow world');
      await sleep(10);
      await generic.cursorLcd(0,1);
      await sleep(10);
      await generic.setStringLcd('0123456789acbdef');

      await sleep(1000);
    }
  } catch (error) {
    console.error("error", error);
  }
}

function sleep(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms);
  });
}
