var GENERIC_I2C = function(i2cPort,slaveAddress) {
  this.i2cPort = i2cPort;
  this.i2cSlave = null;
  this.slaveAddress = slaveAddress;
}

GENERIC_I2C.prototype = {
  sleep: function(ms){
    return new Promise((resolve)=>{setTimeout(resolve,ms);});
  },
  init: function() {
    return new Promise((resolve, reject)=>{
      this.i2cPort.open(this.slaveAddress).then(async (i2cSlave)=>{
        this.i2cSlave = i2cSlave;
        // FUNCTION_SET<0x20>,DL<0x10>,N<0x8>
        await this.writeLcdCmd(0x38);
        // FUNCTION_SET<0x20>,DL<0x10>,N<0x8>,IS<0x1>
        await this.writeLcdCmd(0x39);
        // INTERNAL_OSC_FREQ<0x10>,BS<0x8>,F2<0x4>
        await this.writeLcdCmd(0x14);
        // CONTRAST_SET<0x70>,contrast[3:0]
        await this.writeLcdCmd(0x73);
        // POWER_ICON_BOST_CONTR<0x50>, Bon<0x4>,contrast[1:0]
        await this.writeLcdCmd(0x56);
        // FOLLOWER_CONTROL<0x60>,Fon<0x8>,Rab[2:0]
        await this.writeLcdCmd(0x6c);
        await this.sleep(100);
        
        await this.writeLcdCmd(0x38);

        // CLEAR_DISPLAY<0x1>
        await this.writeLcdCmd(0x1);
        // ENTRY_MODE_SET<0x4>,DISPLAY_ON_OFF<0x8>
        await this.writeLcdCmd(0xc);

	// RETURN_HOME<0x02>
        await this.writeLcdCmd(0x2);

        resolve();
      }).catch((reason)=>{
        reject(reason);
      });
    });
  },

  writeLcdCmd: function(cmd) {
    return new Promise(async (resolve, reject)=>{
      try {
        if(this.i2cSlave == null){
          reject("i2cSlave Address does'nt yet open!");
        }else{
	  var wrData = new Uint8Array([0x0,cmd]);
          var resolveData = await this.i2cSlave.writeBytes(wrData); 
          resolve(resolveData);
        }
      } catch(e) {
        reject(e);
      }
    });
  },

  writeLcdData: function(cmd) {
    return new Promise(async (resolve, reject)=>{
      try {
        if(this.i2cSlave == null){
          reject("i2cSlave Address does'nt yet open!");
        }else{
	  var wrData = new Uint8Array([0x40,cmd]);
          var resolveData = await this.i2cSlave.writeBytes(wrData); 
          resolve(resolveData);
        }
      } catch(e) {
        reject(e);
      }
    });
  },

  homeLcd: function() {
    return new Promise(async (resolve, reject)=>{
      try {
        if(this.i2cSlave == null){
          reject("i2cSlave Address does'nt yet open!");
        }else{
	  // RETURN_HOME<0x02>
          var resolveData = await await this.writeLcdCmd(0x2);
          resolve(resolveData);
        }
      } catch(e) {
        reject(e);
      }
    });
  },

  clearLcd: function() {
    return new Promise(async (resolve, reject)=>{
      try {
        if(this.i2cSlave == null){
          reject("i2cSlave Address does'nt yet open!");
        }else{
          // CLEAR_DISPLAY<0x1>
          var resolveData = await await this.writeLcdCmd(0x1);
          resolve(resolveData);
        }
      } catch(e) {
        reject(e);
      }
    });
  },

  cursorLcd : function(x,y) {
    return new Promise(async (resolve, reject)=>{
      try {
        if(this.i2cSlave == null){
          reject("i2cSlave Address does'nt yet open!");
        }else{
          // CLEAR_DISPLAY<0x1>
          var cuCmd = 0x80 + ((x & 0xf) + (y & 0x1) * 40); 
          var resolveData = await await this.writeLcdCmd(cuCmd);
          resolve(resolveData);
        }
      } catch(e) {
        reject(e);
      }
    });
  },

  setTakoLcd : function() {
    return new Promise(async (resolve, reject)=>{
      try {
        if(this.i2cSlave == null){
          reject("i2cSlave Address does'nt yet open!");
        }else{
	  var wrData = new Uint8Array([0x40,0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48]);
          var resolveData = await this.i2cSlave.writeBytes(wrData); 
          resolve(resolveData);
        }
      } catch(e) {
        reject(e);
      }
    });
  },

  setStringLcd : function(string) {
    return new Promise(async (resolve, reject)=>{
      try {
        if(this.i2cSlave == null){
          reject("i2cSlave Address does'nt yet open!");
        }else{
          var strPoint = 0;
          var remain = string.length;
	  if (remain > 16) {
            reject("string to long");
          }
//          console.log("set lcd string:"+string);
	  if (remain > 8) {
	    var wrData = new Uint8Array(9);
            wrData[0] = 0x40;
	    for(var i=0;i < 8; i++){
              var c = string[strPoint++].charCodeAt(0);;
              wrData[i+1] = c;
            }
            var resolveData = await this.i2cSlave.writeBytes(wrData); 
            remain = remain -8;
          }
	  var wrData = new Uint8Array(remain+1);
          wrData[0] = 0x40;
	  for(var i=0;i < remain; i++){
              var c = string[strPoint++].charCodeAt(0);
              wrData[i+1] = c;
          }
          var resolveData = await this.i2cSlave.writeBytes(wrData); 
          resolve(resolveData);
        }
      } catch(e) {
        reject(e);
      }
    });
  },

  setCharLcd : function(char) {
    return new Promise(async (resolve, reject)=>{
      try {
        if(this.i2cSlave == null){
          reject("i2cSlave Address does'nt yet open!");
        }else{
          // CLEAR_DISPLAY<0x1>
          var resolveData = await this.writeLcdData(char);
          resolve(resolveData);
        }
      } catch(e) {
        reject(e);
      }
    });
  }
}
