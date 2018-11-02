/**
 * CC playback video
 * v2.4.2 2018/10/09
 */
!(function ($, window, document) {

    // 直播播放器信息
    var CallbackPlayer = function (opts) {
        this.isReady = false;
        this.isPublishing = 0;
        this.id = opts.callbackPlayer.id;

        var swfUrl = '//player.csslcloud.net/platform/live/CallbackPlayer.swf';
        var flashvars = {
            'userid': opts.userId,
            'videoid': opts.videoId,
            'recordid': opts.recordId,
            'isShowBar': opts.isShowBar,
            'upid': opts.upId,
            'viewerid': opts.viewerId,
            'roomid': opts.roomId,
            'ua': '1'
        };
        var params = {
            allowFullscreen: 'true',
            allowScriptAccess: 'always',
            wmode: 'transparent'
        };

        this.flashPlayerInit = function () {
            swfobject.embedSWF(swfUrl, opts.callbackPlayer.id, opts.callbackPlayer.width, opts.callbackPlayer.height, '10.0.0',
                '/flash/expressInstall.swf', flashvars, params);
            if (MobileLive.isMobile() != 'isMobile') {
                var report = new ReportLog(opts, 0, 1, null, false);
            }
        };

        if (!DW.isH5play) {
            this.flashPlayerInit();
        }

        this.getFlash = function () {
            return swfobject.getObjectById(this.id);
        };

        this.playbackRate = function (t) {
            if (!DW.isH5play && MobileLive.isMobile() !== 'isMobile') {
                return;
            }
            var t = parseFloat(t);
            this.getH5player().playbackRate = t;
        };

        this.seek = function (t) {
            if (t < 0) {
                return;
            }
            if (DW.isH5play || MobileLive.isMobile() == 'isMobile') {
                this.getH5player().currentTime = t;
            } else {
                var swf = this.getFlash();
                if (!swf) {
                    return;
                }
                swf.seek(t);
            }
        };

        this.getFlash = function () {
            return swfobject.getObjectById(this.id);
        };

        this.getH5player = function () {
            return $('#playbackVideo')[0];
        };

        this.getPlayerTime = function () {
            if (!this.isReady) {
                return 0;
            }
            var t;
            if (DW.isH5play || MobileLive.isMobile() == 'isMobile') {
                t = this.getH5player().currentTime;
            } else {
                t = parseInt(this.getFlash().getPosition(), 10);
            }
            if (isNaN(t) || t < 0) {
                return 0;
            }

            return t;
        };

        this.getDuration = function () {
            if (DW.isH5play || MobileLive.isMobile() == 'isMobile') {
                return this.getH5player().duration;
            } else {
                var swf = this.getFlash();
                if (!swf) {
                    return;
                }
                return swf.getDuration();
            }
        };

        this.getBuffer = function () {

            if (DW.isH5play || MobileLive.isMobile() == 'isMobile') {
                return this.getH5player().buffered.end(0);
            } else {
                var swf = this.getFlash();
                if (!swf) {
                    return;
                }
                return swf.getBufferLength();
            }

        };

        this.setVolume = function (n) {
            if (DW.isH5play || MobileLive.isMobile() == 'isMobile') {
                this.getH5player().volume = parseFloat(n);
            } else {
                var swf = this.getFlash();
                if (!swf) {
                    return;
                }
                return swf.setVolume(n);
            }
        };

        this.getVolume = function () {
            if (DW.isH5play || MobileLive.isMobile() == 'isMobile') {
                return this.getH5player().volume;
            } else {
                var swf = this.getFlash();
                if (!swf) {
                    return;
                }
                return swf.getVolume();
            }
        };

        this.play = function () {
            if (DW.isH5play || MobileLive.isMobile() == 'isMobile') {
                if (MobileLive.pauseState) {
                    this.getH5player().play();
                } else {
                    this.getH5player().pause();
                }
            } else {
                var swf = this.getFlash();
                if (!swf) {
                    return;
                }
                return swf.isPlay();
            }
        };

        this.setZScale = function (s) {
            var swf = this.getFlash();
            if (!swf) {
                return;
            }
            return swf.setZScale(s);
        };

        this.getZScale = function () {
            var swf = this.getFlash();
            if (!swf) {
                return;
            }
            return swf.getZScale();
        };

        this.setScale = function (s) {
            var swf = this.getFlash();
            if (!swf) {
                return;
            }
            return swf.setScale(s);
        };

        this.getScale = function () {
            var swf = this.getFlash();
            if (!swf) {
                return;
            }
            return swf.getScale();
        };

        this.openSettingPanel = function () {
            var swf = this.getFlash();
            if (!swf) {
                return;
            }
            return swf.openSettingPanel();
        };
    };


    var Socket = function (opts) {

        var isHttps = window.location.protocol === 'https:';
        var host = opts.chat.host;
        if (isHttps && host && host.indexOf(':')) {
            var s = host.split(':');
            if (s.length == 2) {
                var port = parseInt(s[1]);
                if (!isNaN(port)) {
                    var httpsPort = port + 400;
                    host = s[0] + ':' + httpsPort;
                }
            }
        }

        var terminal = 0;
        if (MobileLive.isMobile() == 'isMobile') {
            terminal = 1;
        }

        var socket = io.connect(document.location.protocol + '//' + host + '/replay', {
            query: {
                roomid: opts.roomId,
                sessionid: opts.viewer.sessionId,
                platform: 1,
                terminal: terminal
            }
        });
    };

    var DrawPanel = function (opts, callbackPlayer) {
        this.isReady = false;

        var swfUrl = '//zeus.csslcloud.net/flash/Player.swf';

        var flashvars = {
            'type': 'drawpanel'
        };
        var params = {
            allowFullscreen: 'true',
            allowScriptAccess: 'always',
            wmode: 'transparent'
        };
        var attributes = {};

        if (!DWDpc.fastMode) {
            swfobject.embedSWF(swfUrl, opts.drawPanel.id, opts.drawPanel.width, opts.drawPanel.height,
                '10.0.0', '/flash/expressInstall.swf', flashvars, params, attributes);
        }

        this.getFlash = function () {
            if (!this.isReady) {
                return;
            }

            return swfobject.getObjectById(opts.drawPanel.id);
        };

        this.clear = function () {
            DWDpc.clear();
            var swf = this.getFlash();
            if (!swf) {
                return;
            }
            swf.clear();
        };

        // 画图
        this.draw = function (j) {
            DWDpc.draw(j);

            var swf = this.getFlash();
            if (!swf) {
                return;
            }

            swf.draw(j);
        };

        this.draws = function (js) {
            var swf = this.getFlash();
            if (!swf) {
                return;
            }

            (function (jstr) {
                setTimeout(function () {
                    swf.drawList(jstr);
                });
            })(js);
        };


        // 翻页
        this.filp = function (j) {
            DWDpc.pageChange(j);

            var swf = this.getFlash();
            if (!swf) {
                return;
            }

            var jj = JSON.parse(j);
            var u = jj.url;
            var isHttps = window.location.protocol === 'https:';
            if (isHttps) {
                jj.url = u.replace(/http:/g, 'https:');
            }

            if (options.adapt) {
                swf.filp(JSON.stringify(jj), 'auto');
            } else {
                swf.filp(JSON.stringify(jj));
            }
        };

        // 动画
        this.animation = function (j) {
            DWDpc.animationChange(j);

            var swf = this.getFlash();
            if (!swf) {
                return;
            }

            swf.animation(j);
        };

        this.intervalNum = 0;

        // 循环更新翻页和画板信息
        this.interval = function () {

            var ft = 0;
            try {
                ft = callback.callbackPlayer.getPlayerTime();
            } catch (e) {
            }
            if (ft < 0) {
                return;
            }

            try {
                if (callback.animations && callback.animations.length > 0) {
                    if (callback.animationIndex < callback.animations.length) {
                        var pidex = callback.pageChangeIndex;
                        if (pidex >= 0) {
                            var pc = callback.pageChanges[pidex];
                            var a = callback.animations[callback.animationIndex + 1];
                            if (!!pc && !!a && pc.encryptDocId == a.encryptDocId && ft >= a.time && pc.time <= a.time) {
                                if (DWDpc.fastMode) {
                                    this.animation(a);
                                } else {
                                    this.animation(JSON.stringify({
                                        'fileName': a.docName,
                                        'totalPage': a.docTotalPage,
                                        'docid': a.encryptDocId,
                                        'url': a.url,
                                        'page': a.pageNum,
                                        'step': a.step
                                    }));
                                }
                                callback.animationIndex = callback.animationIndex + 1;
                            }
                        }
                    }
                }
            } catch (e) {
            }

            try {
                if (callback.pageChanges && callback.pageChanges.length > 0) {
                    if (callback.pageChangeIndex < callback.pageChanges.length) {
                        var pc = callback.pageChanges[callback.pageChangeIndex + 1];
                        if (ft >= pc.time) {
                            if (typeof window.on_cc_callback_page_change === 'function') {
                                window.on_cc_callback_page_change(pc);
                            }

                            if (DWDpc.fastMode) {
                                this.filp(pc);
                            } else {
                                this.filp(JSON.stringify({
                                    'fileName': pc.docName,
                                    'totalPage': pc.docTotalPage,
                                    'docid': pc.encryptDocId,
                                    'url': pc.url,
                                    'page': pc.pageNum,
                                    'useSDK': pc.useSDK
                                }));
                            }

                            callback.pageChangeIndex = callback.pageChangeIndex + 1;

                            //翻页信息回掉
                            var obj = {};
                            obj.docId = pc.docId;
                            obj.docName = pc.docName;
                            obj.docTotalPage = pc.docTotalPage;
                            obj.pageNum = pc.pageNum;

                            if (typeof window.on_cc_callback_pagechange === 'function') {
                                window.on_cc_callback_pagechange(obj);
                            }

                        }
                    }
                }
            } catch (e) {
            }

            try {
                if (callback.animations && callback.animations.length > 0) {
                    if (callback.animationIndex < callback.animations.length) {
                        var pidex = callback.pageChangeIndex;
                        if (pidex >= 0) {
                            var pc = callback.pageChanges[pidex];
                            var a = callback.animations[callback.animationIndex + 1];
                            if (!!pc && !!a && pc.encryptDocId == a.encryptDocId && ft >= a.time && pc.time <= a.time) {
                                if (DWDpc.fastMode) {
                                    this.animation(a);
                                } else {
                                    this.animation(JSON.stringify({
                                        'fileName': a.docName,
                                        'totalPage': a.docTotalPage,
                                        'docid': a.encryptDocId,
                                        'url': a.url,
                                        'page': a.pageNum,
                                        'step': a.step
                                    }));
                                }
                                callback.animationIndex = callback.animationIndex + 1;
                            }
                        }
                    }
                }
            } catch (e) {
            }


            try {
                if (callback.draws && callback.draws.length > 0) {
                    // 画图逻辑
                    if (callback.drawIndex < callback.draws.length) {
                        var dc = callback.draws[callback.drawIndex + 1];
                        while (ft >= dc.time) {
                            if (DWDpc.fastMode) {
                                this.draw(dc);
                            } else {
                                this.draw(dc.data);
                            }

                            callback.drawIndex = callback.drawIndex + 1;
                            dc = callback.draws[callback.drawIndex + 1];
                        }
                    }
                }
            } catch (e) {
            }
        };

        this.intervalPainting = function (callback) {
            callback.drawPanel.intervalNum = setInterval(function () {
                callback.drawPanel.interval(callback);
            }, 1000);
        };
    };

    //优化meta数据
    var substepRequest = function (opts) {
        $.ajax({
            url: opts.url,
            type: 'GET',
            data: opts.data,
            tryCount: 0,
            retryLimit: 3,
            timeout: 5000,
            dataType: 'jsonp',
            success: function (data) {
                opts.done(data);
            },
            error: function (xhr, textStatus, errorThrown) {
                if (textStatus == 'timeout') {
                    this.tryCount++;
                    if (this.tryCount < this.retryLimit) {
                        //try again
                        $.ajax(this);
                        return;
                    } else {
                        if (typeof opts.fn === 'function') {
                            opts.fn(textStatus);
                        }
                        return;
                    }
                    return;
                }
                if (xhr.status == 500) {
                    //handle error
                } else {
                    //handle error
                }
            }
        });
    };

    var substepRequestHistoryData = function (opts, fn) {
        var param = {
            roomid: opts.roomId,
            userid: opts.userId,
            liveid: opts.liveId,
            upid: opts.upId,
            recordid: opts.recordId,
            viewertoken: opts.viewertoken,
            viewername: opts.viewername,
            forcibly: opts.forcibly
        };

        var sub = {
            globalData: {},
            requestLoginData: false,
            requestInfoData: false,
            requestDrawData: false,
            requestChatqaData: false,
            allRequests: 0,
        };

        // 登录
        substepRequest({
            url: '//view.csslcloud.net/api/room/replay/login',
            data: param,
            fn: window.on_cc_login_error,
            done: function (data) {
                if (!checkout(data, window.on_cc_login_error)) {
                    return false;
                }
                concatMeta(sub.globalData, data);
                sub.requestLoginData = true;
                sub.requestInfoData = false;
                sub.requestDrawData = false;
                sub.requestChatqaData = false;
                sub.allRequests++;
                success(sub);

                //登录成功

                // 请求画笔数据
                substepRequest({
                    url: '//view.csslcloud.net/api/view/replay/draw/info',
                    data: param,
                    fn: window.on_cc_request_draw_error,
                    done: function (data) {
                        if (!checkout(data, window.on_cc_request_draw_error)) {
                            return false;
                        }
                        concatMeta(sub.globalData, data);
                        sub.requestLoginData = false;
                        sub.requestInfoData = false;
                        sub.requestDrawData = true;
                        sub.requestChatqaData = false;
                        sub.allRequests++;
                        success(sub);
                    }
                });

                // 请求聊天和问答数据
                substepRequest({
                    url: '//view.csslcloud.net/api/view/replay/chatqa/info',
                    data: param,
                    fn: window.on_cc_request_chatqa_error,
                    done: function (data) {
                        if (!checkout(data, window.on_cc_request_chatqa_error)) {
                            return false;
                        }
                        concatMeta(sub.globalData, data);
                        sub.requestLoginData = false;
                        sub.requestInfoData = false;
                        sub.requestDrawData = false;
                        sub.requestChatqaData = true;
                        sub.allRequests++;
                        success(sub);
                    }
                });

                // 广播，翻页，animation及后续新增数据
                substepRequest({
                    url: '//view.csslcloud.net/api/view/replay/info',
                    data: param,
                    fn: window.on_cc_request_info_error,
                    done: function (data) {
                        if (!checkout(data, window.on_cc_request_info_error)) {
                            return false;
                        }
                        concatMeta(sub.globalData, data);
                        sub.requestLoginData = false;
                        sub.requestInfoData = true;
                        sub.requestDrawData = false;
                        sub.requestChatqaData = false;
                        sub.allRequests++;
                        success(sub);
                    }
                });

            }
        });


        var checkout = function (data, fn) {
            if (!data.success) {
                if (typeof fn === 'function') {
                    fn(data);
                }
                return false;
            }

            if (!data.datas) {
                return false;
            }

            return true;
        };

        var concatMeta = function (d1, d2) {
            extend(d1, d2);
            if (!d1.datas.meta) {
                d1.datas.meta = {};
            }
            extend(d1.datas.meta, d2.datas.meta);
        };

        var extend = function (o, n) {
            for (var p in n) {
                if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p) ))
                    o[p] = n[p];
            }
        };

        var success = function (sub) {
            fn(sub);
        };

    };

    // 历史数据
    var History = function (opts, callback) {

        substepRequestHistoryData(opts, success);

        //canplay
        var onCCH5PlayerLoad = false;

        function success(sub) {

            var data = sub.globalData;

            if (sub.requestLoginData) {

                if (DWDpc.fastMode) {
                    $('#documentDisplayMode').val(data.datas.room.documentDisplayMode);
                    DWDpc.appendDrawPanel();
                    DWDpc.init();
                }

                opts.chat = {
                    host: data.datas.pusherNode.primary
                };
                opts.viewer.sessionId = data.datas.sessionId;
                opts.liveId = data.datas.encryptLiveId;
                opts.upId = data.datas.upId;
                opts.viewerId = data.datas.viewer.id;
                callback.socket = new Socket(opts);

                if (typeof window.on_cc_callback_player === 'function') {
                    window.on_cc_callback_player(data.datas.live.encryptRecordvideoId);
                }

                if (DW.isH5play) {
                    MobileLive.init(opts);
                } else if (MobileLive.isMobile() == 'isMobile') {
                    MobileLive.init(opts);
                }
            }

            var datas = data.datas;
            var meta = datas.meta;
            if (!meta) {
                return;
            }

            if (sub.requestInfoData) {
                var pages = meta.pageChange;

                for (var i = 0; i < pages.length; i++) {
                    var imgUrl = pages[i].url;
                    var isHttps = window.location.protocol === 'https:';
                    if (imgUrl.indexOf('//') > 0 && isHttps) {
                        imgUrl = imgUrl.replace('http:', 'https:');
                        pages[i].url = imgUrl;
                    }
                }

                if (typeof window.on_cc_callback_pages === 'function') {
                    window.on_cc_callback_pages(pages);
                }

                var pageChanges = meta.pageChange;
                if (pageChanges && pageChanges.length) {
                    pageChanges.sort(function (p1, p2) {
                        return parseInt(p1.time) - parseInt(p2.time);
                    });
                    callback.pageChanges = pageChanges;
                }

                var animations = meta.animation;
                if (animations && animations.length) {
                    animations.sort(function (p1, p2) {
                        return parseInt(p1.time) - parseInt(p2.time);
                    });
                    callback.animations = animations;
                }

                //广播
                var broadcasts = meta.broadcast;
                window.chatLogs = meta.broadcast;
                if (broadcasts && broadcasts.length) {
                    broadcasts.sort(function (p1, p2) {
                        return parseInt(p1.time) - parseInt(p2.time);
                    });
                    for (var i = 0; i < broadcasts.length; i++) {
                        var broadcast = broadcasts[i];
                        if (typeof window.on_cc_live_broadcast_msg == 'function') {
                            window.on_cc_live_broadcast_msg({
                                content: broadcast.content,
                                time: broadcast.time
                            });
                        }
                    }
                    callback.broadcasts = broadcasts;
                }
            }

            if (sub.requestChatqaData) {
                var questions = meta.question;
                if (questions && questions.length) {
                    questions.sort(function (p1, p2) {
                        return parseInt(p1.time) - parseInt(p2.time);
                    });
                    callback.questions = questions;
                    for (var i = 0; i < callback.questions.length; i++) {
                        var question = questions[i];

                        if (typeof window.on_cc_live_qa_question === 'function') {
                            window.on_cc_live_qa_question({
                                'action': 'question',
                                'value': {
                                    'id': question.encryptId,
                                    'content': question.content,
                                    'userId': question.questionUserId,
                                    'userName': question.questionUserName,
                                    'userAvatar': question.questionUserAvatar,
                                    'isPublish': question.isPublish
                                }
                            });
                        }
                    }
                }

                var answers = meta.answer;
                if (answers && answers.length) {
                    answers.sort(function (p1, p2) {
                        return parseInt(p1.time) - parseInt(p2.time);
                    });
                    callback.answers = answers;

                    for (var i = 0; i < callback.answers.length; i++) {
                        var answer = answers[i];

                        if (typeof window.on_cc_live_qa_answer === 'function') {
                            window.on_cc_live_qa_answer({
                                'action': 'answer',
                                'value': {
                                    'questionId': answer.encryptId,
                                    'content': answer.content,
                                    'userId': answer.answerUserId,
                                    'isPrivate': answer.isPrivate,
                                    'userName': answer.answerUserName,
                                    'userAvatar': answer.answerUserAvatar,
                                    'userRole': answer.answerUserRole
                                }
                            });
                        }
                    }
                }

                var chatLogs = meta.chatLog;
                window.chatLogs = meta.chatLog;
                if (chatLogs && chatLogs.length) {
                    chatLogs.sort(function (p1, p2) {
                        return parseInt(p1.time) - parseInt(p2.time);
                    });
                    for (var i = 0; i < chatLogs.length; i++) {
                        var chatLog = chatLogs[i];
                        if (typeof window.on_cc_live_chat_msg === 'function') {
                            window.on_cc_live_chat_msg({
                                userid: chatLog.userId,
                                username: chatLog.userName,
                                time: chatLog.time,
                                msg: chatLog.content,
                                useravatar: chatLog.userAvatar,
                                userRole: chatLog.userRole,
                                usercustommark: chatLog.userCustomMark
                            });
                        }
                    }
                    callback.chatLogs = chatLogs;
                }

                if (window.chatLogs && window.chatLogs.length) {
                    window.CHATLOGS = window.chatLogs;
                    cc_live_callback_chat_interval();
                }

                if (window.broadcasts && window.broadcasts.length) {
                    //广播
                    window.BROADCASTS = window.broadcasts;
                    cc_live_callback_broadcasts_interval();
                }
            }

            if (sub.requestDrawData) {
                var draws = meta.draw;
                if (draws && draws.length) {
                    callback.draws = draws;
                }

                callback.isHistoryReady = true;

                callback.drawPanel.isReady = true;
                setTimeout(function () {
                    initDrawPanelInfo();
                }, 1500);
            }

            window.on_cc_h5_player_load = function () {
                callback.callbackPlayer.isReady = true;
                if (onCCH5PlayerLoad) {
                    return;
                }
                onCCH5PlayerLoad = true;

                var playbackPanel = document.getElementById('drawPanel');
                if (playbackPanel) {
                    $.Callback.config({playerId: 'playbackVideo'}, meta);
                }

            };

        }

    };

    //广播
    var BroadcastCache = function () {
        this.cache = [];
        this.lastTimeRefresh = new Date().getTime();

        this.INTERVAL_TIME = setInterval(function () {
            callback.broadcastCache.refresh();
        }, 80);

        //
        this.push = function (data) {
            // 缓存中超过5000条数据，则丢弃
            if (this.cache.length > 5000) {
                return;
            }
            this.cache.push(data);
        };

        this.ableRefresh = function () {
            var n = new Date().getTime();

            if (this.cache.length == 0) {
                return false;
            }

            if ((n - this.lastTimeRefresh) >= 80) {
                return true;
            }
            return false;
        };

        this.refresh = function () {
            if (!this.ableRefresh()) {
                return;
            }

            clearInterval(this.INTERVAL_TIME);

            var d = [];
            var l = Math.min(this.cache.length, 10);
            for (var i = 0; i < l; i++) {
                d.push(this.cache.shift());
            }

            if (typeof window.on_cc_live_broadcast_msg_sync === 'function') {
                window.on_cc_live_broadcast_msg_sync(d);
            }

            this.lastTimeRefresh = new Date().getTime();

            this.INTERVAL_TIME = setInterval(function () {
                callback.broadcastCache.refresh();
            }, 80);
        };
    };

    var ChatMessageCache = function () {
        this.cache = [];
        this.lastTimeRefresh = new Date().getTime();

        this.INTERVAL_TIME = setInterval(function () {
            callback.chatMessageCache.refresh();
        }, 80);

        //
        this.push = function (data) {
            // 缓存中超过5000条数据，则丢弃
            if (this.cache.length > 5000) {
                return;
            }
            this.cache.push(data);
        };

        this.ableRefresh = function () {
            var n = new Date().getTime();

            if (this.cache.length == 0) {
                return false;
            }

            if ((n - this.lastTimeRefresh) >= 80) {
                return true;
            }
            return false;
        };

        this.refresh = function () {
            if (!this.ableRefresh()) {
                return;
            }

            clearInterval(this.INTERVAL_TIME);

            var d = [];
            var l = Math.min(this.cache.length, 10);
            for (var i = 0; i < l; i++) {
                d.push(this.cache.shift());
            }

            if (typeof window.on_cc_live_chat_msg_sync === 'function') {
                window.on_cc_live_chat_msg_sync(d);
            }

            this.lastTimeRefresh = new Date().getTime();

            this.INTERVAL_TIME = setInterval(function () {
                callback.chatMessageCache.refresh();
            }, 80);
        };
    };

    var Callback = function (opts) {
        this.chatLogs = [];
        this.broadcasts = [];
        this.draws = [];
        this.pageChanges = [];
        // 获取历史数据成功
        this.isHistoryReady = false;
        this.questions = [];
        this.answers = [];
        this.pageChanges = [];
        this.draws = [];
        this.animations = [];
        this.pageChangeIndex = -1;
        this.drawIndex = -1;
        this.animationIndex = -1;

        //this.callbackPlayer = new CallbackPlayer(opts);
        //this.socket = new Socket(opts);
        this.drawPanel = new DrawPanel(opts, this);
        this.history = new History(opts, this);
        this.chatMessageCache = new ChatMessageCache();
        //广播
        this.broadcastCache = new BroadcastCache();
    };

    var callback = {};

    var options = {
        userId: $('#userId').val(),
        roomId: $('#roomId').val(),

        liveId: $('#liveId').val(),
        recordId: $('#recordId').val(),
        videoId: $('#videoId').val(),
        adapt: false,
        isShowBar: 0,
        viewerId: $('#viewerId').val(),
        upId: $('#upId').val(),
        // 观看者用户信息
        viewer: {
            id: $('#viewerId').val(),
            name: $('#viewerName').val(),
            role: $('#viewerRole').val(),
            sessionId: $('#sessionId').val()
        },

        // 直播播放器信息
        callbackPlayer: {
            id: 'playbackPlayer',
            width: '100%',
            height: '100%'
        },

        // 画板信息
        drawPanel: {
            id: 'playbackPanel',
            width: '100%',
            height: '100%'
        }
    };

    //极速文档模式
    var DWDpc = {
        dpc: {},
        fastMode: false,
        init: function () {
            this.dpc = new Dpc();
        },
        appendDrawPanel: function () {
            var dp = '<iframe id="dpa" allow-scripts allowfullscreen allowusermedia frameborder="0" style="width: 100%;height:100%;"></iframe>';
            if (MobileLive.isMobile() == 'isMobile') {
                dp = '<iframe id="dpa" allow-scripts allowfullscreen allowusermedia frameborder="0" style="width: 100%;height:100%;pointer-events: none;"></iframe>';
            }
            $('#playbackPanel').parent().append(dp);
            $('div#playbackPanel').remove();

            if (typeof window.on_cc_live_db_flip === 'function') {
                window.on_cc_live_db_flip();
            }
        },
        pageChange: function (pc) {
            if (!this.fastMode) {
                return;
            }
            this.dpc.pageChange(pc);
        },
        animationChange: function (ac) {
            if (!this.fastMode) {
                return;
            }
            this.dpc.animationChange(ac);
        },
        history: function (h) {
            if (!this.fastMode) {
                return;
            }
            this.dpc.history(h);
        },
        draw: function (d) {
            if (!this.fastMode) {
                return;
            }
            this.dpc.draw(d);
        },
        clear: function () {
            if (!this.fastMode) {
                return;
            }
            this.dpc.clear();
        }
    };

    function init(opts) {
        options.viewerId = opts.viewerid;
        options = $.extend(options, opts);
        callback = new Callback(options);
    }

    var DW = {
        isH5play: false,
        fastMode: false,
        setFastMode: function (opts) {
            if (typeof opts.fastMode == 'string') {
                if (opts.fastMode === 'false') {
                    this.fastMode = false;
                } else {
                    this.fastMode = true;
                }
            } else if (typeof opts.fastMode == 'boolean') {
                this.fastMode = opts.fastMode;
            } else {
                this.fastMode = false;
            }
        },
        // 初始化DW对象
        config: function (opts) {
            if (checkVideo()) {
                this.isH5play = opts.isH5play;
            }

            this.setFastMode(opts);
            DWDpc.fastMode = this.fastMode;

            var scriptArray = [
                '//static.csslcloud.net/js/socket.io.js',
                '//static.csslcloud.net/js/swfobject.js',
                '//static.csslcloud.net/js/json3.min.js',
                '//static.csslcloud.net/js/module/drawingBoard-2.0.0.js',
                '//static.csslcloud.net/js/module/drawingBoardPlayback.js',
                '//static.csslcloud.net/js/report.js'
            ];
            if (DWDpc.fastMode) {
                scriptArray.splice(3, 2);
            }

            this.loadScript(scriptArray, function () {
                init(opts);
                if (MobileLive.isMobile() == 'isMobile' && $.DrawingBoard && !DWDpc.fastMode) {
                    DW.appendDrawPanel();
                }
            });
        },
        appendDrawPanel: function () {
            var dp = '<canvas id="drawPanel" width="1200" height="1200" style="position: absolute;z-index:2;top:0;left: 0"></canvas>'
                + '<iframe id="dpa" src="" frameborder="0" style="position: absolute;top:0;left: 0"></iframe>';
            $('#playbackPanel').parent().append(dp);
            $('div#playbackPanel').remove();
        },
        logout: function () {
            $.ajax({
                url: '//view.csslcloud.net/api/callback/logout',
                type: 'GET',
                dataType: 'json',
                timeout: 5000,
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {
                },
                error: function (xhr, status, error) {
                }
            });
        },

        getScript: function (url, success) {

            var readyState = false,
                script = document.createElement('script');
            script.src = url;

            script.onload = script.onreadystatechange = function () {
                if (!readyState && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
                    readyState = true;
                    success && success();
                }
            };
            document.body.appendChild(script);

        },

        loadScript: function (res, callback) {

            if (typeof res === 'string') {
                var _res = res;
                res = [];
                res.push(_res);
            }
            var _this = this,
                queue = function (fs, cb) {
                    _this.getScript(fs.shift(), function () {
                        fs.length ? queue(fs, cb) : cb && cb();
                    });
                };

            queue(res, callback);

        },

        playbackRate: function (t) {
            callback.callbackPlayer.playbackRate(t);
        },

        seek: function (t) {
            clearInterval(callback.drawPanel.intervalNum);
            callback.callbackPlayer.seek(t);
        },

        getPlayerTime: function () {

            return callback.callbackPlayer.getPlayerTime();

        },

        getDuration: function () {
            if (DW.isH5play) {
                return MobileLive.getDuration();
            } else if (MobileLive.isMobile() == 'isMobile') {
                return MobileLive.getDuration();
            } else {
                return callback.callbackPlayer.getDuration();
            }
        },

        docAdapt: function (t) {
            options.adapt = t;
        },

        isShowBar: function (n) {
            options.isShowBar = n;
        },

        getBuffer: function () {
            return callback.callbackPlayer.getBuffer();
        },

        setVolume: function (n) {
            return callback.callbackPlayer.setVolume(n);
        },

        getVolume: function () {
            return callback.callbackPlayer.getVolume();
        },

        play: function () {
            return callback.callbackPlayer.play();
        },

        setZScale: function (s) {
            return callback.callbackPlayer.setZScale(s);
        },

        getZScale: function () {
            return callback.callbackPlayer.getZScale();
        },

        setScale: function (s) {
            return callback.callbackPlayer.setScale(s);
        },

        getScale: function () {
            return callback.callbackPlayer.getScale();
        },

        openSettingPanel: function () {
            return callback.callbackPlayer.openSettingPanel();
        }

    };

    $.extend({
        DW: DW
    });


    function isLivePlayerReady() {
        if (!callback.callbackPlayer.isReady) {
            setTimeout(function () {
                isLivePlayerReady();
            }, 500);
            return;
        }

        callback.drawPanel.intervalPainting(callback);
    }

    // 初始化画板数据
    function initDrawPanelInfo() {
        // 等待历史数据加载成功
        if (!callback.isHistoryReady) {
            setTimeout(function () {
                initDrawPanelInfo();
            }, 300);
            return;
        }

        isLivePlayerReady();
    }

    window.on_cc_callback_player = function (videoId) {
        options.videoId = videoId;
        callback.callbackPlayer = new CallbackPlayer(options);
    };

    // 播放器加载完成，开始播放
    window.on_cc_live_player_init = function () {
        callback.callbackPlayer.isReady = true;
        try {
            callback.callbackPlayer.getFlash().start();
        } catch (e) {
        }
        // 同时开始实时显示聊天信息
        setInterval(function () {
            var ft = 0;
            try {
                ft = callback.callbackPlayer.getPlayerTime();
            } catch (e) {
            }
            if (ft <= 0) {
                return;
            }

            if (!callback.chatLogs.length) {
                return;
            }

            var chatLog = callback.chatLogs[0];
            while (chatLog.time <= ft) {
                chatLog = callback.chatLogs.shift();

                callback.chatMessageCache.push({
                    userid: chatLog.userId,
                    username: chatLog.userName,
                    time: chatLog.time,
                    msg: chatLog.content,
                    useravatar: chatLog.userAvatar,
                    userRole: chatLog.userRole,
                    usercustommark: chatLog.userCustomMark
                });

                if (!callback.chatLogs.length) {
                    break;
                }

                chatLog = callback.chatLogs[0];
            }
        }, 1000);

        // 同时开始实时显示广播
        setInterval(function () {
            var ft = 0;
            try {
                ft = callback.callbackPlayer.getPlayerTime();
            } catch (e) {
            }
            if (ft <= 0) {
                return;
            }

            if (!callback.broadcasts.length) {
                return;
            }

            var broadcast = callback.broadcasts[0];
            while (broadcast.time <= ft) {
                broadcast = callback.broadcasts.shift();

                callback.broadcastCache.push({
                    content: broadcast.content,
                    time: broadcast.time
                });

                if (!callback.broadcasts.length) {
                    break;
                }

                broadcast = callback.broadcasts[0];
            }
        }, 1000);

        if (typeof window.on_cc_live_player_load === 'function') {
            window.on_cc_live_player_load();
        }
    };

    function cc_live_callback_chat_interval() {
        setInterval(function () {
            var ft = 0;
            try {
                ft = parseInt($('#playbackVideo')[0].currentTime, 10);
            } catch (e) {
            }
            if (ft <= 0) {
                return;
            }

            if (!window.CHATLOGS.length) {
                return;
            }

            var chatLog = window.CHATLOGS[0];

            while (chatLog.time <= ft) {
                var cl = window.CHATLOGS.shift();
                callback.chatMessageCache.push({
                    userid: cl.userId,
                    username: cl.userName,
                    time: cl.time,
                    msg: cl.content,
                    useravatar: cl.userAvatar,
                    userRole: cl.userRole,
                    usercustommark: cl.userCustomMark
                });
                if (!window.CHATLOGS.length) {
                    break;
                }
                chatLog = window.CHATLOGS[0];
            }

        }, 1000);
    }

    function cc_live_callback_broadcasts_interval() {
        setInterval(function () {
            var ft = 0;
            try {
                ft = parseInt($('#playbackVideo')[0].currentTime, 10);
            } catch (e) {
            }
            if (ft <= 0) {
                return;
            }

            //广播
            if (!window.BROADCASTS.length) {
                return;
            }

            var broadcast = window.BROADCASTS[0];

            while (broadcast.time <= ft) {
                var bc = window.BROADCASTS.shift();
                callback.broadcastCache.push({
                    content: bc.content,
                    time: bc.time
                });

                if (!window.BROADCASTS.length) {
                    break;
                }
                broadcast = window.BROADCASTS[0];
            }

        }, 1000);
    }

    // 画板Flash加载完成回调
    //window.on_drampanel_ready = function () {
    //    callback.drawPanel.isReady = true;
    //
    //    setTimeout(function () {
    //        initDrawPanelInfo();
    //    }, 1500);
    //};

    window.seekStart = function () {
        clearInterval(callback.drawPanel.intervalNum);
    };

    // 拖动时间轴或跳动播放成功后回调函数
    window.seekComplete = function () {
        callback.drawPanel.clear();
        //clearInterval(callback.drawPanel.intervalNum);

        var ft = callback.callbackPlayer.getPlayerTime();
        if (ft < 0) {
            ft = 0;
        }

        callback.pageChangeIndex = -1;
        callback.drawIndex = -1;
        callback.animationIndex = -1;

        var meta = {
            pageChange: [],
            animation: [],
            draw: []
        };

        if (callback.pageChanges && callback.pageChanges.length > 0) {
            for (var i = 0; i < callback.pageChanges.length; i++) {
                var pc = callback.pageChanges[i];
                if (ft >= pc.time) {
                    callback.pageChangeIndex = i;
                }
            }

            if (callback.pageChangeIndex >= 0) {
                var pc = callback.pageChanges[callback.pageChangeIndex];
                if (typeof window.on_cc_callback_page_change === 'function') {
                    window.on_cc_callback_page_change(pc);
                }
                callback.drawPanel.filp(JSON.stringify({
                    'fileName': pc.docName,
                    'totalPage': pc.docTotalPage,
                    'docid': pc.encryptDocId,
                    'url': pc.url,
                    'page': pc.pageNum,
                    'useSDK': pc.useSDK
                }));

                meta.pageChange.push(pc);
            }
        }

        if (callback.animations && callback.animations.length > 0) {
            for (var i = 0; i < callback.animations.length; i++) {
                var a = callback.animations[i];
                if (ft >= a.time) {
                    callback.animationIndex = i;
                }
            }

            if (callback.animationIndex >= 0) {
                var pidex = callback.pageChangeIndex;
                if (pidex >= 0) {
                    var pc = callback.pageChanges[pidex];
                    var a = callback.animations[callback.animationIndex];

                    if (!!pc && !!a && pc.encryptDocId == a.encryptDocId && ft >= a.time && pc.time <= a.time) {
                        callback.drawPanel.animation(JSON.stringify({
                            'fileName': a.docName,
                            'totalPage': a.docTotalPage,
                            'docid': a.encryptDocId,
                            'url': a.url,
                            'page': a.pageNum,
                            'step': a.step
                        }));

                        meta.animation.push(a);

                    }
                }
            }
        }

        if (callback.draws && callback.draws.length > 0) {
            for (var i = 0; i < callback.draws.length; i++) {
                var dc = callback.draws[i];
                if (ft >= dc.time) {
                    //callback.drawPanel.draw(dc.data);
                    callback.drawIndex = i;
                }
            }

            var ds = callback.draws.slice(0, (callback.drawIndex + 1));
            if (ds.length > 0) {
                var dcdatas = [];
                for (var i = 0; i < ds.length; i++) {
                    var dc = ds[i];
                    dcdatas.push(dc.data);
                    meta.draw.push(dc);
                }
                callback.drawPanel.draws(dcdatas);
            }
        }

        DWDpc.history(meta);

        callback.drawPanel.intervalNum = setInterval(function () {
            callback.drawPanel.interval();
        }, 1000);
    };

    //事件兼容处理
    var Event = {};
    Event.addEvents = function (target, eventType, handle) {
        if (document.addEventListener) {
            Event.addEvents = function (target, eventType, handle) {
                target.addEventListener(eventType, handle, false);
            };
        } else {
            Event.addEvents = function (target, eventType, handle) {
                target.attachEvent('on' + eventType, function () {
                    handle.call(target, arguments);
                });
            };
        }
        ;
        Event.addEvents(target, eventType, handle);
    };

    //video兼容处理
    function checkVideo() {
        if (!!document.createElement('video').canPlayType) {
            var vidTest = document.createElement('video');
            oggTest = vidTest.canPlayType('video/ogg; codecs="theora, vorbis"');
            if (!oggTest) {
                h264Test = vidTest.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
                if (!h264Test) {
                    return false;
                }
                else {
                    if (h264Test == 'probably') {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
            else {
                if (oggTest == 'probably') {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        else {
            return false;
        }
    }


    var MobileLive = {
        pauseState: false,
        init: function (opts) {
            var _this = this;
            $.ajax({
                url: '//view.csslcloud.net/api/vod/play/mobile',
                type: 'GET',
                dataType: 'jsonp',
                data: {userid: opts.userId, videoid: opts.videoId},
                success: function (data) {
                    var pvdefault = data.video[0];

                    var playurl = pvdefault.playurl;
                    var secureplayurl = pvdefault.secureplayurl;

                    var isHttps = window.location.protocol === 'https:';
                    if (isHttps && !!secureplayurl) {
                        playurl = secureplayurl;
                    }

                    _this.appendVideo(playurl, opts);
                }
            });
        },

        appendVideo: function (s, opts) {
            var _this = this;

            var v = '<video id="playbackVideo" webkit-playsinline playsinline controls autoplay x-webkit-airplay="deny" x5-playsinline width="100%" height="100%" src="' + s + '"></video>';
            $('#' + playbackPlayer.id).html(v);
            var video = document.getElementById('playbackVideo');
            if (opts.isShowBar) {
                video.removeAttribute('controls');
            }

            var isMobie = 0;
            var ua = 1;
            if (MobileLive.isMobile() == 'isMobile') {
                isMobie = 1;
                ua = 11;
            }
            var report = new ReportLog(opts, isMobie, ua, video, false);
            if (!this.isAndroid()) {
                this.pauseState = true;
            }

            Event.addEvents(video, 'canplay', function () {
                if (MobileLive.isMobile() == 'isMobile') {
                    window.on_cc_live_player_load && window.on_cc_live_player_load();
                    window.on_cc_h5_player_load && window.on_cc_h5_player_load();
                } else if (DW.isH5play) {
                    window.on_cc_live_player_init && window.on_cc_live_player_init();
                }
            }, false);

            Event.addEvents(video, 'playing', function () {
                _this.pauseState = false;
                window.on_player_start && on_player_start();
                window.on_spark_player_resume && on_spark_player_resume();
            }, false);

            Event.addEvents(video, 'pause', function () {
                _this.pauseState = true;
                window.on_spark_player_pause && on_spark_player_pause();
            }, false);

            Event.addEvents(video, 'ended', function () {
                window.on_spark_player_end && on_spark_player_end();
            }, false);

            Event.addEvents(video, 'seeking', function () {
                seekStart && seekStart();
            }, false);

            Event.addEvents(video, 'seeked', function () {
                seekComplete && seekComplete();
            }, false);
        },

        getDuration: function () {
            var v = document.getElementById('playbackVideo');
            if (!v) {
                return;
            }
            return Math.floor(v.duration);
        },

        getPlayerTime: function () {
            var v = document.getElementById('playbackVideo');
            if (!v) {
                return;
            }
            return Math.floor(v.currentTime);
        },

        end: function () {
            $('#' + playbackPlayer.id).html('end');
        },

        appendDoc: function (s) {
            var img = '<img src="' + s + '" />';
            $('#' + playbackPanel.id).append(img);
        },

        isMobile: function () {
            if (this.isIPad() || this.isIPhone() || this.isAndroid() || this.isWindowsPhone()) {
                return 'isMobile';
            }
        },

        isIPad: function () {
            return navigator.userAgent.match(/iPad/i) != null;
        },

        isIPhone: function () {
            return navigator.userAgent.match(/iPhone/i) != null;
        },

        isAndroid: function () {
            return navigator.userAgent.match(/Android/i) != null;
        },

        isWindowsPhone: function () {
            return navigator.userAgent.match(/Windows Phone/i) != null;
        }

    };


})(jQuery, window, document, undefined);