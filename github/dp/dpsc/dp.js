/**
 * dp
 *
 * Version 0.0.2
 *
 * Created by shanglt on 2018/05/21.
 */
!(function (window) {

    window.TRIGGERED_ANIMATION_STEP = -1;
    window.ANIMATIONSTEPSCOUNT = -1;

    var Dp = function () {

        if (window.isSupportCanvas) {
            // 当前翻页信息
            this.pc = new PC();

            this.db = new DrawingBoard();

            this.pc.db = this.db;
            this.db.pc = this.pc;

            this.currentAnimationData = {
                totalSteps: -1,
                currentStepIndex: -1,
                currentSlideIndex: -1,
                hasNextAnimationStep: false
            };
        } else {
            this.f = new F();
        }

        this.pageChange = function (v) {
            var dp = this;

            if (window.isSupportCanvas) {
                dp.currentAnimationData = {
                    totalSteps: -1,
                    currentStepIndex: -1,
                    currentSlideIndex: -1,
                    hasNextAnimationStep: false
                };

                window.TRIGGERED_ANIMATION_STEP = -1;
                window.ANIMATIONSTEPSCOUNT = -1;

                dp.pc.pageChange(v);

                window.scrollTo(0, 0);

                Utils.pmToParent({
                    action: 'resize_from_dp',
                    width: document.getElementById('drawingBoard').style.width,
                    height: document.getElementById('drawingBoard').style.height
                });
            } else {
                dp.f.pageChange(v);
            }
        };

        this.animation = function (v) {
            var dp = this;
            if (window.isSupportCanvas) {
                dp.pc.animation(v);
            } else {
                dp.f.animation(v);
            }
        };

        this.animationCallback = function (data) {
            data.action = 'animation_change_from_dp';

            Utils.pmToParent(data);

            dp.currentAnimationData = {
                totalSteps: data.totalSteps,
                currentStepIndex: data.currentStepIndex,
                currentSlideIndex: data.currentSlideIndex,
                hasNextAnimationStep: data.hasNextAnimationStep
            };

            window.TRIGGERED_ANIMATION_STEP = dp.currentAnimationData.currentStepIndex;
            window.ANIMATIONSTEPSCOUNT = dp.currentAnimationData.totalSteps;

            dp.pc.animationCallback(data);
        };

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.resize = function () {
            if (window.isSupportCanvas) {
                if (this.width == window.innerWidth && this.height == window.innerHeight) {
                    return;
                }

                this.width = window.innerWidth;
                this.height = window.innerHeight;

                dp.pc.resize();
            } else {
                this.f.resize();
            }
        };

        this.draw = function (data) {
            if (window.isSupportCanvas) {
                this.db.draw(data);
            } else {
                this.f.draw(data);
            }
        };

        this.cacheAndDraw = function (data) {
            if (window.isSupportCanvas) {
                this.db.cacheAndDraw(data);
            } else {
                this.f.cacheAndDraw(data);
            }
        };

        this.cacheHistoryDraws = function (data) {
            if (window.isSupportCanvas) {
                this.db.cacheHistoryDraws(data);
            } else {
                this.f.cacheHistoryDraws(data);
            }
        };

        this.clear = function () {
            if (window.isSupportCanvas) {
                this.pc.clear();
                this.db.clear();
            } else {
                this.f.clear();
            }
        };
    };

    // 实例化画板对象
    window.dp = new Dp();

    /**
     * 仅触发画笔操作，不进行缓存
     * */
    window.draw = function (data) {
        dp.draw(Utils.refactorDrawData(data));
    };

    /**
     * 缓存并触发画笔操作
     * */
    window.cacheAndDraw = function (data) {
        dp.cacheAndDraw(Utils.refactorDrawData(data));
    };

    /**
     * 根据元数据重置文档
     * meta = {
     *      pageChange: [],
     *      animation: [],
     *      draw: []
     *  }
     * */
    window.resetWithMeta = function (meta) {
        meta = Utils.toJson(meta);

        var pageChanges = meta.pageChange;
        var animations = meta.animation;
        var draws = meta.draw;

        if (pageChanges.length) {
            var lastPageChange = pageChanges.pop();

            if (lastPageChange) {
                dp.pageChange(Utils.refactorPageChangeData(lastPageChange));

                // TODO 数据整理
                if (animations.length) {
                    var latestAnimationChange = animations.pop();
                    latestAnimationChange = Utils.toJson(latestAnimationChange);
                    lastPageChange = Utils.toJson(lastPageChange);

                    if (lastPageChange.docid == latestAnimationChange.docid
                        && lastPageChange.pageNum == latestAnimationChange.pageNum
                        && lastPageChange.time <= latestAnimationChange.time) {
                        dp.animation(Utils.refactorAnimationChangeData(latestAnimationChange));
                    }
                }
            }
        }

        if (draws.length) {
            // var ndraws = [];
            // for (var i = 0; i < draws.length; i++) {
            //     ndraws.push(Utils.refactorDrawData(draws[i]));
            // }
            // window.cacheHistoryDraws(draws);

            var hdds = [];
            for (var i = 0; i < draws.length; i++) {
                hdds.push(Utils.refactorDrawData(draws[i]));
            }
            dp.cacheHistoryDraws(hdds);
        }
    };

    /**
     * 缓存画笔数据
     * */
    window.cacheHistoryDraws = function (data) {
        var hdds = [];
        for (var i = 0; i < data.length; i++) {
            hdds.push(Utils.refactorDrawData(data[i]));
        }
        dp.cacheHistoryDraws(hdds);
    };

    /**
     * 翻页
     * */
    window.pageChange = function (data) {
        dp.pageChange(Utils.refactorPageChangeData(data));
    };

    /**
     * 触发动画
     * */
    window.animationChange = function (data) {
        dp.animation(Utils.refactorAnimationChangeData(data));
    };

    /**
     * 清空所有数据，包括缓存数据
     * */
    window.clear = function () {
        dp.clear();
    };

    /**
     * 重置文档大小
     * */
    window.resize = function () {
        dp.resize();

        Utils.pmToParent({
            action: 'resize_from_dp',
            width: window.outerWidth,
            height: window.outerHeight
        });
    };

    window.animationChangedCallback = function (data) {
        dp.animationCallback(data);
    };

    window.dpMessage = function (event) {
        var data = Utils.toJson(event.data);

        var action = data.action;
        if (action === 'page_change_from_dpc') {
            window.pageChange(data.value);
        } else if (action === 'animation_change_from_dpc') {
            window.animationChange(data.value);
        } else if (action === 'draw_from_dpc') {
            window.cacheAndDraw(data.value);
        } else if (action === 'animation_change') {
            window.animationChangedCallback(data);
        } else if (action === 'reset_with_meta_from_dpc') {
            window.resetWithMeta(data.value);
        } else if (action === 'clear_from_dpc') {
            window.clear();
        } else if (action === 'resize_from_dpc') {
            window.resize();
        }
    };

    if (window.attachEvent) {
        // window.attachEvent("onresize", window.resize, false);
        window.attachEvent('onmessage', window.dpMessage, false);
    } else {
        // window.addEventListener("resize", window.resize, false);
        window.addEventListener('message', window.dpMessage, false);

        // window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function () {
        //     setTimeout(function () {
        //         window.resize();
        //     });
        // }, false);
    }


    setInterval(function () {
        if (!window.dp) {
            return;
        }

        if (window.isSupportCanvas) {
            if (dp.width == window.innerWidth &&
                dp.height == window.innerHeight) {
                return;
            }

            window.resize();
        }

    }, 1000);


    window.dpDblClick = function () {
        Utils.pmToParent({
            action: 'dpdblclick_from_dp'
        });
    };

})(window, undefined);
