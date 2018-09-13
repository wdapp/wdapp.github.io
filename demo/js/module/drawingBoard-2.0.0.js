/**
 * Jquery + Mobile + Canvas
 *
 * Version 2.0.1
 *
 * Created by shanglt on 2017/6/25.
 */
!(function ($, window, document) {

    var Utils = {

        // 获取16进制RGB颜色
        getHexRGB: function (o) {
            var h = parseInt(o, 10).toString(16).toUpperCase();
            var hl = h.length;
            for (var i = 0; i < 6 - hl; i++) {
                h = '0' + h;
            }
            return '#' + h;
        },

        // 如果参数为string，转换为json
        toJson: function (j) {
            if (typeof j === 'string') {
                j = JSON.parse(j);
            }
            return j;
        },

        // 判断翻页是白板
        isWhiteBorad: function (j) {
            return j.url === '#' && j.fileName === 'WhiteBorad';
        },

        // 当前翻页是否支持动画
        isSupportAnimation: function (j) {
            return !!j.useSDK;
        },

        // 是否支持Canvas
        isSupportCanvas: function () {
            try {
                return !!document.createElement('canvas').getContext;
            } catch (e) {
                return false;
            }
        },

        getKey: function (data) {
            return data.docid + '_' + data.page;
        },

        getDrawId: function (data) {
            return data.drawid;
        },

        getPageChangeURI: function (data) {
            var u = data.url;
            var isHttps = window.location.protocol === 'https:';
            if (isHttps) {
                u = u.replace(/http:/g, 'https:');
            }

            if (data.useSDK) {
                return u.replace('.jpg', '/index.html');
            } else {
                return u;
            }
        }
    };

    var Caches = function () {

        // 翻页缓存数据
        this.pcs = {};

        // 画笔缓存数据
        this.draws = {};

        // 动画缓存数据
        this.animations = {};

        // 清除缓存中的所有动画
        this.clearAnimations = function () {
            var c = this;
            c.animations = {};
        };

        // 画笔是否要更新高度
        this.isNeedUpdateHeight = function (data) {
            return !(data.width > 0 && data.height > 0);
        };

        // 缓存翻页数据
        this.pushPageChange = function (data) {
            var c = this;
            var key = Utils.getKey(data);

            if (!!c.pcs[key]) {
                return;
            }

            c.pcs[key] = {
                key: key,
                original: data, // 原始数据
                isWhiteBorad: Utils.isWhiteBorad(data),
                url: Utils.getPageChangeURI(data),
                isSupportAnimation: data.useSDK,
                width: data.width,
                height: data.height,

                getDraws: function () {
                    return c.draws[this.key] || [];
                },

                clearAllDraws: function () {
                    c.draws[this.key] = [];
                },

                clearPrevDraw: function () {
                    var ds = c.draws[this.key] || [];
                    if (ds.length > 0) {
                        ds.pop();
                    }
                },

                getAnimations: function () {
                    return c.animations[this.key] || [];
                },

                isNeedResize: function () {
                    return !(this.width > 0 && this.height > 0);
                },

                resize: function (width, height) {
                    this.width = width;
                    this.height = height;
                }
            };
        };

        // 缓存画笔数据
        this.pushDraw = function (data) {
            var c = this;
            var key = Utils.getKey(data);

            if (!c.draws[key]) {
                c.draws[key] = [];
            }

            c.draws[key].push(data);
        };

        this.clearPrevDraw = function (key) {
            var c = this;
            var ds = c.draws[key] || [];
            if (ds.length > 0) {
                ds.pop();
            }
        };

        this.pushAnimation = function (data) {
            var c = this;
            var key = Utils.getKey(data);
            c.animations[key] = data;
        };

        // 清空所有缓存
        this.clear = function () {
            var c = this;

            c.pcs = {};
            c.draws = {};
            c.animations = {};
        };

        this.clearDrawsByKey = function (key) {
            var c = this;
            c.draws[key] = [];
        };


        this.clearByDrawId = function (key, drawId) {
            var c = this;

            if (!key || !drawId) {
                return;
            }

            c.clearPrevDraw(key);

            var ds = c.draws[key];
            if (ds && ds.length > 0) {
                console.log('before:', ds);

                c.draws[key] = $.grep(ds, function (d) {
                    if (drawId == d.drawid) {
                        console.log('delete:', d);
                    }

                    return drawId != d.drawid;
                });
            }
        };

        // 删除文档ID的所有缓存
        this.clearByDocId = function (docId) {
            var c = this;
            $.each(c.pcs, function (k, v) {
                if (k.indexOf(docId) >= 0) {
                    delete c.pcs[k];
                }
            });
            $.each(c.draws, function (k, v) {
                if (k.indexOf(docId) >= 0) {
                    delete c.draws[k];
                }
            });
            $.each(c.animations, function (k, v) {
                if (k.indexOf(docId) >= 0) {
                    delete c.animations[k];
                }
            });
        };

        /**
         * 获取缓存
         * */
        this.queryPageChange = function (key) {
            var c = this;
            return c.pcs[key];
        };

        /**
         * 获取缓存中所有的画笔数据
         * */
        this.queryDraws = function (key) {
            var c = this;
            return c.draws[key] || [];
        };

        /**
         * 获取缓存中所有的动画
         * */
        this.queryAnimation = function (key) {
            var c = this;
            return c.animations[key];
        };

        this.isFirstDraw = function (data) {
            var c = this;
            var key = Utils.getKey(data);
            var drawId = data.drawid;
            var arr = c.draws[key];
            var n = 0;
            for (var i in arr) {
                if (arr[i].drawid === drawId) {
                    n++;
                }
            }
            return n === 1;
        };
    };


    /**
     * 画板
     * */
    var DrawingBoard = function (options) {
        this.dbId = options.dbId;
        this.dbaId = options.dbaId;
        this.realTimeArr = [];
        this.preDone = true;
        this.realtimeFirst = true;

        this.getDB = function () {
            return document.getElementById(this.dbId);
        };

        this.getDBA = function () {
            return document.getElementById(this.dbaId);
        };

        if (!this.getDB()) {
            throw new Error(options.dbId + ' is not exist');
        }

        if (!this.getDBA()) {
            throw new Error(options.dbaId + ' is not exist');
        }

        this.isLoadedAnimationHTML5 = false;

        this.caches = new Caches();

        this.currentKey = '';

        this.isCurrentKey = function (data) {
            return this.currentKey === Utils.getKey(data);
        };

        /**
         * 获取当前翻页的信息
         * */
        this.getCurrentPageChange = function () {
            return this.caches.queryPageChange(this.currentKey);
        };

        /**
         * 获取当前翻页的信息
         * */
        this.getCurrentAnimation = function () {
            return this.caches.queryAnimation(this.currentKey);
        };

        /**
         * 获取当前页的画笔数据
         * */
        this.getCurrentDraws = function () {
            return this.caches.queryDraws(this.currentKey);
        };

        this.clearDrawsByKey = function (key) {
            if (!key) {
                return;
            }
            this.caches.clearDrawsByKey(key);
        };

        this.clearPrevDraw = function (key) {
            if (!key) {
                return;
            }
            this.caches.clearPrevDraw(key);
            this.caches.clearPrevDraw(key);
        };


        /**
         * 获取当前页的画笔数据
         * */
        this.getCurrentAnimation = function () {
            return this.caches.queryAnimation(this.currentKey);
        };

        /**
         * 动画页面加载成功回调
         * */
        setTimeout(function () {
            $(drawingBoard.getDBA()).on('load', function () {
                var $t = $(this);
                if (!$t.attr('src')) {
                    return;
                }

                var key = $t.attr('key');

                drawingBoard.isLoadedAnimationHTML5 = true;

                // 如果存在动画，则重新加载动画
                drawingBoard.triggerAnimation();

                if (typeof window.on_cc_live_animation_load === 'function') {
                    window.on_cc_live_animation_load();
                }
            });
        });
    };

    DrawingBoard.prototype = {

        flip: function (data) {
            var db = this;

            // 重复翻页
            if (db.isCurrentKey(data)) {
                return;
            }

            db.isLoadedAnimationHTML5 = false;

            db.caches.pushPageChange(data);
            db.currentKey = Utils.getKey(data);

            // 清除画板所有数据
            db.clearDB();
            db.clearDBA();

            // 清除所有动画
            db.caches.clearAnimations();

            var canvas = db.getDB();
            var context = canvas.getContext('2d');

            var currentPageChange = db.getCurrentPageChange();
            if (!currentPageChange) {
                return;
            }

            // 白板
            if (currentPageChange.isWhiteBorad) {
                // 当前翻页信息
                if (!currentPageChange.isNeedResize()) {
                    canvas.height = canvas.width * currentPageChange.height / currentPageChange.width;
                }

                context.globalAlpha = 1;
                context.fillStyle = '#FFFFFF';

                context.fillRect(0, 0, canvas.width, canvas.height);

                $.each(currentPageChange.getDraws(), function (index, draw) {
                    db.draw(draw);
                });
            } else {
                // 完全透明
                context.globalAlpha = 0;
                context.fillRect(0, 0, canvas.width, canvas.height);

                // 动画
                if (currentPageChange.isSupportAnimation) {
                    canvas.height = canvas.width * currentPageChange.height / currentPageChange.width;
                    var $dba = $(db.getDBA());

                    $dba.attr({
                        src: currentPageChange.url,
                        key: currentPageChange.key
                    });
                    $(db.getDBA()).css('height', canvas.height * $dba.width() / canvas.width);
                    $.each(currentPageChange.getDraws(), function (index, draw) {
                        db.draw(draw);
                    });
                } else {
                    if (!currentPageChange.isNeedResize) {
                        canvas.height = canvas.width * currentPageChange.height / currentPageChange.width;
                    }
                    db.image = new Image();
                    db.image.onload = function () {
                        var imgWidth = this.width;
                        var imgHeight = this.height;

                        currentPageChange.resize(imgWidth, imgHeight);

                        canvas.height = canvas.width * imgHeight / imgWidth;
                        context.drawImage(db.image, 0, 0, canvas.width, canvas.height);

                        $.each(currentPageChange.getDraws(), function (index, draw) {
                            db.draw(draw);
                        });
                    };

                    db.image.src = currentPageChange.url;
                }
            }

            if (typeof window.on_cc_live_db_flip === 'function') {
                window.on_cc_live_db_flip();
            }
        },

        // 重绘画笔数据
        redraw: function () {
            var db = this;
            if (!db.currentKey) {
                return;
            }

            // 清除画板
            db.clearDB();

            var currentPageChange = db.getCurrentPageChange();
            if (!currentPageChange) {
                return;
            }

            var canvas = db.getDB();
            var context = canvas.getContext('2d');

            // 白板
            if (currentPageChange.isWhiteBorad) {
                $.each(currentPageChange.getDraws(), function (index, draw) {
                    db.draw(draw);
                });
            } else {
                // 动画
                if (currentPageChange.isSupportAnimation) {
                    $.each(currentPageChange.getDraws(), function (index, draw) {
                        db.draw(draw);
                    });
                } else {
                    db.image.crossOrigin = '';
                    var imgHeight = db.image.height;
                    var imgWidth = db.image.width;

                    canvas.height = canvas.width * imgHeight / imgWidth;
                    context.drawImage(db.image, 0, 0, canvas.width, canvas.height);

                    $.each(currentPageChange.getDraws(), function (index, draw) {
                        db.draw(draw);
                    });
                }
            }
        },

        // 清除DB所有数据
        clearDB: function () {
            var db = this;
            var canvas = db.getDB();
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
        },

        // 清除DBA所有数据
        clearDBA: function () {
            var db = this;
            $(db.getDBA()).attr({
                key: '',
                src: ''
            });
        },

        clearAllCaches: function () {
            var db = this;
            db.currentKey = '';
            // db.caches.pcs = {};
            db.caches.animations = {};
            db.caches.draws = {};
        },

        // 清理文档每一页的画笔数据，清楚画笔数据
        clearDocDraws: function (data) {
            var db = this;
            db.caches.clearByDocId(data.docid);
        },

        // 清空屏幕，仅仅清除画笔数据
        clearScreen: function (data) {
            var db = this;
            // 清空画板数据
            db.clearDB();
            db.clearDrawsByKey(Utils.getKey(data));

            var currentPageChange = db.getCurrentPageChange();
            if (!currentPageChange) {
                return;
            }

            var canvas = db.getDB();
            var context = canvas.getContext('2d');

            // 白板
            if (currentPageChange.isWhiteBorad) {
                context.globalAlpha = 1;
                context.fillStyle = '#FFFFFF';

                context.fillRect(0, 0, canvas.width, canvas.height);
            } else {
                // 完全透明
                context.globalAlpha = 0;
                context.fillRect(0, 0, canvas.width, canvas.height);

                // 动画
                if (currentPageChange.isSupportAnimation) {
                    canvas.height = canvas.width * currentPageChange.height / currentPageChange.width;
                } else {
                    var image = new Image();
                    image.crossOrigin = '';
                    image.onload = function () {
                        var imgHeight = this.height;
                        var imgWidth = this.width;

                        canvas.height = canvas.width * imgHeight / imgWidth;
                        context.drawImage(image, 0, 0, canvas.width, canvas.height);
                    };

                    image.src = currentPageChange.url;
                }
            }
        },

        /**
         * 清除某一笔
         *
         * */
        clearByDrawId: function (key, drawId) {
            var db = this;
            db.caches.clearByDrawId(key, drawId);
        },

        // 清空上一步，删除上一步的画笔数据
        clearPrev: function (data) {
            var db = this;
            db.clearDB();

            var currentPageChange = db.getCurrentPageChange();
            if (!currentPageChange) {
                return;
            }

            // 注意：清除两次
            currentPageChange.clearPrevDraw();
            currentPageChange.clearPrevDraw();

            var canvas = db.getDB();
            var context = canvas.getContext('2d');

            // 白板
            if (currentPageChange.isWhiteBorad) {
                $.each(currentPageChange.getDraws(), function (index, draw) {
                    db.draw(draw);
                });
            } else {
                // 动画
                if (currentPageChange.isSupportAnimation) {
                    $.each(currentPageChange.getDraws(), function (index, draw) {
                        db.draw(draw);
                    });
                } else {
                    var image = new Image();

                    image.crossOrigin = '';
                    image.onload = function () {
                        var imgWidth = this.width;
                        var imgHeight = this.height;

                        currentPageChange.resize(imgWidth, imgHeight);

                        canvas.height = canvas.width * imgHeight / imgWidth;
                        context.drawImage(image, 0, 0, canvas.width, canvas.height);

                        $.each(currentPageChange.getDraws(), function (index, draw) {
                            db.draw(draw);
                        });
                    };

                    image.src = currentPageChange.url;
                }
            }
        },

        /**
         * 删除整个文档
         * */
        deleteDoc: function (data) {
            var db = this;
            db.clearDB();
        },

        // 绘线
        drawLine: function (data) {
            var db = this;
            var canvas = db.getDB();
            var context = canvas.getContext('2d');

            var x0 = data.draw[0].x * canvas.width;
            var y0 = data.draw[0].y * canvas.height;

            context.beginPath();

            context.strokeStyle = Utils.getHexRGB(data.color);
            context.lineWidth = data.thickness * canvas.width / data.width;
            context.lineJoin = 'round';

            // 起点
            context.moveTo(x0, y0);

            for (var i = 0; i < data.draw.length; i++) {
                var xn = data.draw[i].x * canvas.width;
                var yn = data.draw[i].y * canvas.height;

                context.lineTo(xn, yn);
            }

            context.stroke();
        },

        // 实时绘线
        drawLineRealTime: function (data) {
            var time = data.drawtime;
            var db = this;
            var canvas = db.getDB();
            var context = canvas.getContext('2d');

            db.preDone = false;

            var x0 = data.draw[0].x * canvas.width;
            var y0 = data.draw[0].y * canvas.height;

            context.beginPath();

            context.strokeStyle = Utils.getHexRGB(data.color);
            context.lineWidth = data.thickness * canvas.width / data.width;
            context.lineJoin = 'round';

            // 起点
            context.moveTo(x0, y0);

            for (var i = 0; i < data.draw.length; i++) {
                var t = time / (data.draw.length - 1);
                var xn = data.draw[i].x * canvas.width;
                var yn = data.draw[i].y * canvas.height;
                (function (i, xn, yn) {
                    window.DRAWANIMTION = setTimeout(function () {
                        context.lineTo(xn, yn);
                        context.stroke();
                        if (i === data.draw.length - 1) {
                            db.realTimeArr.shift();
                            db.preDone = true;
                            if (!db.realTimeArr.length) {
                                clearInterval(window.DRAWTIMER);
                                db.realtimeFirst = true;
                            }
                        }
                    }, i * t);
                })(i, xn, yn);

            }

        },

        // 矩形
        drawRect: function (data) {
            var db = this;
            var canvas = db.getDB();
            var context = canvas.getContext('2d');

            var x = data.draw.x * canvas.width;
            var y = data.draw.y * canvas.height;

            var w = data.draw.width * canvas.width;
            var h = data.draw.height * canvas.height;

            context.beginPath();
            context.strokeStyle = Utils.getHexRGB(data.color);
            context.lineWidth = data.thickness * canvas.width / data.width;
            context.lineJoin = 'round';

            context.strokeRect(x, y, w, h);
            context.stroke();
        },

        // 圆形
        drawArc: function (data) {
            var db = this;
            var canvas = db.getDB();
            var context = canvas.getContext('2d');

            var r = data.draw.heightRadius * canvas.height;
            var x = data.draw.x * canvas.width - r;
            var y = data.draw.y * canvas.height - r;

            context.beginPath();
            context.strokeStyle = Utils.getHexRGB(data.color);
            context.lineWidth = data.thickness * canvas.width / data.width;
            context.lineJoin = 'round';

            context.arc(x, y, r, 0, Math.PI * 2, true);

            context.stroke();
        },

        // 文字
        drawTxt: function (data) {
            var db = this;
            if (arguments[1] === 'realtime') {
                if (!db.caches.isFirstDraw(data)) {
                    var key = Utils.getKey(data);
                    db.caches.clearPrevDraw(key);
                    db.caches.clearPrevDraw(key);
                    db.redraw();
                    db.caches.pushDraw(data);
                }
            }

            var canvas = db.getDB();
            var context = canvas.getContext('2d');

            var txt = data.draw.label;
            var x = data.draw.x * canvas.width;
            var y = data.draw.y * canvas.height;

            context.font = data.draw.size * canvas.width / data.width + 'pt SimSun';
            context.fillStyle = Utils.getHexRGB(data.color);
            context.textBaseline = 'top';
            context.textAlign = 'left';

            var txts = txt.split('\n');
            $.each(txts, function (index, text) {
                var lineHeight = context.measureText('M').width * 1.5;
                context.fillText(text, x, y + lineHeight * index);
            });
        },


        drawAndCache: function (data) {
            var db = this;
            // 设置缓存
            db.caches.pushDraw(data);
            db.draw(data, 'realtime');
        },

        addDrawCache: function (data) {
            var db = this;
            db.caches.pushDraw(data);

            var key = Utils.getKey(data);

            var type = data.type;
            if (type == 0) {        // 清屏(仅仅清除画笔数据)
                db.clearDrawsByKey(key);
            } else if (type == 1) { // 清除上一步
                db.clearPrevDraw(key);
            } else if (type == 7) { // 清理文档每一页的画笔数据
                db.clearDocDraws(data);
            } else if (type == 8) { // 删除所有文档，以及所有文档的画笔数据
                db.clearAllCaches();
            } else if (type == 9) { // 清除指定ID的画笔
                db.clearByDrawId(key, Utils.getDrawId(data));
            }
        },

        // 画笔
        draw: function (data) {
            if (!data) {
                return;
            }
            var db = this;

            var type = data.type;
            if (type == 8) { // 删除所有文档，以及所有文档的画笔数据
                db.clearDB();
                db.clearDBA();
                db.clearAllCaches();
                return;
            }

            if (!db.isCurrentKey(data)) {
                return;
            }

            var currentPageChange = db.getCurrentPageChange();
            if (currentPageChange && currentPageChange.isNeedResize()) {
                var canvas = db.getDB();

                var w = data.width;
                var h = data.height;
                if (w > 0 && h > 0) {
                    currentPageChange.resize(data.width, data.height);
                    canvas.height = canvas.width * currentPageChange.height / currentPageChange.width;

                    // 白板需要重新绘制
                    if (currentPageChange.isWhiteBorad) {
                        var context = canvas.getContext('2d');

                        context.globalAlpha = 1;
                        context.fillStyle = '#FFFFFF';

                        context.fillRect(0, 0, canvas.width, canvas.height);
                    }
                }
            }

            if (type == 0) {        // 清屏(仅仅清除画笔数据)
                db.clearScreen(data);
            } else if (type == 1) { // 清除上一步
                db.clearPrev(data);
            } else if (type == 2) { // 绘线
                if (arguments[1] === 'realtime' && !!data.drawtime) {
                    db.realTimeArr.push(data);

                    if (db.realtimeFirst) {
                        db.animationDraw();
                    }

                    db.realtimeFirst = false;

                } else {
                    db.drawLine(data);
                }
            } else if (type == 3) { // 矩形
                db.drawRect(data);
            } else if (type == 4) { // 圆形
                db.drawArc(data);
            } else if (type == 5) { // 文字
                if (arguments[1] === 'realtime') {
                    db.drawTxt(data, 'realtime');
                } else {
                    db.drawTxt(data);
                }
            } else if (type == 6) { // 删除整个文档
                db.deleteDoc(data);
            } else if (type == 7) { // 清理文档每一页的画笔数据
                db.clearDocDraws(data);
            } else if (type == 9) { // 清除指定ID的画笔数据
                db.clearByDrawId(Utils.getKey(data), Utils.getDrawId(data));
                db.redraw();
            }
        },

        animationDraw: function () {
            var db = this;
            if (!db.realTimeArr.length) {
                return;
            }
            window.DRAWTIMER = setInterval(function () {
                if (db.preDone) {
                    db.drawLineRealTime(db.realTimeArr[0]);
                }
            }, 50);
        },

        triggerAnimation: function () {
            var db = this;

            if (!drawingBoard.isLoadedAnimationHTML5) {
                return;
            }

            var currentPageChange = db.getCurrentPageChange();
            if (!currentPageChange) {
                return;
            }

            if (!currentPageChange.isSupportAnimation) {
                return;
            }

            if ($(db.getDBA()).attr('key') !== db.currentKey) {
                return;
            }

            var animation = db.getCurrentAnimation();
            if (!animation) {
                return;
            }

            if (!db.getDBA().contentWindow) {
                return;
            }

            db.getDBA().contentWindow.postMessage(animation, '*');
        },

        animation: function (data) {
            if (!data) {
                return;
            }

            var db = this;

            var currentPageChange = db.getCurrentPageChange();
            if (!currentPageChange) {
                return;
            }

            if (!currentPageChange.isSupportAnimation) {
                return;
            }

            if ($(db.getDBA()).attr('key') !== Utils.getKey(data)) {
                return;
            }

            data.action = 'animation_change';
            db.caches.pushAnimation(data);

            db.triggerAnimation();
        },

        resizePresentation: function (width, height) {
            var db = this;

            var currentPageChange = db.getCurrentPageChange();
            if (!currentPageChange) {
                return;
            }

            if (!currentPageChange.isSupportAnimation) {
                return;
            }

            if (!db.getDBA().contentWindow) {
                return;
            }

            db.getDBA().contentWindow.postMessage({
                action: 'resize',
                width: width,
                height: height
            }, '*');
        }
    };

    var drawingBoard = {};

    var options = {
        dbId: 'drawPanel',
        dbaId: 'dpa'
    };

    function init(opts) {
        options = $.extend(options, opts);
        drawingBoard = new DrawingBoard(options);

        window.drawingBoard = drawingBoard;
    }

    $.extend({
        DrawingBoard: {
            // 初始化DW对象
            config: function (opts) {
                init(opts);
            },

            redraw: function () {
                drawingBoard.redraw();
            },

            /**
             * 更新幻灯片的宽度和高度
             *
             * @param width
             * @param height
             * */
            resizePresentation: function (width, height) {
                drawingBoard.resizePresentation(width, height);
            },

            /**
             * 获取直播画板历史元数据
             *
             * @param meta
             * */
            history: function (meta) {
                var draw = meta.draw || [];
                for (var i = 0; i < draw.length; i++) {
                    var drawData = Utils.toJson(draw[i].data);
                    if (i >= 1 && !!drawData.drawid) {
                        var same = drawData.drawid === Utils.toJson(draw[i - 1].data).drawid;
                        if (drawData.type === 5 && same) {
                            var key = Utils.getKey(drawData);
                            drawingBoard.caches.clearPrevDraw(key);
                        }
                    }
                    drawingBoard.addDrawCache(drawData);
                }

                var pageChange = meta.pageChange || [];
                pageChange.sort(function (p1, p2) {
                    return parseInt(p1.time) - parseInt(p2.time);
                });

                var currentpctime = 0;
                var pc = pageChange.pop();
                if (pc) {
                    currentpctime = pc.time;
                    drawingBoard.flip({
                        'docid': pc.docId,
                        'fileName': pc.docName,
                        'height': pc.height,
                        'page': pc.pageNum,
                        'totalPage': pc.docTotalPage,
                        'url': pc.url,
                        'useSDK': pc.useSDK,
                        'width': pc.width
                    });
                }

                var animation = meta.animation || [];
                animation.sort(function (p1, p2) {
                    return parseInt(p1.time) - parseInt(p2.time);
                });

                var an = animation.pop();
                if (an && an.time >= currentpctime) {
                    drawingBoard.animation({
                        docid: an.docId,
                        page: an.pageNum,
                        step: an.step
                    });
                }
            },

            db: function (data) {
                data = Utils.toJson(data);

                var action = data.action;
                if (action === 'page_change') {
                    drawingBoard.flip(data.value);
                } else if (action === 'draw') {
                    drawingBoard.drawAndCache(data.value.data);
                } else if (action === 'animation_change') {
                    drawingBoard.animation(data.value);
                }
            },

            clearAll: function () {
                drawingBoard.clearAllCaches();
                drawingBoard.clearDB();
                drawingBoard.clearDBA();
            },

            clear: function () {
                drawingBoard.clearDB();
                drawingBoard.clearDBA();
            },

            setupInterval: function () {
                drawingBoard.animationDraw();
            },

            clearTimer: function () {
                clearTimeout(window.DRAWANIMTION);
                drawingBoard.preDone = true;
                drawingBoard.realTimeArr = [];
                drawingBoard.realtimeFirst = true;
                clearInterval(window.DRAWTIMER);
            }
        }
    });
})(jQuery, window, document, undefined);