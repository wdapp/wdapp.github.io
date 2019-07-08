/**
 * 画板功能
 *
 * Version 0.0.4
 * */
!(function (window, document) {

    window.requestAnimFrameDuration = 1000 / 60;

    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, requestAnimFrameDuration);
            };
    })();

    var DrawType = {
        // 清屏(仅仅清除画笔数据)
        clearScreen: 0,
        // 清除上一步
        clearPrevDraw: 1,
        // 绘线
        drawLine: 2,
        // 矩形
        drawRectangle: 3,
        // 圆形
        drawCircular: 4,
        // 文字
        drawText: 5,
        // 删除整个文档
        deleteDoc: 6,
        // 清理文档每一页的画笔数据
        deleteDocDraw: 7,
        // 删除所有文档，以及所有文档的画笔数据
        deleteWholeDocAndDraw: 8,
        // 清除指定ID的画笔数据
        deleteDrawById: 9,
        //激光笔
        laserPen:10
    };

    var DrawingBoard = function () {
        this.db = document.getElementById('drawingBoard');
        this.dbContext = this.db.getContext('2d');

        this.db.click = function (event) {
            event.stopPropagation();
        };

        this.isCompleteCacheHistroyDraws = true;

        this.dbContext.globalAlpha = 0;
        this.dbContext.fillRect(0, 0, this.db.width, this.db.height);

        this.caches = {};

        this.tempCaches = [];
        this.cusIcon = document.getElementById('cus-icon');
        this.cusIconW = this.cusIcon.width;
        this.cusIconH = this.cusIcon.height;
        this.cusIconScaleW = this.cusIcon.width;
        this.cusIconScaleH = this.cusIcon.height;
        //激光笔
        this.laserPenBoard = document.getElementById('laserPenBoard');
        this.laserContext = this.laserPenBoard.getContext('2d');
        this.laserContext.strokeStyle='#eeeeee';
        this.laserContext.strokeWidth = 5;
        this.laserContext.strokeRect(0,0,this.laserPenBoard.width,this.laserPenBoard.height);
        this.laserContext.stroke();
        //画笔
        this.penBoard = document.getElementById('penBoard');
        this.penBoardContext = this.penBoard.getContext('2d');
        this.penImage = document.getElementById('pen');
        this.penW = this.penImage.width;
        this.penH = this.penImage.height;
        this.timerId = -1;

    };

    DrawingBoard.prototype.draw = function (d) {
        if (!this.isCompleteCacheHistroyDraws) {
            this.tempCaches.push(d);
            return;
        }
        if (d.docKey != this.pc.current.key) {
            return;
        }

        if (d.drawType == DrawType.clearScreen) { // 清屏(仅仅清除画笔数据)
            this.clearScreen(d);
        } else if (d.drawType == DrawType.clearPrevDraw) { // 清除上一步
            this.clearPrevDraw(d);
        } else if (d.drawType == DrawType.drawLine) { // 绘线
            this.drawLine(d);
        } else if (d.drawType == DrawType.drawRectangle) { // 矩形
            this.drawRectangle(d);
        } else if (d.drawType == DrawType.drawCircular) { // 圆形
            this.drawCircular(d);
        } else if (d.drawType == DrawType.drawText) { // 文字
            this.drawText(d);
        } else if (d.drawType == DrawType.deleteDoc) { // 删除整个文档
            this.deleteDoc(d);
        } else if (d.drawType == DrawType.deleteDocDraw) { // 清理文档每一页的画笔数据
            this.deleteDocDraw(d);
        } else if (d.drawType == DrawType.deleteWholeDocAndDraw) { // 删除所有文档，以及所有文档的画笔数据
            this.deleteWholeDocAndDraw(d);
        } else if (d.drawType == DrawType.deleteDrawById) { // 清除指定ID的画笔数据
            this.deleteDrawById(d);
        }
        else {
            // console.error('db.js no drawtype', d);
        }
    };
    DrawingBoard.prototype.drawNoCacheV2 = function (d) {

        if (d.docKey != this.pc.current.key) {
            return;
        }
        if(d.drawType == DrawType.laserPen){
            this.laserPenDraw(d);
        }

    };
    DrawingBoard.prototype.laserPenDraw = function (data) {

        this.cusIconScaleW =((this.cusIconW ) * this.laserPenBoard.width / 1920) > 48? 48 :((this.cusIconW ) * this.laserPenBoard.width / 1920) < 16 ? 16:((this.cusIconW ) * this.laserPenBoard.width / 1920);//处理显示问题大于最大48最小16
        if(data.drawData.length < 1 )return;
        var ls = data.drawData;
        var len = ls.length;
        var w = this.laserPenBoard.width;
        var h = this.laserPenBoard.height;
        for (var i = 0;i<len ; i++){
            var m = ls[i];
            var x = m.x * w;
            var y = m.y * h;
            this.drawCusImage(x,y);
        }

    };
    DrawingBoard.prototype.drawCusImage = function (x,y) {
        if(!this.laserPenBoard || !this.laserContext)return;
        this.laserContext.clearRect(0,0,this.laserPenBoard.width,this.laserPenBoard.height);
        if(this.cusIcon){
            this.laserContext.drawImage(this.cusIcon,0,0,48,48,x,y,this.cusIconScaleW,this.cusIconScaleW);
        }else{
            this.laserContext.fillStyle = '#ff0000';
            this.laserContext.globalAlpha = 1;
            this.laserContext.beginPath();
            this.laserContext.arc( x , y , 30 , 0 , 2*Math.PI , false );
            this.laserContext.fill();
        }
    };

    /**
     * 清屏(仅仅清除画笔数据)
     *
     * */
    DrawingBoard.prototype.clearScreen = function (data) {
        this.clearScreenData(data);
        this.resetDrawCurrentPage();
    };

    DrawingBoard.prototype.clearScreenData = function (data) {
        this.caches[data.docKey] = [];
    };

    /**
     * 清除上一步
     * */
    DrawingBoard.prototype.clearPrevDraw = function (data) {
        // this.clearPrevDrawData(data);
        this.resetDrawCurrentPage();
    };
    DrawingBoard.prototype.clearPrevDrawData = function (data) {
        var cs = this.caches[data.docKey];
        if (cs && cs.length > 0) {
            this.caches[data.docKey].pop();
        }
    };
  /**
     * 画线
     *
     * */
    DrawingBoard.prototype.drawLine = function (data) {
        console.log(data)
        // console.log('db.js drawLine', JSON.stringify(data));
       // this.penBoard.style.display = "block";
        this.penIconScaleW =((this.penW ) * this.penBoard.width / 1920) > 48? 48 :((this.penW ) * this.penBoard.width / 1920) < 16 ? 16:((this.penW ) * this.penBoard.width / 1920);//处理显示问题大于最大48最小16
        var canvas = this.db;
        var context = this.dbContext;

        var x0 = data.drawData[0].x * canvas.width;
        var y0 = data.drawData[0].y * canvas.height;

         context.beginPath();
         context.strokeStyle = data.drawColor;
         context.globalAlpha = 1;
         context.lineWidth = data.drawLineWidth * canvas.width / data.docWidth;
         context.lineJoin = "round";

        // 起点
        context.moveTo(x0, y0);

        for (var i = 0; i < data.drawData.length; i++) {
            var xn = data.drawData[i].x * canvas.width;
            var yn = data.drawData[i].y * canvas.height;

            context.lineTo(xn, yn);
            this.drawPenImage(xn,yn);
        }
        context.stroke();
    };
    DrawingBoard.prototype.drawPenImage = function (x,y) {
        clearTimeout(this.timerId);
        if(!this.penBoard || !this.penBoardContext)return;
            this.penBoardContext.clearRect(0,0,this.penBoard.width,this.penBoard.height);
        if(this.penImage){
            // console.log("dangqianshuju-->" + this.penW, this.penH ,(x),(y - this.penIconScaleW ),this.penIconScaleW,this.penIconScaleW);
            this.penBoardContext.drawImage(this.penImage,0,0,(this.penW ==0?32:this.penW ) ,(this.penH ==0?32:this.penW ),(x),(y - this.penIconScaleW ),this.penIconScaleW,this.penIconScaleW);
        }else{
            this.penBoardContext.fillStyle = '#ffff00';
            this.penBoardContext.globalAlpha = 1;
            this.penBoardContext.beginPath();
            this.penBoardContext.arc( x , y , 30 , 0 , 2*Math.PI , false );
            this.penBoardContext.fill();
        }
        this.timerId = setTimeout(function () {
            this.penBoardContext.clearRect(0,0,this.penBoard.width,this.penBoard.height);
        }.bind(this),2000);
        //this.penBoardContext.stroke();
    };
    /**
     * 实时画线
     *
     * */
    DrawingBoard.prototype.drawLineRealTime = function (data) {
        // console.log('db.js drawLineRealTime', JSON.stringify(data));

        var canvas = this.db;
        var context = this.dbContext;

        var x0 = data.drawData[0].x * canvas.width;
        var y0 = data.drawData[0].y * canvas.height;

        context.beginPath();

        context.strokeStyle = data.drawColor;
        context.globalAlpha = 1;
        context.lineWidth = data.drawLineWidth * canvas.width / data.docWidth;
        context.lineJoin = "round";

        // 起点
        context.moveTo(x0, y0);

        for (var i = 0; i < data.drawData.length; i++) {
            var xn = data.drawData[i].x * canvas.width;
            var yn = data.drawData[i].y * canvas.height;

            context.lineTo(xn, yn);
        }

        context.stroke();
    };
    DrawingBoard.prototype.drawLineData = function (data) {
        // console.log('drawlinedata', data);
        this.caches[data.docKey].push(data);
        // var currentDraws = this.caches[data.docKey];
        // if (currentDraws.length > 0) {
        //     var currentDrawText = currentDraws[currentDraws.length - 1];
        //
        //     if (currentDrawText.drawId == data.drawId) {
        //         var currentDrawLineDrawDatas = currentDrawText.drawData;
        //         var currentLastestDrawLineDrawData = currentDrawLineDrawDatas[currentDrawLineDrawDatas.length - 1];
        //
        //         var dataDrawLineDrawDatas = data.drawData;
        //         var dataFirstDrawLineDrawData = dataDrawLineDrawDatas[0];
        //
        //         if (currentLastestDrawLineDrawData.x == dataFirstDrawLineDrawData.x &&
        //             currentLastestDrawLineDrawData.y == dataFirstDrawLineDrawData.y) {
        //             for (var i = 1; i < dataDrawLineDrawDatas.length; i++) {
        //                 currentDrawLineDrawDatas.push(dataDrawLineDrawDatas[i]);
        //             }
        //         } else {
        //             this.caches[data.docKey].push(data);
        //         }
        //     } else {
        //         this.caches[data.docKey].push(data);
        //     }
        // } else {
        //     this.caches[data.docKey].push(data);
        // }
    };

    /**
     * 矩形
     *
     * */
    DrawingBoard.prototype.drawRectangle = function (data) {

        var canvas = this.db;
        var context = this.dbContext;

        var x = data.drawData.x * canvas.width;
        var y = data.drawData.y * canvas.height;

        var w = data.drawData.width * canvas.width;
        var h = data.drawData.height * canvas.height;

        context.beginPath();
        context.strokeStyle = data.drawColor;
        context.globalAlpha = 1;
        context.lineWidth = data.drawLineWidth * canvas.width / data.docWidth;
        context.lineJoin = "round";

        context.strokeRect(x, y, w, h);
        context.stroke();
    };

    /**
     * 圆形
     *
     * */
    DrawingBoard.prototype.drawCircular = function (data) {
        // console.log('db.js drawCircular', JSON.stringify(data));

        var canvas = this.db;
        var context = this.dbContext;

        var r = data.drawData.heightRadius * canvas.height;
        var x = data.drawData.x * canvas.width - r;
        var y = data.drawData.y * canvas.height - r;

        context.beginPath();
        context.strokeStyle = data.drawColor;
        context.globalAlpha = 1;
        context.lineWidth = data.drawLineWidth * canvas.width / data.docWidth;
        context.lineJoin = "round";

        context.arc(x, y, r, 0, Math.PI * 2, true);

        context.stroke();
    };

    /**
     * 文本
     *
     * */
    DrawingBoard.prototype.drawText = function (data) {
        // console.log('db.js drawText', JSON.stringify(data));

        var canvas = this.db;
        var context = this.dbContext;

        var currentDrawDatas = this.caches[data.docKey];
        if (currentDrawDatas[currentDrawDatas.length - 1].isNeedRedraw) {
            currentDrawDatas[currentDrawDatas.length - 1].isNeedRedraw = false;
            this.resetDrawCurrentPage();
            return;
        }

        var txt = data.drawData.label;
        var x = data.drawData.x * canvas.width;
        var y = data.drawData.y * canvas.height;

        context.font = data.drawData.size * canvas.width / data.docWidth + 'px SimSun';

        context.fillStyle = data.drawColor;
        context.globalAlpha = 1;
        context.textBaseline = 'top';
        context.textAlign = 'left';

        var txts = txt.split('\n');
        for (var index = 0; index < txts.length; index++) {
            var text = txts[index];
            var lineHeight = context.measureText("M").width * 1.5;
            context.fillText(text, x, y + lineHeight * index);
        }
    };
    DrawingBoard.prototype.drawTextData = function (data) {
        var currentDraws = this.caches[data.docKey];
        if (currentDraws.length > 0) {
            var currentDrawText = currentDraws[currentDraws.length - 1];
            if (currentDrawText.drawId == data.drawId) {
                this.caches[data.docKey].pop();

                data.isNeedRedraw = true;

                this.caches[data.docKey].push(data);
            } else {
                this.caches[data.docKey].push(data);
            }
        } else {
            this.caches[data.docKey].push(data);
        }
    };

    /**
     * 删除整个文档
     *
     * */
    DrawingBoard.prototype.deleteDoc = function (data) {
        this.deleteDocData(data);
        this.resetDrawCurrentPage();
    };
    DrawingBoard.prototype.deleteDocData = function (data) {
        for (var key in this.caches) {
            if (key.indexOf(data.docId) === 0) {
                this.caches[key] = [];
            }
        }
    };

    /**
     * 清理文档每一页的画笔数据
     *
     * */
    DrawingBoard.prototype.deleteDocDraw = function (data) {
        // console.log('db.js deleteDocDraw', JSON.stringify(data));
        this.deleteDocDrawData(data);
        this.resetDrawCurrentPage();
    };
    DrawingBoard.prototype.deleteDocDrawData = function (data) {
        for (var key in this.caches) {
            if (key.indexOf(data.docId) === 0) {
                this.caches[key] = [];
            }
        }
    };

    /**
     * 删除所有文档，以及所有文档的画笔数据
     *
     * */
    DrawingBoard.prototype.deleteWholeDocAndDraw = function (data) {
        // console.log('db.js deleteWholeDocAndDraw', JSON.stringify(data));
        this.deleteWholeDocAndDrawData(data);
        this.resetDrawCurrentPage();
    };
    DrawingBoard.prototype.deleteWholeDocAndDrawData = function (data) {
        this.caches = {};
    };

    /**
     * 清除指定ID的画笔数据
     *
     * */
    DrawingBoard.prototype.deleteDrawById = function (data) {
        this.deleteDrawByIdData(data);
        this.resetDrawCurrentPage();
    };
    DrawingBoard.prototype.deleteDrawByIdData = function (data) {
        var docKey = data.docKey;
        var deleteDrawId = data.drawId;

        this.caches[docKey] = this.caches[docKey].filter(function (c) {
            if (c.drawId != deleteDrawId) {
                return true;
            } else {
                return false;
            }
        });
    };


    /**
     * 缓存并绘制
     *
     * */
    DrawingBoard.prototype.cacheAndDraw = function (d) {
        this.cache(d);
        this.draw(d);
    };

    /**
     * 存入缓存
     *
     * */
    DrawingBoard.prototype.cache = function (d) {
        var t = this;

        var cs = t.caches[d.docKey];

        if (!cs) {
            t.caches[d.docKey] = [];
        }

        if (d.drawType == DrawType.clearScreen) { // 清屏(仅仅清除画笔数据)
            t.clearScreenData(d);
        } else if (d.drawType == DrawType.clearPrevDraw) { // 清除上一步
            t.clearPrevDrawData(d);
        } else if (d.drawType == DrawType.drawLine) { // 绘线
            t.drawLineData(d);
        } else if (d.drawType == DrawType.drawRectangle) { // 矩形
            t.caches[d.docKey].push(d);
        } else if (d.drawType == DrawType.drawCircular) { // 圆形
            t.caches[d.docKey].push(d);
        } else if (d.drawType == DrawType.drawText) { // 文字
            t.drawTextData(d);
        } else if (d.drawType == DrawType.deleteDoc) { // 删除整个文档
            t.deleteDocData(d);
        } else if (d.drawType == DrawType.deleteDocDraw) { // 清理文档每一页的画笔数据
            t.deleteDocDrawData(d);
        } else if (d.drawType == DrawType.deleteWholeDocAndDraw) { // 删除所有文档，以及所有文档的画笔数据
            t.deleteWholeDocAndDrawData(d);
        } else if (d.drawType == DrawType.deleteDrawById) { // 清除指定ID的画笔数据
            t.deleteDrawByIdData(d);
        } else {
            // console.error('db.js no drawtype', d);
        }
    };


    /**
     * 缓存历史数据
     *
     * */
    DrawingBoard.prototype.cacheHistoryDraws = function (ds) {
        var t = this;

        ds.forEach(function (d) {
                t.cache(d);
            }
        );

        var tcs = this.tempCaches;
        tcs.forEach(function (d) {
                t.cache(d);
            }
        );

        this.isCompleteCacheHistroyDraws = true;

        this.resetDrawCurrentPage();
    };


    DrawingBoard.prototype.clear = function () {
        var t = this;

        t.db.width = t.db.width;

        t.caches = {};
    };

    /**
     * 重新绘制当前页画笔
     * */
    DrawingBoard.prototype.resetDrawCurrentPage = function () {
        var t = this;

        t.db.width = t.db.width;
        this.laserContext.clearRect(0,0,this.laserPenBoard.width,this.laserPenBoard.height);
        var cs = t.caches[t.pc.current.key];

        if (!cs) {
            return;
        }

        cs.forEach(function (c) {
            t.draw(c);
        });
    };


    DrawingBoard.prototype.reset = function (el) {
        this.db.style.marginLeft = el.style.marginLeft;
        this.db.style.marginTop = el.style.marginTop;

        this.db.width = el.style.width.replace('px', '') * 2;
        this.db.height = el.style.height.replace('px', '') * 2;

        this.db.style.width = el.style.width;
        this.db.style.height = el.style.height;

        this.laserPenBoard.style.marginLeft = el.style.marginLeft;
        this.laserPenBoard.style.marginTop = el.style.marginTop;

        this.penBoard.style.marginLeft = el.style.marginLeft;
        this.penBoard.style.marginTop = el.style.marginTop;

        this.laserPenBoard.width = el.style.width.replace('px', '') * 2;
        this.laserPenBoard.height = el.style.height.replace('px', '') * 2;
        this.laserPenBoard.style.width = el.style.width;
        this.laserPenBoard.style.height = el.style.height;

        this.penBoard.width = el.style.width.replace('px', '') * 2;
        this.penBoard.height = el.style.height.replace('px', '') * 2;
        this.penBoard.style.width = el.style.width;
        this.penBoard.style.height = el.style.height;


        this.dbContext.globalAlpha = 0;
        this.dbContext.fillRect(0, 0, this.db.width, this.db.height);
    };


    window.DrawingBoard = DrawingBoard;

})(window, document, undefined);