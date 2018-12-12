'use strict';

const DEVICE_UUID     = "928a3d40-e8bf-4b2b-b443-66d2569aed50";
let connectButton;
window.addEventListener(
  "load",
  function() {
    connectButton = document.querySelector("#BLECONN");
    connectButton.addEventListener("click", mainFunction);
  },
  false
);

async function mainFunction(){ // プログラムの本体となる関数、非同期処理のためプログラム全体をasync関数で包みます。
	var bleDevice = await navigator.bluetooth.requestDevice({
      filters: [{ services: [DEVICE_UUID] }] });
	var gpioAccess = await navigator.requestGPIOAccess(bleDevice); // thenの前の関数をawait接頭辞をつけて呼び出します。
	connectButton.hidden = true;
	var port = gpioAccess.ports.get(7);
	await port.export("out");
	var v = 0;
	while ( true ){ // 無限ループ
		await sleep(1000); // 1000ms待機する
		v ^= 1; // v = v ^ 1 (XOR 演算)の意。　vが1の場合はvが0に、0の場合は1に変化する。1でLED点灯、0で消灯するので、1秒間隔でLEDがON OFFする。
		port.write(v);
	}
}

// この関数の定義方法はとりあえず気にしなくて良いです。コピペしてください。
// 単に指定したms秒スリープするだけの非同期処理関数
function sleep(ms){
	return new Promise( function(resolve) {
		setTimeout(resolve, ms);
	});
}
