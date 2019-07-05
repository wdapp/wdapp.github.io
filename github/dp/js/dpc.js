/**
 * DPC
 *
 *  显示文档观看端JS代码
 *
 * Version 0.1.2
 *
 * Created by shanglt on 2018/05/21.
 */
!(function (window, document) {

    var Utils = {
        //TODO
        toJson: function (j) {
            if (typeof j === "string") {
                try {
                    j = JSON.parse(j);
                }catch (e){
                }
            }
            return j;
        },
        getPageData: function (docId, pageIndex, docs) {
            var data = {};
            if(!docs){
                return data.result = 'wroung';
            }
            for (var i = 0; i < docs.length; i++) {
                var docInfo = docs[i];
                if (docInfo.docId === docId) {
                    var docPageArr = docInfo.pages;
                    if (pageIndex > docPageArr.length - 1) {
                        data.result = 'wroung';
                        break;
                    }
                    docPageArr.sort(function (a, b) {
                        return a.pageIndex - b.pageIndex;
                    });
                    var pageI = docPageArr[pageIndex];
                    data.docId = docId;
                    data.docName = docInfo.docName;
                    data.docTotalPage = docInfo.docTotalPage || docPageArr.length;
                    data.encryptDocId = docId;
                    data.mode = 0;
                    data.pageNum = pageIndex;
                    data.time = -1;
                    data.url = pageI.src.replace(/http:/g, 'https:');
                    data.useSDK = false;
                    data.pageTitle = pageI.title;
                    break;
                }
            }
            return data;
        },
      log:function (data) {
        if(console.log){
            console.log(data)
        }
      },
      getDate:function (){
        var date= new Date();
         var t = date.getMonth()+"-"+date.getDay()+"_"+date.getHours()+"_"+date.getMinutes()+"_"+date.getSeconds();
        return t;
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
            Utils.log("未创建文档")
            // return;
            // throw new Error('iframe element is not exists');
        }

        this.df = df;
        this.isOpenBarrage = false;
        this.isOpenMarquee = false;
        (function (d) {
            if(!d.df)return;
            if (window.attachEvent) {
              d.df.attachEvent('onload', function () {
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
        var displayMode = $('#documentDisplayMode').val();
        if(this.df){
          this.df.src = '//192.168.200.33/websdk/github/dp/dp/dp.html?vertical=1&displayMode=' + displayMode+'&hd_version='+Utils.getDate();
        }

        this.isLoaded = false;

        this.buffers = [];

        this.metaCache = {
            pageChange: [],
            animation: [],
            draw: []
        };

        this.docsInfo = [];
        this.isFreedDocMode = false;
        this.reload = function () {
            if(!this.df)return;
            this.df.src = this.df.src;
        };
        this.setDisplayMode = function (m) {

            if(!this.df)return;
            this.df.src = '//192.168.200.33/websdk/github/dp/dp/dp.html?vertical=1&displayMode=' + m+'&hd_version='+Utils.getDate();
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
        /***
         *
         *解决直播和回放全屏冲突问题;
         *
         * */
        this.setPlayMode = function (m) {
            this.pm({
                action: 'play_mode',
                value: m
            })
        };

        this.drawNoCache = function (data) {
            if(!data){
                return;
            }
            this.pm({
                action:'draw_from_dpc_nocache',
                value:data
            })
        };
        //显示默认图像

        this.showDefaultPageChange = function () {
            this.pm({action: 'show_default_page', value: ''});
        };

        this.pageChange = function (data) {
            this.metaCache.pageChange.push(data);
            if (this.isFreedDocMode) {
                return;
            }
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
        //开启跑马灯插件
        this.openMarquee = function (data) {
            if (!data) {
                return;
            }
            try {
                var content = JSON.parse(data)||data;
            }catch (e){
                return;
            }
            this.pm({
                action: 'add_plugin_marquee',
                value: content
            });
            this.isOpenMarquee = !this.isOpenMarquee;
        };
        this.closeMarquee = function () {
            this.pm({
                action:'close_plugin_marquee',
                value:'close'
            })
        };
        //开启初始化弹幕插件
        this.openBarrage = function (data) {
            var line = 4;
            if (!!data){
                line = !!parseInt(data) || 4;
            }
            this.pm({
                action: 'add_plugin_bullet',
                value: line
            })
            this.isOpenBarrage = !this.isOpenBarrage;
        };
        //添加弹幕内容
        this.insertBarrage = function (data) {
            if(!data){
                return;
            }
            var content
            try {
                if(typeof data =='string'){
                    content= JSON.parse(data);
                }else{
                    content = data;
                }

            }catch (e){
                return
            }
            this.pm({
                action: 'append_bullet',
                value: content
            })
        };
        this.closeBarrage = function () {
          this.pm({
              action:'close_plugin_barrage',
              value:''
          })
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
        this.resizeDoc = function (data) {
            this.pm({
                    action: 'resize_from_dpc_doc',
                    value: data
                }
            )
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
        //设置为自由观看模式 ( 0 为跟随模式，1为自由模式)
        this.setFreeDocMode = function (b) {
            var isFree = (b == 1);
            if(isFree === this.isFreedDocMode){
                return;
            }
            this.isFreedDocMode = isFree;
            if (!this.isFreedDocMode) {
                this.resetWithMeta();
            }
            return this.isFreedDocMode;
        };
        //自由模式下跳转到某一页
        this.changePageTo = function (docId, pageIndex) {
            if (!this.isFreedDocMode) {
                return;
            }
            var data = Utils.getPageData(docId, pageIndex, this.docsInfo);
            if (data.result) {
                return;
            }
            this.pm({
                action: 'page_change_from_dpc',
                value: data
            });
        };
        //获取全部文档的数据文档数据
        this.getDocs = function (roomId, userId, callbak) {
            var _this = this;
            if(!roomId||!userId){
                return;
            }
            $.ajax({
                url: '//view.csslcloud.net/api/room/docs',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    roomid: roomId,
                    userid: userId
                },
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {
                    if (data.success) {
                        _this.docsInfo = data.datas.docs;
                    }
                    if( typeof callbak == 'function'){
                        callbak(data);
                    }else{
                        if(console.log){
                            console.log('callback is undefined');
                            console.log(data.msg);
                        }
                    }
                },
                error: function (e) {
                    if( typeof callbak == 'function'){
                        callbak({errorCode:1,msg:'request was aborted',result:e});
                    }else{
                        if(console.log){
                            console.log('request was aborted');
                        }
                    }
                }
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
