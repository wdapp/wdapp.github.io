/**
 * utils
 *
 * Version 0.0.1
 *
 * Created by shanglt on 2018/05/21.
 */
!(function (window, document) {

    if (!window.console) {
        window.console = {
            log: function () {

            }
        }
    }

    var Utils = {

        // 获取URL的参数
        getURLParameter: function (name) {
            return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
        },

        // 如果参数为string，转换为json
        toJson: function (j) {
            if (!j) {
                return {};
            }

            if (typeof j === "string") {
                j = JSON.parse(j);
            }
            return j;
        },

        pmToIfr: function (data) {
            if (typeof data != 'string') {
                data = JSON.stringify(data);
            }

            var df = document.getElementById('ifr');
            if (df && df.contentWindow) {
                df.contentWindow.postMessage(data, '*');
            } else {
                console.error('dpc', 'df is null');
            }
        },

        pmToParent: function (data) {
            if (typeof data != 'string') {
                data = JSON.stringify(data);
            }

            var wp = window.parent;
            if (wp && wp.postMessage) {
                wp.postMessage(data, '*');
            }
        },

        getHexRGB: function (o) {
            var h = parseInt(o, 10).toString(16).toUpperCase();
            var hl = h.length;
            for (var i = 0; i < 6 - hl; i++) {
                h = '0' + h;
            }
            return '#' + h;
        },

        getDrawId: function (data) {
            return data.drawid;
        },

        // 是否支持Canvas
        isSupportCanvas: function () {
            try {
                return !!document.createElement('canvas').getContext;
            } catch (e) {
                return false;
            }
        },

        getPageChangeCompleteURI: function (pc) {
            if (pc.isWhiteBorad) {
                return pc.url;
            }

            var u = pc.url;

            if (window.isHttps) {
                u = u.replace(/http:/g, 'https:');
            } else {
                u = u.replace(/https:/g, 'http:');
            }

            // 图片
            if (pc.isJpg) {
                return u;
            }

            // 动画

            // 极速模式
            if (pc.isAnimationFastestMode) {
                if (pc.pageNum == 0) {
                    return u.replace(/[0-9]+.jpg/ig, 'index.html');
                } else {
                    return u.replace(/[0-9]+.jpg/ig, 'index.html?pageIndex=' + pc.pageNum);
                }
            }

            // 非极速模式
            return u.replace('.jpg', '/index.html');
        },

        refactorPageChangeData: function (data) {
            data = Utils.toJson(data);

            var pc = {};
            if (data.action === 'page_change') { // 通过pusher传递的翻页信息
                pc.docId = data.value.docid;
                pc.docName = data.value.fileName;
                pc.docTotalPage = data.value.totalPage;
                pc.width = data.value.width;
                pc.height = data.value.height;
                pc.useSDK = data.value.useSDK;
                pc.pageTitle = data.value.pageTitle;
                pc.pageNum = data.value.page;
                pc.url = data.value.url;
                pc.mode = data.value.mode;
                pc.time = data.time;

            } else { // 翻页的历史数据
                pc.docId = data.docId;
                pc.docName = data.docName;
                pc.docTotalPage = data.docTotalPage;
                pc.width = data.width;
                pc.height = data.height;
                pc.useSDK = data.useSDK;
                pc.pageTitle = data.pageTitle;
                pc.pageNum = data.pageNum;
                pc.url = data.url;
                pc.time = data.time;
                pc.mode = data.mode;
            }

            if (pc.mode === undefined || pc.mode === null) {
                if (pc.useSDK) {
                    pc.mode = 1;
                } else {
                    pc.mode = 0;
                }
            }

            // 更新数据
            // 翻页唯一key
            pc.key = pc.docId + '_' + pc.pageNum;
            // 白板
            pc.isWhiteBorad = (pc.url === '#' && pc.docName === 'WhiteBorad');
            // 图片
            pc.isJpg = (!pc.isWhiteBorad && pc.mode == 0);
            // 动画（极速模式和非极速模式）
            pc.isAnimation = (pc.mode == 1 || pc.mode == 2);
            // 动画极速模式
            pc.isAnimationFastestMode = (pc.mode == 2);
            // 动画非极速模式
            pc.isAnimationSlowMode = (pc.mode == 1);
            // 完整的翻页地址
            pc.completeURI = Utils.getPageChangeCompleteURI(pc);

            return pc;
        },

        refactorAnimationChangeData: function (data) {
            data = Utils.toJson(data);
            var ac = {};
            if (data.action === 'animation_change') {
                ac.docId = data.value.docid;
                ac.pageNum = data.value.page;
                ac.step = data.value.step;
                ac.time = data.time;
            } else {
                ac.docId = data.docId;
                ac.pageNum = data.pageNum;
                ac.step = data.step;
                ac.time = data.time;
            }

            return ac;
        },

        refactorDrawData: function (data) {
            data = Utils.toJson(data);

            var d = {};
            if (data.action === 'draw') {
                if (!data.value) {
                    return d;
                }

                var dv = Utils.toJson(data.value);
                var dvData = Utils.toJson(dv.data);

                d.originalData = dvData;

                d.docId = dvData.docid;
                d.docName = dv.fileName;
                d.docPageIndex = dv.page;
                d.docHeight = dvData.height;
                d.docWidth = dvData.width;
                d.docKey = d.docId + '_' + d.docPageIndex;
                d.drawAlpha = dvData.alpha;
                d.drawColor = Utils.getHexRGB(dvData.color);
                d.drawId = dvData.drawid;
                d.drawData = dvData.draw;
                d.drawTriggerTime = data.time;
                d.drawDuration = dvData.drawtime;
                d.drawLineWidth = dvData.thickness;
                d.drawType = dvData.type;

            } else {

                var dataD = Utils.toJson(data.data);

                d.originalData = dataD;

                d.docId = dataD.docid;
                d.docName = data.docName;
                d.docPageIndex = dataD.page;
                d.docHeight = dataD.height;
                d.docWidth = dataD.width;
                d.docKey = d.docId + '_' + d.docPageIndex;
                d.drawAlpha = dataD.alpha;
                d.drawColor = Utils.getHexRGB(dataD.color);
                d.drawId = dataD.drawid;
                d.drawData = dataD.draw;

                d.drawTriggerTime = data.time;
                d.drawDuration = dataD.drawtime;
                d.drawLineWidth = dataD.thickness;
                d.drawType = dataD.type;
            }

            d.isRealTimeDraw = d.drawDuration > 0;

            return d;
        }

    };

    window.Utils = Utils;

})(window, document, undefined);
