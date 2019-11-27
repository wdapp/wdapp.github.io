"use strict";
/**
 * mini (~500 b) version for event-emitter.
 *
 * Created by hustcc on 2018/12/31
 * Contract: vip@hust.edu.cn
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * const ee = new OnFire();
 *
 * ee.on('click', (...values) => {});
 *
 * ee.on('mouseover', (...values) => {});
 *
 * ee.emit('click', 1, 2, 3);
 * ee.fire('mouseover', {}); // same with emit
 *
 * ee.off();
 */

var OnFire =
/** @class */
function () {
  function OnFire() {
    // 所有事件的监听器
    this.es = {};
  }

  OnFire.prototype.on = function (eventName, cb, once) {
    if (once === void 0) {
      once = false;
    }

    if (!this.es[eventName]) {
      this.es[eventName] = [];
    }

    this.es[eventName].push({
      cb: cb,
      once: once
    });
  };

  OnFire.prototype.once = function (eventName, cb) {
    this.on(eventName, cb, true);
  };

  OnFire.prototype.fire = function (eventName) {
    var params = [];

    for (var _i = 1; _i < arguments.length; _i++) {
      params[_i - 1] = arguments[_i];
    }

    var listeners = this.es[eventName] || [];
    var l = listeners.length;

    for (var i = 0; i < l; i++) {
      var _a = listeners[i],
          cb = _a.cb,
          once = _a.once;
      cb.apply(this, params);

      if (once) {
        listeners.splice(i, 1);
        i--;
        l--;
      }
    }
  };

  OnFire.prototype.off = function (eventName, cb) {
    // clean all
    if (eventName === undefined) {
      this.es = {};
    } else {
      if (cb === undefined) {
        // clean the eventName's listeners
        delete this.es[eventName];
      } else {
        var listeners = this.es[eventName] || []; // clean the event and listener

        var l = listeners.length;

        for (var i = 0; i < l; i++) {
          if (listeners[i].cb === cb) {
            listeners.splice(i, 1);
            i--;
            l--;
          }
        }
      }
    }
  }; // cname of fire


  OnFire.prototype.emit = function (eventName) {
    var params = [];

    for (var _i = 1; _i < arguments.length; _i++) {
      params[_i - 1] = arguments[_i];
    }

    this.fire.apply(this, [eventName].concat(params));
  };

  OnFire.ver = "2.0.1";
  return OnFire;
}();

exports.default = OnFire;