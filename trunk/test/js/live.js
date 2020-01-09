$(function () {

    // 开始直播
    DWLive.onLiveStart = function (j) {
        // console.log(j);
    };

    window._onStart = function () {
        console.log('直播中----');
    };

    // 停止直播
    DWLive.onLiveEnd = function (j) {
        console.log(j);
        DWLive.hangupInteraction();

        setTimeout(function () {
            $('li[name="interaction"]').hide();
        }, 1500);
    };

    // 在线人数
    DWLive.onUserCountMessage = function (j) {
        // console.log(j);
    };

    // 开始直播后显示公告
    DWLive.onAnnouncementShow = function (j) {
        console.log('公告:', j);
    };

    // 修改公告,发布公告
    DWLive.onAnnouncementRelease = function (j) {
        console.log(j);
    };

    // 删除公告
    DWLive.onAnnouncementRemove = function (j) {
        console.log(j);
    };

    // 系统消息
    DWLive.onBroadcastMsg = function (data) {
        var h = '<li class="msg-admin">系统消息：' + data.content + ' </li>';
        $('#chat-list').append(h);

        $('#chat-list').parent().scrollTop($('#chat-list').height());
    };

    // 设置音量
    $('.set-sound').click(function () {
        DWLive.setSound(0.5);  // 设置音量(0-1)
    });

    // 弹幕开关
    $('.open-barrage').click(function () {
        DWLive.openBarrage(true);  // 打开弹幕
    });

    // 隐藏控制条
    $('.hide-control').click(function () {
        DWLive.showControl(false);  // 隐藏控制条
    });

    // 接收公聊
    DWLive.onPublicChatMessage = function (j) {
        var o = JSON.parse(j);
        var d = '';
        if (o.userid != DWLive.viewerid) {
            d +='<li status="'+o.status+'" chatId="'+o.chatId+'" class="clearfix" name="' + o.username + '" uid="' + o.userid + '">'
        }else{
            d +='<li  class="clearfix" name="' + o.username + '" uid="' + o.userid + '">'
        }
            d += '<div class="peo-infos">'
            + '<p class="peo-names">'
            + '<span class="p-n-names"><span class="name-tip">' + o.username + '</span></span>'
            + '<i class="peo-icons "></i>'
            + '</p>'
            + '<div class="hide" name="tipBtn">'
            + '<ul class="btnul">'
            + '<li name="whisper">私聊</li>'
            + '</ul>'
            + '<span class="btnul-arrow"></span>'
            + '</div>'
            + '</div>'
            + '<div class="peo-chat">'
            + '<i class="icons"></i>'
            + '<p class="chat-content">' + showEm(o.msg) + '</p>'
            + '</div>'
            + '</li>';
        if (o.groupId == DWLive.groupId || !o.groupId || !DWLive.groupId) {
            $('#chat-list').append(d);

            $('#chat-list').parent().scrollTop($('#chat-list').height());

            if (o.userid === DWLive.viewerid) {
                $('#chat-list li[uid = ' + o.userid + ']').addClass('me');
            }
            DWLive.barrage(o.msg); // 发送弹幕
        }
    };

    //隐藏部分聊天
    DWLive.onPublicChatLogManage = function (j) {
        var chatInfo= JSON.parse(j);
        var status = chatInfo.status;
        var chatIds=chatInfo.chatIds;
        $.each(chatIds,function (index,data) {
            var cId='[chatId='+ data+']';
            $(cId).attr('status',status);
        });
        $('#chat-list').parent().scrollTop($('#chat-list').height());
    };
    // 接收私聊
    DWLive.onPrivateChatMessage = function (j) {
        var o = JSON.parse(j);
        var d = '<li name="' + o.fromusername + '">'
            + '<div class="peo-infos">'
            + '<p class="peo-names">'
            + '<span class="p-n-names">' + o.fromusername + '&nbsp;对&nbsp;' + o.tousername + '&nbsp;说</span>'
            + '<i class="peo-icons "></i>'
            + '</p>'
            + '</div>'
            + '<div class="peo-chat">'
            + '<i class="icons"></i>'
            + '<p class="chat-content pchat">' + showEm(o.msg) + '</p>'
            + '</div>'
            + '</li>';
        $('#chat-list').append(d);

        $('#chat-list').parent().scrollTop($('#chat-list').height());

        if (o.fromusername == DWLive.viewername) {
            $('#chat-list li[name = ' + o.fromusername + ']').addClass('me');
        }
    };

    // 接收私聊回复
    DWLive.onPrivateAnswer = function (j) {
        var o = JSON.parse(j);
        var d = '<li name="' + o.fromusername + '">'
            + '<div class="peo-infos">'
            + '<p class="peo-names">'
            + '<span class="p-n-names">' + o.fromusername + '&nbsp;对&nbsp;' + o.tousername + '&nbsp;说</span>'
            + '<i class="peo-icons "></i>'
            + '</p>'
            + '</div>'
            + '<div class="peo-chat">'
            + '<i class="icons"></i>'
            + '<p class="chat-content pchat">' + showEm(o.msg) + '</p>'
            + '</div>'
            + '</li>';
        $('#chat-list').append(d);

        $('#chat-list').parent().scrollTop($('#chat-list').height());

    };


    // 发布问题
    DWLive.onQaPublish = function (data) {
        var $q = $('#' + data.value.questionId).attr('isPublish', '1');
        // 只看自己的问答
        if (!$('#only-me i').hasClass('active')) {
            $q.show();
        }
    };
    DWLive.onBanChat = function (j) {
        console.log('您已被禁言'+j);
    }
    DWLive.onUnBanChat = function (j) {
        console.log('您已解禁'+j);
    }
    // 提问
    DWLive.onQuestion = function (j) {
        var o = JSON.parse(j);
        var qid = o.value.id;
        var question=o.value;
        // 提问者
        var isFromMe = Viewer.isMe(o.value.userId);
        // 只看自己的问答
        var isOnlyMyOwnQas = $('#only-me i').hasClass('active');
        // 问题已发布
        var isPublish = o.value.isPublish === 1;

        var d = '<li id="' + qid + '" isPublish self>'
            + '<div class="peo-infos">'
            + '<p class="peo-names">'
            + '<span class="p-n-names">' + o.value.userName + '</span>'
            + '<i class="peo-icons"></i>'
            + '</p>'
            + '</div>'
            + '<div class="peo-chat">'
            + '<p class="chat-content">' + o.value.content + '</p>'
            + '</div>'
            + '</li>';
        if (question.groupId == DWLive.groupId || !question.groupId || !DWLive.groupId) {
            $('#question-main').append(d);
            $('#question-main').parent().scrollTop($('#question-main').height());

            if (o.value.userName !== DWLive.viewername) {
                $('#' + qid).addClass('not-mines');
            }
        }
    };

    // 接收回答
    DWLive.onAnswer = function (j) {
        console.log(j);
        var o = JSON.parse(j);
        var answer = o.value;
        // 私密回答只能自己看
        if (answer.questionUserId !== DWLive.viewerid && answer.isPrivate) {
            return;
        }
        var qid = o.value.questionId;
        var d = '<div class="peo-repeat">'
            + '<p class="teacher-name">'
            + '<i></i>' + o.value.userName + ''
            + '</p>'
            + '<p class="repeat-content">' + o.value.content + '</p>'
            + '</div>';
        if (answer.groupId == DWLive.groupId || !answer.groupId || !DWLive.groupId) {
            $('#' + qid).append(d).show();
            $('#question-main').parent().scrollTop($('#question-main').height());
        }
    };

    var Viewer = {
        isMe: function (viwerId) {
            return viwerId === DWLive.viewerid;
        }
    };
    //随堂测功能
    DWLive.onPracticePublishStop = function (j) {

    };
    //关闭随堂测功能
    DWLive.onPracticeClose = function (j) {

    };
    //发布随堂测功能
    DWLive.onPracticePublish = function (j) {

    };
    // 发布奖杯
    DWLive.onPrizeSend = function(j){
        console.log('奖杯信息：' + j)
    };
    // 禁言
    DWLive.onInformation = function (j) {
        var chat = $('#chat-content'),
            chatX = chat.offset().left,
            chatY = chat.offset().top;
        tips(chatX, chatY, '您已经被禁言！');
        return;
    };

    var chatTime = 0;

    function chatSend() {

        if (chatTime > 0) {
            return;
        } else {
            chatTime = 10;
            var t = setInterval(function () {
                $('#chat-submit').html(chatTime);
                chatTime--;
                if (chatTime <= 0) {
                    $('#chat-submit').html('发送');
                    clearInterval(t);
                }
            }, 1000);
        }

        var msg = Tools.formatContent($.trim($('#chat-content').val()));

        if (!msg) {
            var chat = $('#chat-content'),
                chatX = chat.offset().left,
                chatY = chat.offset().top;
            tips(chatX, chatY, '请输入您的聊天内容！');
            return;
        }

        if (msg.length > 300) {
            tips(chatX, chatY, '聊天不能超过300个字符');
            return;
        }

        var nmsg = '';
        $.each(msg.split(' '), function (i, n) {
            var ur = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
            if (ur.test(n)) {
                nmsg += '[uri_' + n + '] ';
            } else {
                nmsg += n + ' ';
            }
        });

        var touserid = $('.select-current').attr('id');
        var tousername = $('.select-current').html();
        if (touserid == 'all') {
            DWLive.sendPublicChatMsg(nmsg); // 发送公聊
        } else {
            DWLive.sendPrivateChatMsg(touserid, tousername, nmsg); // 发送私聊
        }

        $('#chat-content').val('').focus();
    }

    $('#chat-submit').click(function () {
        chatSend();
    });

    $('#chat-content').bind('keypress', function (e) {
        if (e.keyCode == 13) {
            chatSend();
        }
    });

    function qaSend() {
        var qa = $('#question-content');
        var msg = Tools.formatContent($.trim(qa.html()));
        var chatX = qa.offset().left,
            chatY = qa.offset().top;

        if (!msg) {
            tips(chatX, chatY, '请输入您的问题！');
            return;
        }

        if (msg.length > 300) {
            tips(chatX, chatY, '问题不能超过300个字符');
            return;
        }

        DWLive.sendQuestionMsg(msg); // 发送问题

        $('#question-content').html('').focus();
    }

    $('#question-submit').click(function () {
        qaSend();
    });

    $('#question-content').bind('keypress', function (e) {
        if (e.keyCode == 13) {
            qaSend();
        }
    });

    function tips(chatX, chatY, msg) {
        $('#input-tips').find('p').text(msg);
        $('#input-tips').css({'left': chatX, 'top': (chatY - 42)}).stop(1, 1).fadeIn(200).delay(1500).fadeOut(200);
    }

    //对老师说
    $('#to-teacher').bind('click', function () {
        if (!$(this).find('i').hasClass('active')) {
            $(this).find('i').addClass('active');
            $(this).attr('for', 'teacher');
        } else {
            $(this).find('i').removeClass('active');
            $(this).attr('for', 'all');
        }
    });


    // 私聊
    $('#private-name').on('click', 'li', function () {
        var uid = $(this).attr('id'),
            uname = $(this).html();
        $('.select-current').attr('id', uid).html(uname);
    });

    $('.select-span').click(function (e) {
        $('#private-name').toggle();
        $(this).toggleClass('select-active');
        $(document).one('click', function () {
            $('#private-name').hide();
            $('.select-span').removeClass('select-active');
        });
        e.stopPropagation();
    });

    // 聊天页面浮出框
    $(document).on('click', 'ul[id="chat-list"] li span.name-tip', function (e) {
        var $thisTipBtn = $(this).parent().parent().next('div[name="tipBtn"]');
        if (!$thisTipBtn.is(':hidden')) {
            $thisTipBtn.hide();
            e.stopPropagation();
            return;
        }

        $('div[name="tipBtn"]').hide();
        var $li = $(this).parent().parent().parent().parent();
        if (!$li.find('div[name="tipBtn"]').length) {
            return;
        }

        if ($(this).html() == DWLive.viewername) {
            return;
        }

        $li.find('div[name="tipBtn"]').show();
        $(document).one('click', function () {
            $('div[name="tipBtn"]').hide();
        });

        e.stopPropagation();
    });

    // 点击浮出屏蔽按钮
    $(document).on('click', 'ul[id="chat-list"] li li', function () {
        var $t = $(this);
        var action = $t.attr('name');
        var $li = $(this).parent().parent().parent().parent();
        var uid = $li.attr('uid');
        var username = $li.find('.name-tip').html();

        tipBtnHanle(action, uid, username);

        $('div[name="tipBtn"]').hide();
    });

    function tipBtnHanle(action, uid, uname) {
        if (action == 'whisper') {
            $('#private-name').prepend('<li id="' + uid + '" title="' + uname + '">' + uname + '</li>');
            $('.select-current').attr('id', uid).html(uname);
            $('#chat-content').focus();

            var option = $('#private-name').find('li[id="' + uid + '"]');
            if (option.length > 1) {
                option.eq(0).remove();
            }

        }
    }

    // 签到
    DWLive.onStartRollCall = function (data) {
        if (window.ROLLCALL_INTERVAL_TIMER > 0) {
            clearInterval(window.ROLLCALL_INTERVAL_TIMER);
            window.ROLLCALL_INTERVAL_TIMER = -1;
        }

        var rid = data.rollcallId,
            pid = data.publisherId,
            time = data.duration;
        $('.signtxt').html('签到倒计时: <span id="signtime">00:00</span>').css('margin-top', '75px');
        $('.signbtn button').show();
        $('#signtime').text(timeFormat(time));
        $('.sign').show();
        $('.signbtn button').click(function () {
            DWLive.answerRollcall(rid, pid);
            $('.sign').hide();

            if (window.ROLLCALL_INTERVAL_TIMER > 0) {
                clearInterval(window.ROLLCALL_INTERVAL_TIMER);
                window.ROLLCALL_INTERVAL_TIMER = -1;
            }
        });

        window.ROLLCALL_INTERVAL_TIMER = setInterval(function () {
            if (time > 1) {
                time--;
                $('#signtime').text(timeFormat(time));
            } else {
                $('.signtxt').html('签到结束').css('margin-top', '90px');
                $('.signbtn button').hide();
                setTimeout(function () {
                    $('.sign').hide();
                }, 2000);
                if (window.ROLLCALL_INTERVAL_TIMER > 0) {
                    clearInterval(window.ROLLCALL_INTERVAL_TIMER);
                    window.ROLLCALL_INTERVAL_TIMER = -1;
                }
            }
        }, 1000);
    };

    function timeFormat(time) {
        var t = parseInt(time),
            h, i, s;
        h = Math.floor(t / 3600);
        h = h ? (h + ':') : '';
        i = h ? Math.floor(t % 3600 / 60) : Math.floor(t / 60);
        s = Math.floor(t % 60);
        i = i > 9 ? i : '0' + i;
        s = s > 9 ? s : '0' + s;
        return (h + i + ':' + s);
    }


    // 开始抽奖
    var win = false,
        stop = false;
    DWLive.onStartLottery = function () {
        stop = false;
        $('.lottery').show();
        $('.lotterybox').hide();
        if (win == true) {
            $('.lotteryh3').html('恭喜您中奖啦');
        } else {
            $('.lotteryh3').html('正在抽奖');
        }
    };

    // 中奖
    DWLive.onWinLottery = function (data) {
        var code = data.lotteryCode,
            name = data.viewerName;
        if (data.viewerId == DWLive.viewerid) {
            $('.lotterynum').html(code);
            $('.lotterybox').hide();
            $('.lotterynum, .lotterytext, .lottery').show();
            $('.lotteryh3').html('恭喜您中奖啦');
            $('.lotterynum, .lotterytext').css('z-index', 9);
            win = true;
        } else {
            $('.lotteryname').html(name);
            $('.lotterybox, .lottery').show();
            if (win == true) {
                $('.lotteryh3').html('恭喜您中奖啦');
            } else {
                $('.lotteryh3').html('哎呀，就差一点');
            }
            setTimeout(function () {
                $('.lotterybox').hide();
                if (win == true) {
                    $('.lotteryh3').html('恭喜您中奖啦');
                } else {
                    $('.lotteryh3').html('正在抽奖');
                }
            }, 2000);
        }
    };

    $('.lotteryclose').click(function () {
        if (win == true) {
            if (stop == true) {
                $('.lottery').hide();
            }
            $('.lotterynum, .lotterytext').hide();
            $('.lotteryh3').html('正在抽奖');
            win = false;
        } else {
            $('.lottery').hide();
        }
    });

    // 结束抽奖
    DWLive.onStopLottery = function () {
        stop = true;
        if (win == false) {
            setTimeout(function () {
                $('.lottery').hide();
            }, 2000);
        }
    };


    // 答题
    var option = '';
    window.voteOptions = [];
    DWLive.onStartVote = function (data) {
        option = '';
        window.voteOptions = [];

        var voteid = data.voteId;
        var pid = data.publisherId;
        var count = data.voteCount;
        var voteType = data.voteType;

        if (count == 5) {
            $('.vote-option').append('<li>A<span></span></li><li>B<span></span></li><li>C<span></span></li><li>D<span></span></li><li>E<span></span></li>');
            $('.vote-option').css('padding-left', 10);
            $('.vote-option li').css('margin-right', 7);
            $('.vote-option li:last-child').css('margin-right', 0);
            $('#vote1').append('<div class="votebtn"><button>提交</button></div>');
        }
        if (count == 4) {
            $('.vote-option').append('<li>A<span></span></li><li>B<span></span></li><li>C<span></span></li><li>D<span></span></li>');
            $('.vote-option').css('padding-left', 28);
            $('.vote-option li').css('margin-right', 15);
            $('#vote1').append('<div class="votebtn"><button>提交</button></div>');
        }
        if (count == 3) {
            $('.vote-option').append('<li>A<span></span></li><li>B<span></span></li><li>C<span></span></li>');
            $('.vote-option').css('padding-left', 50);
            $('.vote-option li').css('margin-right', 25);
            $('#vote1').append('<div class="votebtn"><button>提交</button></div>');
        }
        if (count == 2) {
            $('.vote-option').append('<li>A<span></span></li><li>B<span></span></li>');
            $('.vote-option li').eq(0).addClass('vote-r');
            $('.vote-option li').eq(1).addClass('vote-w');
            $('.vote-option').css('padding-left', 80);
            $('.vote-option li').css('margin-right', 40);
            $('#vote1').append('<div class="votebtn"><button>提交</button></div>');
        }
        $('.vote-option li:last-child').addClass('last-item');
        $('.vote').show();
        $('#vote1').show();
        $('#vote2').hide();
        $('.vote-list').empty();

        $('.vote-option li').click(function () {
            var index = $('.vote-option li').index(this);

            if (voteType == 1) { // 多选题
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                } else {
                    $(this).addClass('active');
                }

                window.voteOptions = [];
                $('.vote-option li').each(function (index, data) {
                    if ($(data).hasClass('active')) {
                        window.voteOptions.push(index);
                    }
                });
            } else {
                $(this).addClass('active').siblings().removeClass('active');
            }

            $('.votebtn button').css('opacity', 1);
            option = index;
        });
        $('.votebtn button').click(function () {
            if ($('.vote-option li').hasClass('active')) {
                if (voteType == 1) { // 多选题
                    DWLive.replyVote(voteid, voteOptions, pid);
                } else {
                    DWLive.replyVote(voteid, option, pid);
                }

                $('.vote').hide();
                $('.vote-option').empty();
                $('.votebtn button').css('opacity', 0.6);
                $('.votebtn').remove();
            }
        });
        $('.vote-close').click(function () {
            $('.vote').hide();
            $('.vote-option, .vote-list').empty();
            $('.votebtn button').css('opacity', 0.6);
            option = '';
            window.voteOptions = [];
            $('.votebtn').remove();
        });
    };

    // 结束答题
    DWLive.onStopVote = function () {
        $('.vote').hide();
        $('.vote-option, .vote-list').empty();
        $('.votebtn button').css('opacity', 0.6);
        $('.votebtn').remove();
    };

    // 答题统计
    DWLive.onVoteResult = function (data) {
        // 选项个数
        var count = data.voteCount;
        // 正确答案 数字或者数组
        var coption = data.correctOption;
        // 多选题目
        var isMultiple = !((typeof coption) === 'number');
        // 判断题目
        var isJudge = count == 2;

        var statisics = data.statisics;
        var zcount = '';

        // 总回答人数
        var answerCount = data.answerCount;

        // 正确内容
        var correctAnswer = '';
        var selfAnswer = '';

        if (isMultiple) {
            var ccs = [];
            $.each(coption, function (index, o) {
                if (o >= 0 && o < 26) {
                    ccs.push(String.fromCharCode(65 + o));
                }
            });
            correctAnswer = ccs.join(',');

            var ccs2 = [];
            $.each(voteOptions, function (index, o) {
                if (o >= 0 && o < 26) {
                    ccs2.push(String.fromCharCode(65 + o));
                }
            });
            selfAnswer = ccs2.join(',');
        } else if (isJudge) {
            if (coption == 0) {
                correctAnswer = '<i class="vote-ricon"></i>';
            } else if (coption == 1) {
                correctAnswer = '<i class="vote-wicon"></i>';
            }

            if ($.isNumeric(option) && option == 0) {
                selfAnswer = '<i class="vote-ricon"></i>';
            } else if ($.isNumeric(option) && option == 1) {
                selfAnswer = '<i class="vote-wicon"></i>';
            }
        } else {
            if ($.isNumeric(coption) && coption >= 0 && coption < 26) {
                correctAnswer = String.fromCharCode(65 + coption);
            }
            if ($.isNumeric(option) && option >= 0 && option < 26) {
                selfAnswer = String.fromCharCode(65 + option);
            }
        }

        switch (count) {
            case 2:
                var li = '<li>'
                    + '<span class="spanl">√:</span>'
                    + '<div class="vote-bar">'
                    + '<div class="vote-in"></div>'
                    + '</div>'
                    + '<span class="color1">' + statisics[0].count + '人</span>'
                    + '<span>(' + statisics[0].percent + '%)</span>'
                    + '</li>'
                    + '<li class="last-item">'
                    + '<span class="spanl">X:</span>'
                    + '<div class="vote-bar">'
                    + '<div class="vote-in"></div>'
                    + '</div>'
                    + '<span class="color1">' + statisics[1].count + '人</span>'
                    + '<span>(' + statisics[1].percent + '%)</span>'
                    + '</li>';
                $('.vote-list').append(li);
                zcount = statisics[0].count + statisics[1].count;
                break;
            case 3:
                var li = '<li>'
                    + '<span class="spanl">A:</span>'
                    + '<div class="vote-bar">'
                    + '<div class="vote-in"></div>'
                    + '</div>'
                    + '<span class="color1">' + statisics[0].count + '人</span>'
                    + '<span>(' + statisics[0].percent + '%)</span>'
                    + '</li>'
                    + '<li>'
                    + '<span class="spanl">B:</span>'
                    + '<div class="vote-bar">'
                    + '<div class="vote-in"></div>'
                    + '</div>'
                    + '<span class="color1">' + statisics[1].count + '人</span>'
                    + '<span>(' + statisics[1].percent + '%)</span>'
                    + '</li>'
                    + '<li class="last-item">'
                    + '<span class="spanl">C:</span>'
                    + '<div class="vote-bar">'
                    + '<div class="vote-in"></div>'
                    + '</div>'
                    + '<span class="color1">' + statisics[2].count + '人</span>'
                    + '<span>(' + statisics[2].percent + '%)</span>'
                    + '</li>';
                $('.vote-list').append(li);
                zcount = statisics[0].count + statisics[1].count + statisics[2].count;
                break;
            case 4:
                var li = '<li>'
                    + '<span class="spanl">A:</span>'
                    + '<div class="vote-bar">'
                    + '<div class="vote-in"></div>'
                    + '</div>'
                    + '<span class="color1">' + statisics[0].count + '人</span>'
                    + '<span>(' + statisics[0].percent + '%)</span>'
                    + '</li>'
                    + '<li>'
                    + '<span class="spanl">B:</span>'
                    + '<div class="vote-bar">'
                    + '<div class="vote-in"></div>'
                    + '</div>'
                    + '<span class="color1">' + statisics[1].count + '人</span>'
                    + '<span>(' + statisics[1].percent + '%)</span>'
                    + '</li>'
                    + '<li>'
                    + '<span class="spanl">C:</span>'
                    + '<div class="vote-bar">'
                    + '<div class="vote-in"></div>'
                    + '</div>'
                    + '<span class="color1">' + statisics[2].count + '人</span>'
                    + '<span>(' + statisics[2].percent + '%)</span>'
                    + '</li>'
                    + '<li class="last-item">'
                    + '<span class="spanl">D:</span>'
                    + '<div class="vote-bar">'
                    + '<div class="vote-in"></div>'
                    + '</div>'
                    + '<span class="color1">' + statisics[3].count + '人</span>'
                    + '<span>(' + statisics[3].percent + '%)</span>'
                    + '</li>';
                $('.vote-list').append(li);
                zcount = statisics[0].count + statisics[1].count + statisics[2].count + statisics[3].count;
                break;
            case 5:
                var li = '<li>'
                    + '<span class="spanl">A:</span>'
                    + '<div class="vote-bar">'
                    + '<div class="vote-in"></div>'
                    + '</div>'
                    + '<span class="color1">' + statisics[0].count + '人</span>'
                    + '<span>(' + statisics[0].percent + '%)</span>'
                    + '</li>'
                    + '<li>'
                    + '<span class="spanl">B:</span>'
                    + '<div class="vote-bar">'
                    + '<div class="vote-in"></div>'
                    + '</div>'
                    + '<span class="color1">' + statisics[1].count + '人</span>'
                    + '<span>(' + statisics[1].percent + '%)</span>'
                    + '</li>'
                    + '<li>'
                    + '<span class="spanl">C:</span>'
                    + '<div class="vote-bar">'
                    + '<div class="vote-in"></div>'
                    + '</div>'
                    + '<span class="color1">' + statisics[2].count + '人</span>'
                    + '<span>(' + statisics[2].percent + '%)</span>'
                    + '</li>'
                    + '<li>'
                    + '<span class="spanl">D:</span>'
                    + '<div class="vote-bar">'
                    + '<div class="vote-in"></div>'
                    + '</div>'
                    + '<span class="color1">' + statisics[3].count + '人</span>'
                    + '<span>(' + statisics[3].percent + '%)</span>'
                    + '</li>'
                    + '<li class="last-item">'
                    + '<span class="spanl">E:</span>'
                    + '<div class="vote-bar">'
                    + '<div class="vote-in"></div>'
                    + '</div>'
                    + '<span class="color1">' + statisics[4].count + '人</span>'
                    + '<span>(' + statisics[4].percent + '%)</span>'
                    + '</li>';
                $('.vote-list').append(li);
                zcount = statisics[0].count + statisics[1].count + statisics[2].count + statisics[3].count + statisics[4].count;
                break;
        }

        for (var i = 0; i < statisics.length; i++) {
            $('.vote-in').eq(i).css('width', statisics[i].percent * 1.2);
        }

        if (isMultiple) {
            // 为了兼容老客户端，单选题和判断的回答人数扔计算得出
            zcount = answerCount;
        }

        $('#vote-count').html(zcount);
        // 自己选择的答案
        $('#yansw em').html(selfAnswer);
        // 正确答案
        $('#cansw em').html(correctAnswer);

        if ($('#yansw em').html() == $('#cansw em').html()) {
            $('#yansw').addClass('vote-righta');
        } else {
            $('#yansw').removeClass('vote-righta');
        }

        $('.vote').show();
        $('#vote2').show();
        $('#vote1').hide();
        $('.votebtn').remove();

        option = '';
        window.voteOptions = [];
        $('.vote-close').click(function () {
            $('.vote').hide();
            $('.vote-list').empty();
            option = '';
            window.voteOptions = [];
        });
    };


    // 请求互动
    $('li[name="interaction"]').click(function (e) {
        var $t = $(this);
        if ($t.hasClass('disable')) {
            e.preventDefault();
            return;
        }

        var type = $t.attr('t');
        var isVideo = type == 'video';
        var isAudio = !isVideo;
        var $a = $t.find('a');

        if ($a.hasClass('applying')) {
            return;
        }

        if (window.VIDEO_INTERACTION_MSG_TIME_OUT >= 0) {
            clearTimeout(window.VIDEO_INTERACTION_MSG_TIME_OUT);
            $('#videoInteraction .call-tit').text('');
        }

        if (window.INTERACTION_MSG_TIME_OUT >= 0) {
            clearTimeout(window.INTERACTION_MSG_TIME_OUT);
            $('#interactionMsg').text('');
        }

        // 请求互动
        if ($a.hasClass(type)) {
            $('li[name="interaction"]').addClass('disable').hide();
            $t.removeClass('disable').show();

            $a.removeClass('video audio applying calling').addClass('applying');

            if (isVideo) {
                isAudio = true;

                $('#videoInteraction').show();
                $('#videoInteraction .call-tit').show().text('视频通话申请中...');
            }
            $('#interactionMsg').show().text('通话申请中...');

            DWLive.requestInteraction({
                video: isVideo,
                audio: isAudio
            });
        } else if ($a.hasClass('calling')) { // 挂断互动
            $('li[name="interaction"]').show().removeClass('disable');
            $a.removeClass('video audio applying calling').addClass(type);

            DWLive.hangupInteraction();

            if (isAudio) {
                $('#interactionApplying, #interactionStart').hide();
                $('#interactionTime').text('00:00');
            }

            if (isVideo) {
                $('#videoInteraction .call-tit').show().text('通话结束');
                window.VIDEO_INTERACTION_MSG_TIME_OUT = setTimeout(function () {
                    $('#videoInteraction .call-tit').text('');
                    window.VIDEO_INTERACTION_MSG_TIME_OUT = -1;
                }, 1500);
                $('#videoInteraction').hide();
            }

            $('#interactionMsg').text('通话结束');
            window.INTERACTION_MSG_TIME_OUT = setTimeout(function () {
                $('#interactionMsg').text('');
                window.INTERACTION_MSG_TIME_OUT = -1;
            }, 1500);
        }
        e.preventDefault();
    });


});


window.ALLOW_SPEAK_INTERACTION = false;
DWLive.onRoomSetting = function (data) {
    window.ALLOW_SPEAK_INTERACTION = data.allow_speak_interaction == 'true';
    if (window.RECONNECTING && window.ALLOW_SPEAK_INTERACTION) {
        window.RECONNECTING = false;
        return;
    }

    if (!live.interaction.isSupportInteraction()) {
        // console.log(!live.interaction.isSupportInteraction());
        return;
    }

    var $audioInteraction = $('li[name="interaction"][t="audio"]');
    var $videoInteraction = $('li[name="interaction"][t="video"]');

    $audioInteraction.removeClass('disable').find('a').removeClass('audio applying calling').addClass('audio');
    $videoInteraction.removeClass('disable').find('a').removeClass('video applying calling').addClass('video');

    $('#interactionMsg').text('');

    // 允许语音通话
    if (data.allow_speak_interaction == 'true') {
        $audioInteraction.show();
        $videoInteraction.show();
    } else {
        // 断开语音通话
        DWLive.hangupInteraction();

        $audioInteraction.hide();
        $videoInteraction.hide();
    }
};


// 断开语音通话
window.on_cc_live_interaction_disconnect = function (data) {
    var uid = data.disconnectid;
    var isPC = !!live.interaction.usersPcs[uid];

    if (uid != DWLive.viewerid && !isPC) {
        return;
    }
    if (uid != DWLive.viewerid && isPC) {
        DWLive.hangupInteraction();
    }

    live.interaction.clearCallingTimer();
    live.interaction.disconnectInteraction(uid);

    // 与所有端断开连接
    if (uid == DWLive.viewerid || live.interaction.usersPcs.length == 0) {
        live.interaction.stopLocalStream();

        $('li[name="interaction"][t="video"] a').removeClass('audio applying calling').addClass('video');
        $('li[name="interaction"][t="audio"] a').removeClass('audio applying calling').addClass('audio');

        $('li[name="interaction"]').removeClass('disable').show();

        $('#interactionMsg').text('');

        $('#videoInteractions').empty();
        $('#audioInteractions').empty();

        $('#interactionLocalVideo')[0].src = '';

        $('#videoInteraction').hide();

        if (live.interaction.local.type.video) {
            DWLive.livePlayerInit();
            $('#videoInteractions').css('height', '0px');
        }
        $('#btn-network').removeClass('wl-disable');

        if (!window.ALLOW_SPEAK_INTERACTION) {
            $('li[name="interaction"]').hide();
        }
    } else {
        // 断开其他人
    }
};

// 接受语音/连麦互动
function on_cc_live_interaction_accept(p) {
    if (p.video) {
        $('li[name="interaction"][t="video"] a').removeClass('audio applying calling').addClass('calling');
        $('#videoInteraction .call-tit').hide();
    } else {
        $('li[name="interaction"][t="audio"] a').removeClass('audio applying calling').addClass('calling');
    }
    $('#interactionMsg').text('通话中...');

    $('#btn-network').addClass('wl-disable');
}


function on_cc_live_interaction_interval(p, t) {
    if (t < 0) {
        return;
    }

    var s = t % 60;
    s = s < 10 ? ('0' + s) : s;

    var m = parseInt(t / 60, 10);
    m = m < 10 ? ('0' + m) : m;


    $('#interactionMsg').text('通话中 ' + m + ':' + s);
}

/**
 * 获取本地流信息
 * */
function on_cc_live_interaction_local_media(p, stream) {
    // 视频+音频
    if (p.video) {
        $('#videoInteractio').show();
        var $lv = $('#interactionLocalVideo')[0];
        // $lv.src = URL.createObjectURL(stream); // 加载流信息
        $lv.srcObject = stream;
        $lv.volume = 0; // 静音
    } else {

    }
}

/**
 * 远程互动流
 *
 * */
function on_cc_live_interaction_remote_media(p, chatuser, stream) {
    if (p.video) {
        $('#livePlayer').replaceWith('<div id="livePlayer"></div>');

        $('#videoInteractions').css('height', '100%');

        var id = 'interactionRemoteVideo' + chatuser.id;
        $('#videoInteractions').append('<video id="' + id + '" style="height: 100%; width: 100%;" autoplay></video>');
        // $('#' + id)[0].src = URL.createObjectURL(stream);
        $('#' + id)[0].srcObject = stream;
        $('#videoInteraction').hide();
    } else {// 远程音频
        var id = 'interactionRemoteAudio' + chatuser.id;
        $('#audioInteractions').append('<audio id="' + id + '" autoplay controls></audio>');
        // $('#' + id)[0].src = URL.createObjectURL(stream);
        $('#' + id)[0].srcObject = stream;
    }
}


/**
 * 请求互动60s内没有接受，超时断开
 *
 * @param p
 */
function on_cc_live_interaction_request_timeout(p) {
    // 音频通话
    if (p.audio) {
        $('li[name="interaction"][t="audio"] a').removeClass('audio applying calling').addClass('audio');
    }

    // 视频通话
    if (p.video) {
        $('li[name="interaction"][t="video"] a').removeClass('audio applying calling').addClass('video');
        $('#videoInteraction').hide();
    }

    $('#interactionMsg').hide().text('');
    $('li[name="interaction"]').removeClass('disable').show();

    $('#btn-network').removeClass('wl-disable');

    if (!window.ALLOW_SPEAK_INTERACTION) {
        $('li[name="interaction"]').hide();
    }
}

/**
 * 请求互动错误
 * */
function on_cc_live_interaction_error(p, error, errMsg) {

}

/**
 * 取消通话
 * */
function on_cc_live_interaction_cancal(p) {
    // 处理逻辑与超时一致
    on_cc_live_interaction_request_timeout(p);
}

DWLive.onOnlineTeachers = function (data) {
    $('#private-name li[role="teacher"]').remove();

    for (var i = 0; i < data.teachers.length; i++) {
        var teacher = data.teachers[i];
        $('#private-name').prepend('<li role="teacher" id="' + teacher.id + '">' + teacher.name + '</li>');
    }
};

window.UNLOADMARQUEE = true;

function on_cc_swf_loading_completed(id) {
    if (window.UNLOADMARQUEE) {
        window.UNLOADMARQUEE = false;
        var marquee = $.trim($('#viewerMarquee').text());
        if (marquee) {
            try {
                var mj = JSON.parse(marquee);

                var isHttps = window.location.protocol === 'https:';
                // 当前页面如果不是https，跑马灯突破地址为https协议，则强制将图片协议改为http
                if (!isHttps && mj && mj.image && mj.image.image_url && mj.image.image_url.indexOf('https:') >= 0) {
                    var u = mj.image.image_url;
                    mj.image.image_url = u.replace(/https:/g, 'http:');
                }

                setTimeout(function () {
                    DWLive.showMarquee(JSON.stringify(mj));
                }, 1000);
            } catch (e) {
            }
        }
    }
}

DWLive.onExternalQuestionnairePublish = function (data) {
    console.log('第三方问卷:', data);
};

DWLive.onLoginSuccess = function () {
    console.log('多清晰度:', DWLive.multiQuality);
    console.log('文档显示模式:', DWLive.documentDisplayMode);
    console.log('倒计时:', DWLive.liveCountdown);
};

//翻页信息
DWLive.onPageChange = function (data) {
    console.log(data);
};

//改名回掉
DWLive.onChangeNickname = function (data) {
    console.log(data);
};

//直播防360浏览器录屏
window.onresize = function () {
    //application/vnd.chromium.remoting-viewer 可能为360特有
    var is360 = _mime("type", "application/vnd.chromium.remoting-viewer");
    if (isChrome() && is360) {
        //alert("检测到是360浏览器");
        var str = document.querySelector("#livePlayer").style.cssText;
        var width =$("#livePlayer").width();
        var height = $("#livePlayer").height()
        var winW=$(window).width();
        var winH=$(window).height();
        function getCssText() {
            return $("#livePlayer").css("margin-top") =="0px"
                &&$("#livePlayer").css("margin-right") =="0px"
                &&$("#livePlayer").css("margin-bottom") =="0px"
                &&$("#livePlayer").css("margin-left") =="0px"
        }
        if(width == winW && height ==winH &&getCssText()){
            $('body *').remove();
            var fp = '<p style="position: absolute;top: 100px;left: 100px">视频不支持录屏模式下播放<br>请刷新重新观看</p>'
            $('body').append(fp);
            return
        }
        if (str.search('width') != -1 && str.search('height') != -1 && str.search('!important') != -1) {
            $('body *').remove();
            var fp = '<p style="position: absolute;top: 100px;left: 100px">视频不支持录屏模式下播放<br>请刷新重新观看</p>'
            $('body').append(fp);
        }
    }
}