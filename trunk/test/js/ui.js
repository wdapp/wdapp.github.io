//ui界面回掉
$('#btn-face').click(function (e) {
    var strFace;
    var path = 'img/em2/';
    var tip = 'em_';
    if ($('#embox').length <= 0) {
        strFace = '<div id="embox" style="position:absolute;z-index:1000;bottom:38px;left:0;">'
            + '<table border="0" cellspacing="0" cellpadding="0"><tr>';
        for (var i = 1; i <= 20; i++) {
            strFace += '<td><img src="' + path + handleEm(i)
                + '.png" onclick="setEm(' + handleEm(i)
                + ')" /></td>';
            if (i % 10 == 0)
                strFace += '</tr><tr>';
        }
        strFace += '</tr></table></div>';
        $('.chat-tools').append(strFace);
    } else {
        $('#embox').hide().remove();
    }

    e.stopPropagation();
});

function handleEm(i) {
    if (i < 10) {
        return '0' + i;
    }
    return i;
}

function setEm(e) {
    var emstr = '[em2_' + handleEm(e) + ']';
    $('#chat-content').val(function () {
        return $(this).val() + emstr;
    }).focus();
}

function showEm(str) {
    if (!$.trim(str)) {
        return '';
    }
    str = str.replace(/\</g, '&lt;');
    str = str.replace(/\>/g, '&gt;');
    str = str.replace(/\n/g, '<br/>');
    str = str.replace(/\[em_([0-9]*)\]/g, '<img src="img/em/$1.gif" border="0" />');
    str = str.replace(/\[em2_([0-9]*)\]/g, '<img src="img/em2/$1.png" border="0" />');

    var nmsg = '';
    var reg = new RegExp(/\[img_http(s)?:\/\/(.*?)\]/g);
    var isImage =reg.test(str)
    if(isImage){
        var sIndex = str.indexOf('_') + 1;
        nmsg = str.slice(sIndex,str.length-1);
        var imgTag = '<div class="chatImage" style="width: 100%; cursor: pointer;" ><img src="'+nmsg+'"  style="width: 100%;" onclick="showMsgImage(event)"/></div>';
        return imgTag;
    }

    $.each(str.split(' '), function (i, n) {
        n = $.trim(n);
        if (n.indexOf('[uri_') == 0 && n.indexOf(']') == n.length - 1 && n.length > 6) {
            var u = n.substring(5, n.length - 1) + ' ';
            nmsg += '<a target="_blank" style="color: #2f53ff" href="' + u + '">' + u + '</a>' + ' ';
        } else {
            nmsg += n + ' ';
        }
    });
    return nmsg;
}
    function showMsgImage(e) {
        var imgTag = e.currentTarget;
        var path = imgTag.src;
        path = path.replace(/http(s)?:/g,'');
        $('#mask').css('display','block');
        $('#mask img').attr('src',path);
    }
    $('#mask p').click(function () {
        $('#mask').css('display','none');
    })

// 监听表情
$(document).bind('click', function (ev) {
    var fid = ev.target;
    if (fid.id !== 'btn-face') {
        $('#emotion').fadeOut(200);
    }
    $('#embox').hide().remove();
});


//只看我的回答
$('#only-me').bind('click', function () {
    if (!($(this).find('i').hasClass('active'))) {
        $(this).find('i').addClass('active');
        $('#question-main .not-mines').hide();
    } else {
        $(this).find('i').removeClass('active');
        //$('#question-main .not-mines').show();
        $('.peo-repeat').parent().show();
    }
});

// 优选网络
$('#btn-network').bind('click', function () {

    var l = DWLive.getLine();
    var netlist = '';

    for (var i in l) {
        var net = l[i];
        netlist += '<li><input type="radio" value="' + i + '" name="network" id="network' + i + '" ' + (net.select == '1' ? 'checked' : '') + '><label for="network' + i + '">' + net.name + '</label></li>';
    }

    $('#change-network').html('').append(netlist);

    $('#network').fadeToggle(200);

});

$('#work-close').bind('click', function () {
    $('#network').fadeOut(200);
});

// 选择网络
$('#btn-netsubmit').bind('click', function () {
    var network = $('input[name="network"]:checked').val();

    $('#network').fadeOut(200);

    DWLive.changeLine(network);

});

$('#btn-netcannel').bind('click', function () {
    $('#network').fadeOut(200);
});

// 只听音频
$('#btn-audio').click(function () {
    $(this).toggleClass('only-audio-enable');
    DWLive.onlyAudio();
});

$('#change-nickname').bind('click', function () {
    var name = prompt('请输入姓名');
    if (!name || typeof name !== 'string' || name === 'null') {
        return false;
    }
    DWLive.changeNickname(name);
});

// 侧边栏

// 右侧侧边栏
$('#right-bar').bind('click', function () {
    var winMain = $('#doc-main').attr('data-module');

    if ($('#right-bar').css('right') == '260px') {
        $('#video-middle').animate({
            'right': 10
        }, 200);
        $('#right-bar').stop(1, 1).animate({
            'right': 0
        }, 200, function () {
            $('#right-switch').removeClass('right-icons').addClass('left-icons');
        });
        $('#ppt-tools').stop(1, 1).animate({
            'right': 10
        }, 200);
        // 判断当前主要内容
        if (winMain == '0') {
            $('#widget-video').stop(1, 1).animate({
                'width': '+=260',
                'right': 10
            }, 200);
        }
    } else {
        $('#video-middle').animate({
            right: 270
        }, 200);
        $('#right-bar').stop(1, 1).animate({
            'right': 260
        }, 200, function () {
            $('#right-switch').addClass('right-icons').removeClass('left-icons');
        });
        $('#ppt-tools').stop(1, 1).animate({
            'right': 270
        }, 200);
        // 判断当前主要内容
        if (winMain == '0') {
            $('#widget-video').stop(1, 1).animate({
                'width': '-=260',
                'right': 270
            }, 200);
        }
    }
    return;
});

// 左侧侧边栏
$('#left-bar').bind('click', function () {
    // 判断当前主要内容
    var winMain = $('#doc-main').attr('data-module');

    if ($('#left-bar').css('left') == '260px') {
        // console.log($('#left-bar').css('left'))
        $('#video-middle').animate({
            left: 10
        }, 200);
        $('#left-bar').stop(1, 1).animate({
            'left': 0
        }, 200, function () {
            $('#left-switch').addClass('right-icons');
        });
        $('#ppt-tools').stop(1, 1).animate({
            'left': 10
        }, 200);
        // 判断当前主要内容
        if (winMain == '0') {
            $('#widget-video').stop(1, 1).animate({
                'width': '+=260',
                'left': 10
            }, 200);
            // console.log('当前主要内容是视频');
        }
    } else {
        $('#video-middle').animate({
            left: 270
        }, 200);
        $('#left-bar').stop(1, 1).animate({
            'left': 260
        }, 200, function () {
            $('#left-switch').removeClass('right-icons');
        });
        $('#ppt-tools').stop(1, 1).animate({
            'left': 270
        }, 200);
        // 判断当前主要内容
        if (winMain == '0') {
            $('#widget-video').stop(1, 1).animate({
                'width': '-=260',
                'left': 270
            }, 200);
            // console.log('当前主要内容是视频');
        }
    }
    return;
});
window.on_docs_data_complate=function (da) {

};

$('#jump_btn').on('click',function () {
    var docId = $('#docId').val();
    var pageIndex=$('#pageIndeId').val()
    DWLive.changePageTo(docId,pageIndex);
});
//切换自由模式
var isFree = false;
$('#changeMode').on('click',function () {
		isFree = !isFree;
		var type = isFree ?DWLive.DocModeType.FreeMode:DWLive.DocModeType.NormalMode;
		DWLive.setDocMode(type);
        DWLive.getDocs(on_docs_data_complate);
});

//退出直播间
$('#logout').click(function () {
    var isC = confirm('确认要退出登录?');
    if (isC) {
        DWLive.logout({
            success: function (data){
                window.location.href = './login';
            },
            error: function(data){
                // console.log(data.msg);
            }
        })
    }
});


// 视频切换
$('#btn-switch').bind('click', switchPptToVideo);
var isMainVideo=false;
function switchPptToVideo() {
    if ($('#widget-video').is(':animated')) {
        return false;
    }
    var video = $('#widget-video'),
        videoWidth = video.width(),
        videoHeight = video.height(),
        videoLeft = video.css('left'),
        videoRight = video.css('right'),
        videoZindex = video.css('z-index'),
        ppt = $('#doc-main'),
        pptWidth = $('#video-middle').width(),
        pptHeight = ppt.height(),
        pptLeft = $('#video-middle').css('left'),
        pptRight = $('#video-middle').css('right'),
        pptZindex = parseInt($('#video-middle').css('z-index')) + 1,
        op = video.offset().left,
        winMain = ppt.attr('data-module'),
        pptStyle, videoStyle, _width, _height;

    if (winMain == 1) {
        videoLeft = (videoLeft == 'auto' || videoLeft == '0px') ? '-270px' : videoLeft;
        pptStyle = {
            'width': videoWidth,
            'height': videoHeight,
            'left': videoLeft,
            'right': videoRight,
            'z-index': videoZindex
        },
            videoStyle = {
                'width': pptWidth,
                'height': pptHeight,
                'left': pptLeft,
                'right': pptRight,
                'z-index': pptZindex
            };

        if ($.support.opacity) {
            video.fadeOut(400, function () {
                video.css(videoStyle).show();
            });

            ppt.fadeOut(400, function () {
                ppt.css(pptStyle).show();
            });
        } else {
            video.css(videoStyle);
            ppt.css(pptStyle);
        }
        ppt.attr('data-module', '0');
        $('#full-ppt').fadeOut(0, function () {
            $('#full-vod').fadeIn();
        });
        isMainVideo = true;
    } else {
        pptLeft = (pptLeft == '270px') ? '0' : pptLeft;
        pptWidth = 'auto';
        videoLeft = (videoLeft == '270px') ? '0' : videoLeft;

        pptStyle = {
            'width': videoWidth,
            'height': videoHeight,
            'left': videoLeft,
            'right': videoRight,
            'z-index': videoZindex
        },
            videoStyle = {
                'width': pptWidth,
                'height': pptHeight,
                'left': pptLeft,
                'right': pptRight,
                'z-index': pptZindex
            };

        if ($.support.opacity) {
            video.stop(1, 1).fadeOut(400, function () {
                video.css(videoStyle).removeAttr('style').show();
            });
            ppt.stop(1, 1).fadeOut(400, function () {
                ppt.css(pptStyle).removeAttr('style').show();
            });
        } else {
            video.css(videoStyle);
            ppt.css(pptStyle);
        }
        ppt.attr('data-module', '1');
        $('#full-vod').fadeOut(0, function () {
            $('#full-ppt').fadeIn();
        });
        isMainVideo= false;
    }
    if(typeof window.switch_main_show_marquee ==='function'){
        window.switch_main_show_marquee();
    }
    return false;
}

var userAgent = navigator.userAgent.toLowerCase();
if (userAgent.indexOf('safari') > 0 && userAgent.indexOf('chrome') < 0) {
    $('.select-span').css('vertical-align', 0);
}

var screen = false;
$('#btn-fullscreen').click(function () {
    var winMain = $('#doc-main').attr('data-module');

    if (screen) {
        // $('#video-middle').removeClass('enter-fullscreen');
        // $('#video-middle').addClass('exit-fullscreen');
        $('#video-middle').animate({
            left: 10
        }, 80);
        $('#left-bar').stop(1, 1).animate({
            'left': 0
        }, 80, function () {
            $('#left-switch').addClass('right-icons');
        });
        $('#ppt-tools').stop(1, 1).animate({
            'left': 10
        }, 80);
        // 判断当前主要内容
        if (winMain == '0') {
            $('#widget-video').stop(1, 1).animate({
                'width': '+=260',
                'left': 10
            }, 80);
            // console.log('当前主要内容是视频');
        }

        $('#video-middle').animate({
            'right': 10
        }, 80);
        $('#right-bar').stop(1, 1).animate({
            'right': 0
        }, 80, function () {
            $('#right-switch').removeClass('right-icons').addClass('left-icons');
        });
        $('#ppt-tools').stop(1, 1).animate({
            'right': 10
        }, 80);
        // 判断当前主要内容
        if (winMain == '0') {
            $('#widget-video').stop(1, 1).animate({
                'width': '+=260',
                'right': 10
            }, 80);
        }

    } else {

        $('#video-middle').animate({
            right: 270
        }, 80);
        $('#right-bar').stop(1, 1).animate({
            'right': 260
        }, 80, function () {
            $('#right-switch').addClass('right-icons').removeClass('left-icons');
        });
        $('#ppt-tools').stop(1, 1).animate({
            'right': 270
        }, 80);
        // 判断当前主要内容
        if (winMain == '0') {
            $('#widget-video').stop(1, 1).animate({
                'width': '-=260',
                'right': 270
            }, 80);
        }

        $('#video-middle').animate({
            left: 270
        }, 80);
        $('#left-bar').stop(1, 1).animate({
            'left': 260
        }, 80, function () {
            $('#left-switch').removeClass('right-icons');
        });
        $('#ppt-tools').stop(1, 1).animate({
            'left': 270
        }, 80);
        // 判断当前主要内容
        if (winMain == '0') {
            $('#widget-video').stop(1, 1).animate({
                'width': '-=260',
                'left': 270
            }, 80);
        }

        // $('#video-middle').addClass('enter-fullscreen');
        // $('#video-middle').removeClass('exit-fullscreen');
        // $('#right-bar').css({
        //     right:'0px',
        //     display:'block',
        //
        // })
        // $('#left-bar').css({
        //     right:'0px',
        //     display:'block'
        // })
        // $('#video-middle').css('right','10px')
    }
    screen = !screen;
});

function onSocketConnect(){
    if(console && typeof console.log == "function"){
        console.log("socket 链接成功")
    }
}

function onSocketDisconnect(){
    if(console && typeof console.log == "function"){
        console.log("socket 断开链接")
    }
}
function isChrome() {
  var ua = navigator.userAgent.toLowerCase();
  return ua.indexOf("chrome")>1
}
//测试mime
function _mime(option, value) {
  var mimeTypes = navigator.mimeTypes;
  for (var mt in mimeTypes) {
    if (mimeTypes[mt][option] == value) {
      return true;
    }
  }
  return false;
}


