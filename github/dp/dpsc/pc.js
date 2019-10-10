/**
 * dp
 *
 * Version 0.0.4
 *
 * Created by shanglt on 2018/05/21.
 */
!(function (window, document) {

    /**
     * ispring 的HTML页面宽度和高度如果超过了原始的宽度和高度，布局上会存在问题，
     * 通过代码：
     * */
    var PC = function () {

        var ifr = document.getElementById('ifr');

        var img = document.getElementById('picture');

        var wb = document.getElementById('whiteBoard');
        var wbContext = wb.getContext('2d');

        this.ifr = ifr;
        this.img = img;
        this.wb = wb;
        this.wbContext = wbContext;

        this.displayMode = new DisplayMode();
        // this.db = new DrawingBoard();

        // 当前翻页数据，默认没有翻页数据
        this.current = {
            docId: 'nodoc',
            docName: '暂无文档',
            docTotalPage: 0,
            width: '200',
            height: '200',
            pageTitle: '暂无文档',
            pageNum: 0,
            url: '',
            mode: 0,
            time: 0
        };

        (function (p) {
            // p.img.onload = function () {
            //     this.style.visibility = '';
            // };

            p.ifr.onload = function () {
                // console.log('dp iframe is onload ' + this.src);

                if (!this.src) {
                    return;
                }

                var width = this.style.width.replace('px', '');
                var height = this.style.height.replace('px', '');

                setTimeout(function () {
                    Utils.pmToIfr({
                        action: 'resize',
                        width: width,
                        height: height
                    });
                }, 50);

            };
        })(this);
    };

    PC.prototype.showDefaultPageChange = function () {
        // 画板展示的宽和高
        var dpDisplayedWidth = window.innerWidth;
        var dpDisplayedHeight = window.innerHeight;

        var pc = this;
        pc.ifr.style.display = 'none';
        pc.wb.style.display = 'none';

        var img = pc.img;
        img.style.display = 'block';
        img.style.marginLeft = '';
        img.style.marginTop = '';

        // 默认部署宽高与实际宽高一致
        var displayedWidth = 100;
        var displayedHeight = 120;

        img.style.marginLeft = ((dpDisplayedWidth - displayedWidth) / 2) + 'px';
        img.style.marginTop = ((dpDisplayedHeight - displayedHeight) / 2) + 'px';

        img.style.width = displayedWidth + 'px';
        img.style.height = displayedHeight + 'px';

        img.src = 'http://image.csslcloud.net/dp/d.png';
    };

    PC.prototype.animationCallback = function (data) {
        // console.log('dp.js animationCallback data', data);

        var currentPageChange = this.current;

        if (currentPageChange.isAnimationFastestMode) {
            if (currentPageChange.pageNum == data.currentSlideIndex && data.currentStepIndex == 0) {
                this.current.isReadyTriggerAnimation = true;
                this.ifr.style.visibility = '';
            }
        } else if (currentPageChange.isAnimationSlowMode) {
            this.ifr.style.visibility = '';
            this.current.isReadyTriggerAnimation = true;
        }

        this.current.triggerAnimationStep = data.currentStepIndex;
    };

    /**
     * 触发动画
     *
     * */
    PC.prototype.animation = function (a) {
        // console.log('dp.js animation', a);

        if (this.current.isReadyTriggerAnimation) {
            Utils.pmToIfr({
                action: 'animation_change',
                step: a.step
            });
        } else {
            (function (p, a) {
                setTimeout(function () {
                    p.animation(a);
                }, 300);
            })(this, a);
        }
    };

    /**
     * resize
     *
     * */
    PC.prototype.resize = function () {
        var d = this.current;

        if (this.current.isAnimation) {
            var dpDisplayedWidth = window.innerWidth;
            var dpDisplayedHeight = window.innerHeight;

            // 文档实际的宽和高
            var practicalWidth = d.width;
            var practicalHeight = d.height;

            // 垂直方向优先
            var isVerticalDisplayedPriority = (dpDisplayedWidth / dpDisplayedHeight) > (practicalWidth / practicalHeight);

            var pc = this;
            pc.img.style.display = 'none';
            pc.wb.style.display = 'none';

            var ifr = pc.ifr;
            ifr.style.display = 'block';
            ifr.style.marginTop = '';
            ifr.style.marginLeft = '';

            // 默认部署宽高与实际宽高一致
            var displayedWidth = practicalWidth;
            var displayedHeight = practicalHeight;
            var displayedMarginTop = 0;
            var displayedMarginLeft = 0;

            if (pc.displayMode.isSuitableForWidth) {
                displayedWidth = dpDisplayedWidth;
                displayedHeight = dpDisplayedWidth * practicalHeight / practicalWidth;

                if (pc.displayMode.isVerticalCenter && displayedHeight < dpDisplayedHeight) {
                    displayedMarginTop = (dpDisplayedHeight - displayedHeight) / 2;
                }
            } else if (pc.displayMode.isSuitableForWindow) {
                if (isVerticalDisplayedPriority) {
                    displayedHeight = dpDisplayedHeight;
                    displayedWidth = dpDisplayedHeight * practicalWidth / practicalHeight;

                    displayedMarginLeft = (dpDisplayedWidth - displayedWidth) / 2;
                } else {
                    displayedWidth = dpDisplayedWidth;
                    displayedHeight = dpDisplayedWidth * practicalHeight / practicalWidth;

                    displayedMarginTop = (dpDisplayedHeight - displayedHeight) / 2;
                }
            }

            ifr.style.width = displayedWidth + 'px';
            ifr.style.height = displayedHeight + 'px';
            if (displayedMarginTop > 0) {
                ifr.style.marginTop = displayedMarginTop + 'px';
            }
            if (displayedMarginLeft > 0) {
                ifr.style.marginLeft = displayedMarginLeft + 'px';
            }

            pc.db.reset(ifr);

            setTimeout(function () {
                Utils.pmToIfr({
                    action: 'resize',
                    width: ifr.style.width.replace('px', ''),
                    height: ifr.style.height.replace('px', '')
                });
            }, 30);
        } else if (this.current.isJpg) {

            // 画板展示的宽和高
            var dpDisplayedWidth = window.innerWidth;
            var dpDisplayedHeight = window.innerHeight;

            // 文档实际的宽和高
            var practicalWidth = d.width;
            var practicalHeight = d.height;

            // 垂直方向优先
            var isVerticalDisplayedPriority = (dpDisplayedWidth / dpDisplayedHeight) > (practicalWidth / practicalHeight);

            var pc = this;
            pc.ifr.style.display = 'none';
            pc.wb.style.display = 'none';

            var img = pc.img;

            img.style.display = 'block';
            img.style.marginLeft = '';
            img.style.marginTop = '';

            // 默认部署宽高与实际宽高一致
            var displayedWidth = practicalWidth;
            var displayedHeight = practicalHeight;

            if (pc.displayMode.isSuitableForWidth) {
                displayedWidth = dpDisplayedWidth;
                displayedHeight = dpDisplayedWidth * practicalHeight / practicalWidth;

                if (pc.displayMode.isVerticalCenter && displayedHeight < dpDisplayedHeight) {
                    img.style.marginTop = ((dpDisplayedHeight - displayedHeight) / 2) + 'px';
                }
            } else if (pc.displayMode.isSuitableForWindow) {
                if (isVerticalDisplayedPriority) {
                    displayedHeight = dpDisplayedHeight;
                    displayedWidth = dpDisplayedHeight * practicalWidth / practicalHeight;

                    img.style.marginLeft = ((dpDisplayedWidth - displayedWidth) / 2) + 'px';
                } else {
                    displayedWidth = dpDisplayedWidth;
                    displayedHeight = dpDisplayedWidth * practicalHeight / practicalWidth;

                    img.style.marginTop = ((dpDisplayedHeight - displayedHeight) / 2) + 'px';
                }
            }

            img.style.width = displayedWidth + 'px';
            img.style.height = displayedHeight + 'px';

            this.db.reset(img);
        } else if (this.current.isWhiteBorad) {
            // 画板展示的宽和高
            var dpDisplayedWidth = window.innerWidth;
            var dpDisplayedHeight = window.innerHeight;

            // 文档实际的宽和高
            var practicalWidth = d.width;
            var practicalHeight = d.height;

            // 垂直方向优先
            var isVerticalDisplayedPriority = (dpDisplayedWidth / dpDisplayedHeight) > (practicalWidth / practicalHeight);

            var pc = this;
            pc.ifr.style.display = 'none';
            pc.img.style.display = 'none';

            var wb = pc.wb;
            wb.style.display = 'block';
            wb.style.marginLeft = '';
            wb.style.marginTop = '';

            // 默认部署宽高与实际宽高一致
            var displayedWidth = practicalWidth;
            var displayedHeight = practicalHeight;
            if (pc.displayMode.isSuitableForWidth) {
                displayedWidth = dpDisplayedWidth;
                displayedHeight = dpDisplayedWidth * practicalHeight / practicalWidth;

                if (pc.displayMode.isVerticalCenter && displayedHeight < dpDisplayedHeight) {
                    wb.style.marginTop = ((dpDisplayedHeight - displayedHeight) / 2) + 'px';
                }
            } else if (pc.displayMode.isSuitableForWindow) {
                if (isVerticalDisplayedPriority) {
                    displayedHeight = dpDisplayedHeight;
                    displayedWidth = dpDisplayedHeight * practicalWidth / practicalHeight;

                    wb.style.marginLeft = ((dpDisplayedWidth - displayedWidth) / 2) + 'px';
                } else {
                    displayedWidth = dpDisplayedWidth;
                    displayedHeight = dpDisplayedWidth * practicalHeight / practicalWidth;

                    wb.style.marginTop = ((dpDisplayedHeight - displayedHeight) / 2) + 'px';
                }
            }

            wb.style.width = displayedWidth + 'px';
            wb.style.height = displayedHeight + 'px';

            wb.width = displayedWidth * 2;
            wb.height = displayedHeight * 2;

            pc.wbContext.globalAlpha = 1;
            pc.wbContext.fillStyle = "#FFF";
            pc.wbContext.fillRect(0, 0, wb.width, wb.height);

            pc.db.reset(wb);
        }


        dp.db.resetDrawCurrentPage();
    };


    /**
     * 显示白板
     * */
    PC.prototype.showWhiteBorad = function (d) {
        // 画板展示的宽和高
        var dpDisplayedWidth = window.innerWidth;
        var dpDisplayedHeight = window.innerHeight;

        // 文档实际的宽和高
        var practicalWidth = d.width;
        var practicalHeight = d.height;

        // 垂直方向优先
        var isVerticalDisplayedPriority = (dpDisplayedWidth / dpDisplayedHeight) > (practicalWidth / practicalHeight);

        var pc = this;
        pc.ifr.style.display = 'none';
        pc.img.style.display = 'none';

        var wb = pc.wb;
        wb.style.display = 'block';
        wb.style.marginLeft = '';
        wb.style.marginTop = '';

        // 默认部署宽高与实际宽高一致
        var displayedWidth = practicalWidth;
        var displayedHeight = practicalHeight;
        if (pc.displayMode.isSuitableForWidth) {
            displayedWidth = dpDisplayedWidth;
            displayedHeight = dpDisplayedWidth * practicalHeight / practicalWidth;

            if (pc.displayMode.isVerticalCenter && displayedHeight < dpDisplayedHeight) {
                wb.style.marginTop = ((dpDisplayedHeight - displayedHeight) / 2) + 'px';
            }
        } else if (pc.displayMode.isSuitableForWindow) {
            if (isVerticalDisplayedPriority) {
                displayedHeight = dpDisplayedHeight;
                displayedWidth = dpDisplayedHeight * practicalWidth / practicalHeight;

                wb.style.marginLeft = ((dpDisplayedWidth - displayedWidth) / 2) + 'px';
            } else {
                displayedWidth = dpDisplayedWidth;
                displayedHeight = dpDisplayedWidth * practicalHeight / practicalWidth;

                wb.style.marginTop = ((dpDisplayedHeight - displayedHeight) / 2) + 'px';
            }
        }

        wb.style.width = displayedWidth + 'px';
        wb.style.height = displayedHeight + 'px';

        wb.width = displayedWidth * 2;
        wb.height = displayedHeight * 2;

        pc.wbContext.globalAlpha = 1;
        pc.wbContext.fillStyle = "#FFF";
        pc.wbContext.fillRect(0, 0, wb.width, wb.height);

        pc.db.reset(wb);
    };


    PC.prototype.showJPG = function (d) {
        // 画板展示的宽和高
        var dpDisplayedWidth = window.innerWidth;
        var dpDisplayedHeight = window.innerHeight;

        if (d.width <= 0 || d.height <= 0) {
            (function (pageChange, t) {
                var img = new Image;
                img.src = pageChange.url;
                img.onload = function () {
                    pageChange.width = this.width;
                    pageChange.height = this.height;

                    if (pageChange.key == t.current.key) {
                        t.showJPG(pageChange);
                        t.db.resetDrawCurrentPage();
                    }
                };
            })(d, this);
            return;
        }

        // 文档实际的宽和高
        var practicalWidth = d.width;
        var practicalHeight = d.height;

        // 垂直方向优先
        var isVerticalDisplayedPriority = (dpDisplayedWidth / dpDisplayedHeight) > (practicalWidth / practicalHeight);

        var pc = this;
        pc.ifr.style.display = 'none';
        pc.wb.style.display = 'none';

        var img = pc.img;

        // img.style.visibility = 'hidden';

        // https://blog.csdn.net/xiaozaq/article/details/50536671
        img.style.display = 'block';
        img.style.marginLeft = '';
        img.style.marginTop = '';

        // 默认部署宽高与实际宽高一致
        var displayedWidth = practicalWidth;
        var displayedHeight = practicalHeight;

        if (pc.displayMode.isSuitableForWidth) {
            displayedWidth = dpDisplayedWidth;
            displayedHeight = dpDisplayedWidth * practicalHeight / practicalWidth;

            if (pc.displayMode.isVerticalCenter && displayedHeight < dpDisplayedHeight) {
                img.style.marginTop = ((dpDisplayedHeight - displayedHeight) / 2) + 'px';
            }
        } else if (pc.displayMode.isSuitableForWindow) {
            if (isVerticalDisplayedPriority) {
                displayedHeight = dpDisplayedHeight;
                displayedWidth = dpDisplayedHeight * practicalWidth / practicalHeight;

                img.style.marginLeft = ((dpDisplayedWidth - displayedWidth) / 2) + 'px';
            } else {
                displayedWidth = dpDisplayedWidth;
                displayedHeight = dpDisplayedWidth * practicalHeight / practicalWidth;

                img.style.marginTop = ((dpDisplayedHeight - displayedHeight) / 2) + 'px';
            }
        }

        img.style.width = displayedWidth + 'px';
        img.style.height = displayedHeight + 'px';

        img.src = pc.current.completeURI;

        this.db.reset(img);
    };


    PC.prototype.showAnimation = function (d) {
        // 画板展示的宽和高
        var dpDisplayedWidth = window.innerWidth;
        var dpDisplayedHeight = window.innerHeight;

        // 文档实际的宽和高
        var practicalWidth = d.width;
        var practicalHeight = d.height;

        // 垂直方向优先
        var isVerticalDisplayedPriority = (dpDisplayedWidth / dpDisplayedHeight) > (practicalWidth / practicalHeight);

        var pc = this;
        pc.img.style.display = 'none';
        pc.wb.style.display = 'none';

        var ifr = pc.ifr;
        ifr.style.display = 'block';

        if (d.isAnimationFastestMode) {

            ifr.style.visibility = 'hidden';
        }

        ifr.style.marginTop = '';
        ifr.style.marginLeft = '';

        // 默认部署宽高与实际宽高一致
        var displayedWidth = practicalWidth;
        var displayedHeight = practicalHeight;
        var displayedMarginTop = 0;
        var displayedMarginLeft = 0;

        if (pc.displayMode.isSuitableForWidth) {
            displayedWidth = dpDisplayedWidth;
            displayedHeight = dpDisplayedWidth * practicalHeight / practicalWidth;

            if (pc.displayMode.isVerticalCenter && displayedHeight < dpDisplayedHeight) {
                displayedMarginTop = ((dpDisplayedHeight - displayedHeight) / 2) + 'px';
            }
        } else if (pc.displayMode.isSuitableForWindow) {
            if (isVerticalDisplayedPriority) {
                displayedHeight = dpDisplayedHeight;
                displayedWidth = dpDisplayedHeight * practicalWidth / practicalHeight;
                displayedMarginLeft = (dpDisplayedWidth - displayedWidth) / 2;
            } else {
                displayedWidth = dpDisplayedWidth;
                displayedHeight = dpDisplayedWidth * practicalHeight / practicalWidth;
                displayedMarginTop = (dpDisplayedHeight - displayedHeight) / 2;
            }
        }

        ifr.style.width = displayedWidth + 'px';
        ifr.style.height = displayedHeight + 'px';
        if (displayedMarginTop > 0) {
            ifr.style.marginTop = displayedMarginTop + 'px';
        }
        if (displayedMarginLeft > 0) {
            ifr.style.marginLeft = displayedMarginLeft + 'px';
        }

        pc.db.reset(ifr);

        var u = pc.current.completeURI;

        var us = u.split('?');
        var ifs = ifr.src.split('?');
        if (u && d.mode == 2 && ifs[0] === us[0]) {
            Utils.pmToIfr({
                action: 'page_change',
                pagenum: d.pageNum
            });
            ifr.style.visibility = '';
        } else if (u && d.mode == 1 && u == ifr.src) {
            Utils.pmToIfr({
                action: 'animation_change',
                step: 0
            });
        } else {
            ifr.setAttribute('src', u);
        }
    };


    PC.prototype.pageChange = function (d) {
        this.current = d;
        this.isLoaded = false;

        if (d.isWhiteBorad) {
            this.showWhiteBorad(d);
        } else if (d.isJpg) {
            this.showJPG(d);
        } else if (d.isAnimation) {
            this.showAnimation(d);
        }

        this.db.resetDrawCurrentPage();
    };

    PC.prototype.clear = function () {
        this.ifr.style.display = 'none';
        this.ifr.setAttribute('src', '');
        this.img.style.display = 'none';
        this.wb.style.display = 'none';
    };

    // 实例化画板对象
    window.PC = PC;

})(window, document, undefined);
