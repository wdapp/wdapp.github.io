/* eslint-disable */
window.DEBUG = true;

export function isAddress(address = "") {
  return /^http(s)?:\/\/view.csslcloud.net/.test(address) && /userid/.test(address) && /roomid/.test(address);
}

export function log(...info) {
  if (window.DEBUG && window.console && typeof console.log === "function") {
    console.log(...info);
  }
}

export function userAgent() {
  return navigator.userAgent
}

export function isMobile() {
  if (this.isIPad() || this.isIPhone() || this.isAndroid() || this.isWindowsPhone()) {
    return "isMobile";
  }
}

export function isWeiXin() {
  return /MicroMessenger/ig.test(userAgent())
}

export function isIPad() {
  return userAgent().match(/iPad/i) != null;
}

export function isIOS() {
  return userAgent().match(/iPhone/i) != null;
}

export function isAndroid() {
  return userAgent().match(/Android/i) != null;
}

export function isWindowsPhone() {
  return userAgent().match(/Windows Phone/i) != null;
}

export function showEm(message) {
  var msg = message.trim();

  if (!msg) {
    return "";
  }

  // 屏蔽HTML标签
  msg = shieldHTML(msg);
  // 默认解析
  msg = defaultParse(msg);
  // 解析默认表情
  msg = parseEm(msg);
  // 解析微信表情
  msg = parseWXEm(msg);
  // 解析q1 q2
  msg = parseQ12(msg);
  // 解析打赏
  msg = parseRewardAndGift(msg);
  // 解析图片
  msg = parseImages(msg);

  return msg;
}

function parseImages(message) {
  var msg = message;
  var reg = new RegExp(/\[img_(http(s)?:\/\/.+\.(jpg|gif|png))\]/ig);
  msg = msg.replace(reg, "<img class=\"img\" src=\"$1\" />");
  return msg;
}

function parseRewardAndGift(message) {
  var msg = message;
  var reg = new RegExp(/\[cem_(http(s)?:\/\/.+\.(jpg|gif|png))\]/ig);
  msg = msg.replace(reg, "<img class=\"cem\" src=\"$1\" />");
  return msg;
}

export function formatRewardAndGiftToTip(message) {
  var msg = message.msg;
  var reg = new RegExp(/\[cem_(http(s)?:\/\/.+\.(jpg|gif|png))\]/ig);
  var exec = reg.exec(msg);
  if (!exec) {
    return false;
  }
  var imgSrc = exec[1];
  var tag = exec[0];
  var arrs = msg.split(tag);
  var content = arrs[0];
  var multiple = arrs[1][0];
  var regNumber = new RegExp(/(\d+(\.\d+)?)/ig);
  var numbers = regNumber.exec(arrs[1]);
  var number = numbers[0];
  var tip = {
    name: message.username,
    content: content,
    imgSrc: imgSrc,
    multiple: multiple,
    number: parseFloat(number)
  };
  return tip;
}

function parseQ12(message) {
  var msg = message;
  // [em_q1]
  var reg = new RegExp(/\[em2_(q[1]|q[2])\]/);// [q1-q2]
  var arr = [];
  while ((arr = reg.exec(msg)) != null) {
    var index = arr[1];
    var src = require("images/emoticon/em2/em2_q/" + index + ".png");
    msg = msg.replace(reg, "<img class=\"em2-q em2-$1\" src=\"" + src + "\"/>");
  }
  return msg;
}

function parseWXEm(message) {
  var msg = message;
  var reg = new RegExp(/\[em2_(20[1-9]|2[1-9][0-9]|300)\]/);// [201-300]
  var arr = [];
  // [em_201]
  while ((arr = reg.exec(msg)) != null) {
    var index = arr[1];
    var src = require("images/emoticon/em2/em2_200/" + index + ".png");
    msg = msg.replace(reg, "<img class=\"em2 em2-$1\" src=\"" + src + "\"/>");
  }
  return msg;
}

function parseEm(message) {
  var msg = message;
  // [em_01]
  var reg = new RegExp(/\[em2_(0[1-9]|1[0-9]|20)\]/);// [01-20]
  var arr = [];
  while ((arr = reg.exec(msg)) != null) {
    var index = arr[1];
    var src = require("images/emoticon/em2/em2_20/" + index + ".png");
    msg = msg.replace(reg, "<img class=\"em2 em2-$1\" src=\"" + src + "\"/>");
  }
  return msg;
}

function defaultParse(message) {
  var msg = message;

  // 解析 \n
  msg = msg.replace(/\\n/g, "<br/>");

  // 解析 [uri_https://www.baidu.com] <a></a> 标签
  var reg = new RegExp(/\[uri_((http|https):\/\/([\w.]+\/?)\S*)\]/ig);
  msg = msg.replace(reg, "<a class=\"uri\" target=\"_blank\" href=\"$1\">$1</a>");

  return msg;
}

function shieldHTML(message) {
  var msg = message;
  msg = msg.replace(/\</g, "&lt;");
  msg = msg.replace(/\>/g, "&gt;");
  return msg;
}


