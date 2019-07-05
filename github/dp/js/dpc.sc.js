/**
 * DPC
 *
 *  显示文档观看端JS代码
 *
 * Version 0.0.2
 *
 * Created by shanglt on 2018/05/21.
 */
!(function (window, document) {

    var Utils = {

        toJson: function (j) {
            if (typeof j === "string") {
                j = JSON.parse(j);
            }
            return j;
        }

    };

    var opts = {
        dpc: {
            id: 'dpa'
        },
        isPriorityFlash: false,
        displayMode: 0
    };


    var Dpc = function () {
        var df = document.getElementById(opts.dpc.id);

        if (!df) {
            throw new Error('iframe element is not exists');
        }

        this.df = df;

        (function (d) {

            if (window.addEventListener) {
                setInterval(function () {
                    if (d.df.contentWindow) {
                        return;
                    }

                    d.df = document.getElementById(opts.dpc.id);

                    if (window.attachEvent) {
                        d.df.attachEvent('onload', function () {
                            if (!this.src) {
                                return;
                            }

                            if (!d.isLoaded) {
                                d.isLoaded = true;
                                d.pmBuffers();
                            } else {
                                d.resetWithMeta();
                            }
                        });
                    } else {
                        d.df.onload = function () {
                            if (!this.src) {
                                return;
                            }

                            if (!d.isLoaded) {
                                d.isLoaded = true;
                                d.pmBuffers();
                            } else {
                                d.resetWithMeta();
                            }
                        };
                    }
                }, 30);
            }

            if (window.attachEvent) {
                document.getElementById('dpa').attachEvent('onload', function () {
                    // if (!this.src) {
                    //     return;
                    // }

                    if (!d.isLoaded) {
                        d.isLoaded = true;
                        d.pmBuffers();
                    } else {
                        d.resetWithMeta();
                    }
                });
            } else {
                d.df.onload = function () {
                    // console.log('dpc.js', 'dpc iframe is onload src ' + this.src);

                    if (!this.src) {
                        return;
                    }

                    if (!d.isLoaded) {
                        d.isLoaded = true;
                        d.pmBuffers();
                    } else {
                        d.resetWithMeta();
                    }
                };
            }
        })(this);

        this.df.src = '//image.csslcloud.net/dpsc/dp.html?vertical=1&displayMode=' + $('#documentDisplayMode').val();

        this.isLoaded = false;

        this.buffers = [];

        this.metaCache = {
            pageChange: [],
            animation: [],
            draw: []
        };

        this.reload = function () {
            this.df.src = this.df.src;
        };

        this.resetWithMeta = function () {
            this.resetWithMeta();
        };

        this.pmBuffers = function () {
            var bs = this.buffers;
            if (!bs.length) {
                return;
            }

            for (var i = 0; i < bs.length; i++) {
                this.pm(bs[i]);
            }

            this.buffers = [];
        };

        /**
         * 通过postMessage将翻页等数据告知给dp页面，兼容低版本IE，内容必须转换为字符串
         *
         * */
        this.pm = function (data) {
            if (window.attachEvent) {
                this.isLoaded = true;
            }

            if (!this.isLoaded) {
                return this.buffers.push(data);
            }

            if (typeof data != 'string') {
                data = JSON.stringify(data);
            }

            if (this.df && this.df.contentWindow) {
                this.df.contentWindow.postMessage(data, '*');
            } else {
                // console.error('dpc', 'df is null');
            }
        };

        this.pageChange = function (data) {
            this.metaCache.pageChange.push(data);

            this.pm({
                action: 'page_change_from_dpc',
                value: data
            });
        };

        this.animationChange = function (data) {
            this.metaCache.animation.push(data);

            this.pm({
                action: 'animation_change_from_dpc',
                value: data
            });
        };

        this.draw = function (data) {
            this.metaCache.draw.push(data);

            this.pm({
                action: 'draw_from_dpc',
                value: data
            });
        };

        this.resize = function (data) {
            this.pm({
                action: 'resize_from_dpc',
                value: data
            });
        };

        this.history = function (meta) {
            this.metaCache.pageChange = meta.pageChange;
            this.metaCache.animation = meta.animation;
            this.metaCache.draw = meta.draw;

            this.resetWithMeta();
        };

        this.resetWithMeta = function () {
            this.pm({
                action: 'reset_with_meta_from_dpc',
                value: this.metaCache
            });
        };

        this.clear = function () {
            this.metaCache.pageChange = [];
            this.metaCache.animation = [];
            this.metaCache.draw = [];

            this.pm({
                action: 'clear_from_dpc',
                value: {}
            });
        };

    };

    window.handleMessageFromDp = function (data) {
        var action = data.action;
        if (action === 'dpdblclick_from_dp') {
            if (typeof window.toggleFullScreen === 'function') {
                window.toggleFullScreen(document.getElementById('dpa'));
            }
        } else if (action === 'animation_change_from_dp') {
            if (typeof window.animation_change_from_dp === 'function') {
                window.animation_change_from_dp(data);
            }
        } else if (action === 'resize_from_dp') {
            if (typeof window.resize_from_dp === 'function') {
                window.resize_from_dp(data);
            }
        }
    };

    if (window.addEventListener) {
        window.addEventListener('message', function (event) {
            handleMessageFromDp(Utils.toJson(event.data));
        });
    } else {
        window.attachEvent('onmessage', function (event) {
            handleMessageFromDp(Utils.toJson(event.data));
        });
    }

    window.Dpc = Dpc;

})(window, document, undefined);

// /**
//  * 全屏功能，仅支持现代浏览器
//  * */
// ;(function (document) {
//
//     function enterFullscreen(ele) {
//         if (ele.requestFullscreen) {
//             ele.requestFullscreen();
//         } else if (ele.mozRequestFullScreen) {
//             ele.mozRequestFullScreen();
//         } else if (ele.msRequestFullscreen) {
//             ele.msRequestFullscreen();
//         } else if (ele.webkitRequestFullscreen) {
//             ele.webkitRequestFullScreen();
//         }
//     }
//
//     function exitFullscreen() {
//         if (document.exitFullscreen) {
//             document.exitFullscreen();
//         } else if (document.msExitFullscreen) {
//             document.msExitFullscreen();
//         } else if (document.mozCancelFullScreen) {
//             document.mozCancelFullScreen();
//         } else if (document.webkitExitFullscreen) {
//             document.webkitExitFullscreen();
//         }
//     }
//
//     function enterFullscreenCallback(ele) {
//         if (typeof window.on_cc_enter_fullscreen === 'function') {
//             window.on_cc_enter_fullscreen(ele);
//         }
//     }
//
//     function exitFullscreenCallback() {
//         if (typeof window.on_cc_exit_fullscreen === 'function') {
//             window.on_cc_exit_fullscreen();
//         }
//     }
//
//     if (window.addEventListener) {
//         document.addEventListener("fullscreenchange", function (event) {
//             if (!!document.fullscreenElement) {
//                 enterFullscreenCallback(document.fullscreenElement);
//             } else {
//                 exitFullscreenCallback();
//             }
//         });
//
//         document.addEventListener("mozfullscreenchange", function (event) {
//             if (!!document.mozFullScreenElement) {
//                 enterFullscreenCallback(document.mozFullScreenElement);
//             } else {
//                 exitFullscreenCallback();
//             }
//         });
//         document.addEventListener("webkitfullscreenchange", function (event) {
//             if (!!document.webkitFullscreenElement) {
//                 enterFullscreenCallback(document.webkitFullscreenElement);
//             } else {
//                 exitFullscreenCallback();
//             }
//         });
//
//         document.addEventListener("msfullscreenchange", function (event) {
//             if (!!document.msFullscreenElement) {
//                 enterFullscreenCallback(document.msFullscreenElement);
//             } else {
//                 exitFullscreenCallback();
//             }
//         });
//     }
//     window.toggleFullScreen = function (ele) {
//         var fullScreenElement = document.fullscreenElement
//             || document.mozFullScreenElement
//             || document.msFullscreenElement
//             || document.webkitFullscreenElement;
//
//         if (!!fullScreenElement) {
//             exitFullscreen();
//         } else {
//             enterFullscreen(ele);
//         }
//     }
//
// })(document);