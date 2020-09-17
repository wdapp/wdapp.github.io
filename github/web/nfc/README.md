# H5&Native NFC 交互文档

### 方法

```javascript
/**
* 检查设备是否支持NFC
*/

// Native端定义
window.isSupportNFC = function(cb) {
  // 调用检查设备是否支持NFC原生方法
  
  // 回调给H5数据结构
  var data = {
    isSupport: true, // 设备是否支持NFC
    isOpen: true // 设备是否开启NFC
  }
  // 回调给H5
  cb(data);
}

// H5端调用
window.isSupportNFC((data) => {
	console.log('isSupportNFC', data);
});
```

```javascript
/**
* 启用设备NFC功能
*/

// Native端定义
window.openNFC = function(cb) {
  // 启用设备NFC原生方法
  
  // 回调给H5数据结构
  var data = {
    code: 1, // 1：启用成功，2：启用失败，3：未知原因
    message: '' // 回调信息，可选
  }
  // 回调给H5
  cb(data);
}

// H5端调用
window.openNFC((data) => {
	console.log('openNFC', data);
});
```

```javascript
/**
* 读取NFC信息
*/

// Native端定义
window.readNFCInfo = function() {
  // 读取NFC识别原生方法
  
}

// H5端调用
window.readNFCInfo();
```

```javascript
/**
* 写入NFC信息
*/

// Native端定义
window.writeNFCInfo = function(info, cb) {
  // 写入NFC信息原生方法
  
   // 回调给H5数据结构
  var data = {
    code: 1, // 1：写入成功，2：写入失败，3：未知原因
    message: '' // 回调信息，可选
  }
  // 回调给H5
  cb(data);
}

// 写入NFC信息（根据后端接口文档调整，暂定） 
var info = {
  id: '',
  cardId: '',
  price: ''
}
// H5端调用
window.writeNFCInfo(info, (data) => {
	console.log('writeNFCInfo', data);
});
```



```javascript
/**
* 关闭NFC识别
*/

// Native端定义
window.closeScanNFC = function() {
  // 关闭NFC识别原生方法
  
  // 回调给H5数据结构
  var data = {
    code: 1, // 1：关闭成功，2：关闭失败，3：未知原因
    message: '' // 回调信息，可选
  }
}

// H5端调用
window.closeScanNFC();
```



### 回调

```javascript
/**
* NFC扫描回调（readNFCInfo 读取NFC信息回调）
*/

// H5端定义
window.onScanNFC = ((data) => {
  console.log('onScanNFC', data);
});

// 传递给H5端参数数据结构
var data = {
  isSupport: true, // 设备是否支持NFC
  isOpen: true, // 设备是否开启NFC
  status: '', // 0：未扫描，1：扫描中，2：扫描成功，3：扫描失败，请重试
  data: { // 识别信息，读卡信息数据结构
    id: '',
  	cardId: '',
  	price: ''
  },
  message: '', // 扫描信息，可选
}
  
// Native端调用
window.onScanNFC(data);
```

