/**
 * Created by shanglt on 15/12/10.
 */
$(function () {
    Template.init();
});

var datas = [];

function on_cc_live_player_load() {
    //console.log('load');
    //var img = "<img src='" + datas[1].url  + "' >";
    //$('#chat-list').append(img);
}

// 接收全部聊天信息
// function on_cc_live_chat_msg(data) {
//    $('#chat-list').append(Template.chatMsg({
//        name: data.username,
//        content: showEm(data.msg)
//    }));
//
//    chatScroll();
// }

// 同步接收聊天信息
function on_cc_live_chat_msg_sync(datas) {
    var cmHtml = "";

    $.each(datas, function (index, data) {
        if (data.groupId === $.DW.groupId || !$.DW.groupId || !data.groupId) {
            cmHtml += Template.chatMsg({
                name: data.username,
                chatId: data.chatId,
                status: data.status,
                content: showEm(data.msg)
            });
        }

    });

    var rc = $("#chat-list").children().length - 500 + datas.length;
    if (rc > 0) {
        $("#chat-list> li:lt(" + rc + ")").remove();
    }

    $("#chat-list").append(cmHtml);

    chatScroll();
}

// 接收发送私聊
function on_cc_live_chat_private_question(data) {
    $("#chat-list").append(Template.privateChatMsg({
        fromUserName: data.username,
        toUserName: "管理员",
        content: showEm(data.msg)
    }));

    chatScroll();
}

// 接收回答私聊
function on_cc_live_chat_private_answer(data) {
    $("#chat-list").append(Template.privateChatMsg({
        fromUserName: "管理员",
        toUserName: data.tousername,
        content: showEm(data.msg)
    }));

    chatScroll();
}

// 提问
function on_cc_live_qa_question(data) {
    var question = data.value;
    if (question.groupId === $.DW.groupId || !$.DW.groupId || !question.groupId) {
        $("#qas").append(Template.question({
            id: question.id,
            questionUserId: question.userId,
            questionUserName: question.userName,
            content: question.content
        }));
    }

    qaScroll();
}

// 回答
function on_cc_live_qa_answer(data) {

    var answer = data.value;
    if (answer.groupId === $.DW.groupId || !$.DW.groupId || !answer.groupId) {
        // 私密回答只能自己看
        if (answer.isPrivate) {
            return;
        }

        $("#" + answer.questionId).append(Template.answer({
            answerUserName: answer.userName,
            content: answer.content
        }));
    }


    qaScroll();
}

function on_cc_callback_pages(data) {
    //{
    //    "time": 11,  图片时间
    //    "url": "http://image.csslcloud.net/image/3CD4C4DF4DF8E0CB9C33DC5901307461/73D088D5AC02E6B1/0.jpg",  图片地址
    //    "docId": "73D088D5AC02E6B1",  文档ID
    //    "docName": "英语.pptx",  文档名称
    //    "docTotalPage": 11,  文档总页数
    //    "pageNum": 0,  当前页码
    //    "encryptDocId": "73D088D5AC02E6B1",  文档ID
    //    "useSDK": false
    //}
    // console.log(data);
    datas = data;
}

var Template = {
    init: function () {
        if ($("#chatMsgTemplate").length) {
            this.chatMsg = Handlebars.compile($("#chatMsgTemplate").html());
        }
        if ($("#privateChatMsgTemplate").length) {
            this.privateChatMsg = Handlebars.compile($("#privateChatMsgTemplate").html());
        }
        if ($("#questionTemplate").length) {
            this.question = Handlebars.compile($("#questionTemplate").html());
        }
        if ($("#answerTemplate").length) {
            this.answer = Handlebars.compile($("#answerTemplate").html());
        }
    }
};


var Viewer = {
    id: $("#viewerId").val(),
    name: $("#viewerName").val(),
    role: $("#viewerRole").val(),
    sessionId: $.cookie("sessionid"),
    isMe: function (viwerId) {
        return viwerId == this.id;
    }
};

function chatScroll() {
    $("#chat-list").parent().scrollTop($("#chat-list").height());
}

function qaScroll() {
    $("#qas").parent().scrollTop($("#qas").height());
}

//翻页信息
function on_cc_callback_pagechange(j) {
    // console.log("on_cc_callback_pagechange", j);
};

//接受全部广播消息
function on_cc_live_broadcast_msg(data) {
    // console.log("on_cc_live_broadcast_msg", data);
}

//接受广播消息
function on_cc_live_broadcast_msg_sync(datas) {
    // console.log("on_cc_live_broadcast_msg_sync", datas);
    var cmHtml = "";
    $.each(datas, function (index, data) {
        cmHtml += "<li class=\"msg-admin\">系统消息：" + data.content + " </li>";
    });

    $("#chat-list").append(cmHtml);

    $("#chat-list").parent().scrollTop($("#chat-list").height());
}

//视频控制器

//播放暂停

var isPlay = false;

$("#btn-play").click(function () {
    $.DW.play();
});
$("#btn-play").mouseover(function () {
    if (isPlay) {
        $(this).css("background", "url(images/newLive/icon-playbar.png) no-repeat -8px -120px");
    } else {
        $(this).css("background", "url(images/newLive/icon-playbar.png) no-repeat -8px -170px");
    }
});
$("#btn-play").mouseout(function () {
    if (isPlay) {
        $(this).css("background", "url(images/newLive/icon-playbar.png) no-repeat -8px -70px");
    } else {
        $(this).css("background", "url(images/newLive/icon-playbar.png) no-repeat -8px -220px");
    }
});

//倍速播放
$("#btn-rate").mouseover(function () {
    $(".rate").css("border", "1px solid #ff920a");
    $(".btn-rate").css("color", "#ff920a");
});
$("#btn-rate").mouseout(function () {
    $(".rate").css("border", "1px solid #999999");
    $(".btn-rate").css("color", "#999999");
});
var toggleSelect = false;
$("#btn-rate").click(function () {
    if (toggleSelect) {
        $(".select").css("display", "none");
    } else {
        $(".select").css("display", "block");
    }
    toggleSelect = !toggleSelect;
});

var index = 1;
var tag = "正常";
$(".select li a").eq(1).css("color", "#ff920a");
$("#select li").each(function (index) {
    $(this).click(function () {
        switch ($(this).val()) {
            case 0:
                index = 0.8;
                tag = "0.8X";
                break;
            case 1:
                index = 1;
                tag = "正常";
                break;
            case 2:
                index = 1.25;
                tag = "1.25X";
                break;
            case 3:
                index = 1.5;
                tag = "1.5X";
                break;
            case 4:
                index = 2.0;
                tag = "2.0X";
                break;
        }
        $(".select").css("display", "none");
        $(".select li a").each(function () {
            $(this).css("color", "");
        });
        $(".select li a").eq($(this).val()).css("color", "#ff920a");
        $("#btn-rate").html(tag);
        $.DW.playbackRate(index);
    });
});

//音量
var volume = 1;
var volumeRecord = 1;
$("#btn-volume").click(function () {
    if (volume) {
        volume = 0;
        $(this).css("background", "url(images/newLive/icon-playbar.png) no-repeat -134px -175px");
        $(".v-progress").eq(0).css("width", volume * 100 + "%");
        $(".v-dot").eq(0).css("left", 0 + "px");
    } else {
        volume = volumeRecord;
        $(this).css("background", "url(images/newLive/icon-playbar.png) no-repeat -134px -125px");
        $(".v-progress").eq(0).css("width", volume * 100 + "%");
        $(".v-dot").eq(0).css("left", (66 * volume) + "px");
    }
    $.DW.setVolume(volume);
});

$("#btn-volume").mouseover(function () {
    if (volume) {
        $(this).css("background", "url(images/newLive/icon-playbar.png) no-repeat -134px -125px");
    } else {
        $(this).css("background", "url(images/newLive/icon-playbar.png) no-repeat -134px -175px");
    }
});
$("#btn-volume").mouseout(function () {
    if (volume) {
        $(this).css("background", "url(images/newLive/icon-playbar.png) no-repeat -134px -75px");
    } else {
        $(this).css("background", "url(images/newLive/icon-playbar.png) no-repeat -134px -225px");
    }
});

//slider
scale = function (opts) {
    this.btn = document.getElementById(opts.dot);
    this.bar = document.getElementById(opts.slider);
    this.pro = document.getElementById(opts.pro);
    this.initPercent = parseInt(opts.initPercent);
    this.mousedown = opts.mousedown;
    this.mousemove = opts.mousemove;
    this.mouseup = opts.mouseup;
    this.init();
};
scale.prototype = {
    init: function () {
        var f = this, g = document, b = window, m = Math;
        var max = f.bar.offsetWidth - f.btn.offsetWidth;
        f.btn.style.left = max / 100 * this.initPercent + "px";
        f.pro.style.width = this.initPercent + "%";

        f.e = {percent: 0};
        f.btn.onmousedown = function (e) {
            var x = (e || b.event).clientX;
            var l = this.offsetLeft;
            var max = f.bar.offsetWidth - this.offsetWidth;
            f.mousedown(f.e);
            g.onmousemove = function (e) {
                var thisX = (e || b.event).clientX;
                var to = m.min(max, m.max(0, l + (thisX - x)));
                f.btn.style.left = to + "px";
                f.pro.style.width = parseInt(to * 100 / max) + "%";
                var e = {percent: to * 100 / max};
                f.e = e;
                f.mousemove(f.e);
                //此句代码可以除去选中效果
                b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
            };
            g.onmouseup = function () {
                f.mouseup(f.e);
                this.onmousemove = null;
                this.onmouseup = null;

            };
        };
    }
};

//音量
new scale({
    dot: "v-dot",
    slider: "volume-slider",
    pro: "v-progress",
    initPercent: 100,
    mousedown: function (e) {

    },
    mousemove: function (e) {
        volumeRecord = parseFloat((e.percent / 100).toFixed(1));
    },
    mouseup: function (e) {
        $.DW.setVolume(volumeRecord);
        if (volumeRecord) {
            $(".btn-volume").css("background", "url(images/newLive/icon-playbar.png) no-repeat -134px -75px");
        } else {
            $(".btn-volume").css("background", "url(images/newLive/icon-playbar.png) no-repeat -134px -225px");
        }
    }
});

//视频进度
var toggleProgress = true;
$(".l-m-b").mouseover(function () {
    if (toggleProgress) {
        $("#dot").css("display", "block");
    }
});
$(".l-m-b").mouseout(function () {
    if (toggleProgress) {
        $("#dot").css("display", "none");
    }
});

new scale({
    dot: "dot",
    slider: "progress-box",
    pro: "progress",
    initPercent: 0,
    mousedown: function (e) {
        toggleProgress = false;
    },
    mousemove: function (e) {

    },
    mouseup: function (e) {
        toggleProgress = true;
        var seek = $.DW.getDuration() * parseInt(e.percent) / 100;
        // console.log(seek);
        $.DW.seek(seek);
    }
});

function playTimerCallback() {
    if (!toggleProgress) {
        return;
    }
    var progress = $.DW.getPlayerTime() / $.DW.getDuration();
    var buffer = $.DW.getBuffer() / $.DW.getDuration();
    $("#progress").css("width", progress * 100 + "%");

    $("#buffer").css("width", buffer * 100 + "%");
    $("#dot").css("left", progress * 869 + "px");
    $(".time span").eq(0).html(sec_to_time(parseInt($.DW.getPlayerTime())));
    $(".time span").eq(1).html(sec_to_time($.DW.getDuration()));
}

function sec_to_time(s) {
    var t = "";
    if (s > -1) {
        var hour = Math.floor(s / 3600);
        var min = Math.floor(s / 60) % 60;
        var sec = s % 60;
        if (s >= 3600) {
            if (hour < 10) {
                t = "0" + hour + ":";
            } else {
                t = hour + ":";
            }
        }
        if (min < 10) {
            t += "0";
        }
        t += min + ":";
        if (sec < 10) {
            t += "0";
        }
        t += sec;
    }
    return t;
}

function on_cc_live_player_load() { // 播放器加载完成
    // console.log("视频总时长:", $.DW.getDuration()); // 获取视频总时长
    var playTimer = setInterval(playTimerCallback, 500);

    setTimeout(function () {
        isPlay = !($("#playbackVideo")[0].paused);
        // console.log("isPlay", isPlay);
    }, 500);
}

function on_player_start() { // 播放开始
    // console.log("播放开始");
    isPlay = true;
    $("#btn-play").css("background", "url(images/newLive/icon-playbar.png) no-repeat -8px -70px");
    // 播放后再把视频缩小
}

function on_spark_player_pause() { // 播放暂停
    // console.log("播放暂停");
    isPlay = false;
    $("#btn-play").css("background", "url(images/newLive/icon-playbar.png) no-repeat -8px -170px");
}

function on_spark_player_resume() { // 恢复播放
    // console.log("恢复播放");
    isPlay = true;
    $("#btn-play").css("background", "url(images/newLive/icon-playbar.png) no-repeat -8px -70px");
}

function on_spark_player_end() { // 播放停止
    console.log("播放停止");
    isPlay = false;
    $("#btn-play").css("background", "url(images/newLive/icon-playbar.png) no-repeat -8px -170px");
}