/**
 * Created by shanglt on 2017/6/27.
 */
/**
 * Jquery + Mobile + Canvas
 *
 * Version 2.0.0
 *
 * Created by shanglt on 2017/6/25.
 */
!(function ($, window, document) {

    var Utils = {
        // 如果参数为string，转换为json
        toJson: function (j) {
            if (typeof j === 'string') {
                j = JSON.parse(j);
            }
            return j;
        }
    };

    var Callback = function (options, meta) {
        this.playerId = options.playerId;

        this.getPlayer = function () {
            return document.getElementById(this.playerId);
        };

        if (!this.getPlayer()) {
            throw new Error(options.playerId + ' is not exist');
        }

        meta = meta || {};

        var pageChanges = meta.pageChange || [];
        pageChanges.sort(function (p1, p2) {
            return parseInt(p1.time) - parseInt(p2.time);
        });

        var draws = meta.draw || [];

        var animations = meta.animation || [];
        animations.sort(function (p1, p2) {
            return parseInt(p1.time) - parseInt(p2.time);
        });


        this.pageChanges = pageChanges;
        this.draws = draws;
        this.animations = animations;


        this.isSeeking = false;
        this.isTimeUpdate = false;

        this.pageChangeIndex = -1;
        this.drawIndex = -1;
        this.animationIndex = -1;

        this.maxPageChangeIndex = this.pageChanges.length - 1;
        this.maxDrawIndex = this.draws.length - 1;
        this.maxAnimationIndex = this.animations.length - 1;

        this.getHistory = function (time) {
            this.pageChangeIndex = -1;
            this.drawIndex = -1;
            this.animationIndex = -1;

            return {
                draw: this.getNextDraws(time),
                pageChange: this.getNextPageChanges(time),
                animation: this.getNextAnimations(time)
            };
        };

        this.getNextPageChanges = function (time) {
            var pcs = [];

            if (time < 0) {
                return pcs;
            }

            if (this.pageChangeIndex > this.maxPageChangeIndex) {
                return pcs;
            }

            var pc = this.pageChanges[this.pageChangeIndex + 1];
            if (!pc) {
                return pcs;
            }
            while (pc.time <= time) {
                pcs.push(pc);
                this.pageChangeIndex = this.pageChangeIndex + 1;
                pc = this.pageChanges[this.pageChangeIndex + 1];
                if (!pc) {
                    break;
                }
            }

            return pcs;
        };

        this.getNextDraws = function (time) {
            var ds = [];

            if (time < 0) {
                return ds;
            }

            if (this.drawIndex > this.maxDrawIndex) {
                return ds;
            }

            var d = this.draws[this.drawIndex + 1];
            if (!d) {
                return ds;
            }
            while (d.time <= time) {
                ds.push(d);
                this.drawIndex = this.drawIndex + 1;
                d = this.draws[this.drawIndex + 1];
                if (!d) {
                    break;
                }
            }

            return ds;
        };

        this.getNextAnimations = function (time) {
            var as = [];

            if (time < 0) {
                return as;
            }

            if (this.animationIndex > this.maxAnimationIndex) {
                return as;
            }

            var a = this.animations[this.animationIndex + 1];
            if (!a) {
                return as;
            }

            while (a.time <= time) {
                as.push(a);
                this.animationIndex = this.animationIndex + 1;
                a = this.animations[this.animationIndex + 1];

                if (!a) {
                    break;
                }
            }

            return as;
        };

        this.getCurrentTime = function () {
            var currentTime = this.getPlayer().currentTime;

            currentTime = parseInt(currentTime, 10);
            if (currentTime < 0 || isNaN(currentTime)) {
                return -1;
            }
            return currentTime;
        };

        $(this.getPlayer()).bind('timeupdate', function () {
            if (callback.isSeeking) {
                return;
            }

            if (callback.isTimeUpdate) {
                return;
            }

            var currentTime = callback.getCurrentTime();
            if (currentTime < 0) {
                return;
            }

            callback.isTimeUpdate = true;

            var nextDraws = callback.getNextDraws(currentTime);
            $.each(nextDraws, function (index, draw) {
                $.DrawingBoard.db({
                    'action': 'draw',
                    'value': {
                        data: Utils.toJson(draw.data)
                    }
                });
            });

            var nextPageChanges = callback.getNextPageChanges(currentTime);
            $.each(nextPageChanges, function (index, pageChange) {
                $.DrawingBoard.db({
                    'action': 'page_change',
                    'value': {
                        'docid': pageChange.encryptDocId,
                        'fileName': pageChange.docName,
                        'totalPage': pageChange.docTotalPage,
                        'url': pageChange.url,
                        'page': pageChange.pageNum,
                        'useSDK': pageChange.useSDK,
                        'width': pageChange.width,
                        'height': pageChange.height
                    }
                });
            });

            var nextAnimations = callback.getNextAnimations(currentTime);
            $.each(nextAnimations, function (index, animation) {
                $.DrawingBoard.db({
                    'action': 'animation_change',
                    'value': {
                        docid: animation.docId,
                        page: animation.pageNum,
                        step: animation.step
                    }
                });
            });

            callback.isTimeUpdate = false;
        });

        $(this.getPlayer()).bind('seeking', function () {
            $.DrawingBoard.clearTimer();
            callback.isSeeking = true;
        });

        $(this.getPlayer()).bind('ended', function () {
            $.DrawingBoard.clearTimer();
        });

        $(this.getPlayer()).bind('seeked', function () {
            $.DrawingBoard.clearAll();

            var currentTime = callback.getCurrentTime();

            if (currentTime >= 0) {
                var h = callback.getHistory(currentTime);
                $.DrawingBoard.history(h);
            }

            callback.isSeeking = false;
            callback.isTimeUpdate = false;

            $.DrawingBoard.setupInterval();
        });
    };

    var callback = {};

    var options = {
        playerId: 'live_video'
    };

    function init(opts, meta) {
        options = $.extend(options, opts);
        callback = new Callback(options, meta);

        window.callback = callback;
    }

    $.extend({
        Callback: {
            // 初始化DW对象
            config: function (opts, meta) {
                $.DrawingBoard.config();

                init(opts, meta);
            }
        }
    });
})(jQuery, window, document, undefined);