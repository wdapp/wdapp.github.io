/**
 * v.1.2.1
 *
 * Created by shanglt on 2019/4/29
 */
var ispringPresentationConnector = {};
var playbackController;
var soundController;
var presentationView;

var isLoadAnimation = false;
var UNLOADANIMATIONSTEPS = [];

// 已经出发的动画
window.TRIGGERED_ANIMATION_STEP = -1;
// 总动画步数
window.ANIMATIONSTEPSCOUNT = -1;
window.GOTOSTEP = -1;
// 当前页码索引值
window.CURRENT_SLIDE_INDEX = -1;
// 文档总页数
window.ALL_SLIDE_COUNT = -1;

var isLoadInitPage = false;

window.hasNextAnimationStep = true;
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

window.onload = function(){
  postMessageToParent({
    action: 'show_animation_page_from_dpa',
    currentSlideIndex:window.CURRENT_SLIDE_INDEX
  });

}
ispringPresentationConnector.register = function (player) {

    presentationView = player.view();

    var presentation = player.presentation();

    // 总页数
    window.ALL_SLIDE_COUNT = presentation.slides().count();

    soundController = presentationView.soundController();
    soundController.mute(true);

    playbackController = presentationView.playbackController();
    // 监听翻页事件
    playbackController.slideChangeEvent().addHandler(function (slideIndex) {
        window.CURRENT_SLIDE_INDEX = slideIndex;
        window.TRIGGERED_ANIMATION_STEP = -1;
        // 当前页的总动画数
        window.ANIMATIONSTEPSCOUNT = playbackController.currentSlide().animationSteps().count();
        //var pageIndex = getURLParameter('pageIndex')?getURLParameter('pageIndex'):0;
        postMessageToParent({
          action: 'show_animation_sldier_change_frome_dpa',
          currentSlideIndex:window.CURRENT_SLIDE_INDEX
        });
        lastPageNum = slideIndex;
        if (MainWindow) {
            MainWindow.javaReadMsg('slide_change_from_dpa', JSON.stringify({
                currentSlideIndex: slideIndex,
                totalSteps: window.ANIMATIONSTEPSCOUNT
            }));
        }

    });
    playbackController.stepChangeEvent().addHandler(function (stepIndex) {
        if (stepIndex < 0) {
            return;
        }

        // 当初始化的时候，也就是显示第一页的时候，判断是否要自动翻到某页
       var pageIndex = getURLParameter('pageIndex');
        if (pageIndex > 0 && !isLoadInitPage && stepIndex == 0 && window.CURRENT_SLIDE_INDEX == 0 && pageIndex < window.ALL_SLIDE_COUNT) {
            isLoadInitPage = true;
            on_cc_live_dw_page_change({pagenum:pageIndex})
            //playbackController.gotoSlide(pageIndex);
            return;
        }

        // 当前页已经出发的动画步数
        window.TRIGGERED_ANIMATION_STEP = stepIndex;

        // 当前页是否有下一个动画
        window.hasNextAnimationStep = (stepIndex + 1) < window.ANIMATIONSTEPSCOUNT;

        window.isLoadingAnimation = false;

        if (!isLoadAnimation) {
            isLoadAnimation = true;
            if (UNLOADANIMATIONSTEPS.length > 0) {
                gotoStep(UNLOADANIMATIONSTEPS.pop().step);
                UNLOADANIMATIONSTEPS = [];
            }
        }

        postMessageToParent({
            action: 'animation_change',
            totalSteps: ANIMATIONSTEPSCOUNT,
            currentStepIndex: window.TRIGGERED_ANIMATION_STEP,
            currentSlideIndex: window.CURRENT_SLIDE_INDEX,
            hasNextAnimationStep: window.hasNextAnimationStep
        });
    });
};

function postMessageToParent(msg) {
    if (!window.parent) {
        return;
    }

    try {
        if (typeof msg != 'string') {
            msg = JSON.stringify(msg);
        }

        window.parent.postMessage(msg, "*");
    } catch (e) {
    }
}
var lastPageNum = -1;
window.on_cc_live_dw_page_change = function (data) {
    data = toJson(data);
    if(lastPageNum == data.pagenum){
        on_cc_live_dw_animation_change({step:0});
    }else{
        gotoSlide(data.pagenum);
    }
    lastPageNum = data.pagenum;
};

window.on_cc_live_dw_animation_change = function (data) {
    data = toJson(data);
    if (window.TRIGGERED_ANIMATION_STEP < 0 || window.ANIMATIONSTEPSCOUNT < 0) {
        UNLOADANIMATIONSTEPS.push(data);
        return;
    }

    var step = parseInt(data.step, 10);
    if (step < 0) {
        return;
    }

    if (window.isLoadingAnimation) {
        setTimeout(function () {
            window.on_cc_live_dw_animation_change(data);
        }, 100);
    } else {
        gotoStep(step);
    }
};

window.isLoadingAnimation = false;

function gotoStep(step) {
    var as = step - window.TRIGGERED_ANIMATION_STEP;
    if (as < 0) {
        for (var i = 0; i > as; i--) {
            try {
                window.isLoadingAnimation = true;
                playbackController.gotoPreviousStep();
            } catch (e) {
            }
        }
    } else {
        for (var i = 0; i < as; i++) {
            try {
                window.isLoadingAnimation = true;
                playbackController.gotoNextStep();
            } catch (e) {
            }
        }
    }
}

function gotoSlide(page) {
    playbackController.gotoSlide(page);
}

window.addEventListener('message', function (event) {
    var data = toJson(event.data);
    if (data.action === 'animation_change') {
        window.GOTOSTEP = data.step;
        on_cc_live_dw_animation_change(data);
    } else if (data.action === 'resize') {
        on_cc_live_dw_resize(data);
    } else if (data.action === 'eval') {
        on_cc_live_dw_eval(data);
    } else if (data.action === 'page_change') {
        on_cc_live_dw_page_change(data);
    }
});


window.on_cc_live_dw_eval = function (data) {
    try {
        eval(data.script);
    } catch (e) {
    }
};

window.playerViewWidth = 0;
window.playerViewHeight = 0;

window.on_cc_live_dw_resize = function (data) {
    data = toJson(data);

    var width = parseInt(data.width, 10);
    var height = parseInt(data.height, 10);

    if (width > 0 && height > 0) {
        if(presentationView){
          presentationView.resize(width, height);
        }


        try {
            // ispring 的HTML页面宽度和高度如果超过了原始的宽度和高度，布局上会存在问题
            var child_dom = document.getElementById('content').children[0];
            child_dom.style.top = '0';
            child_dom.style.left = '0';

            var ppv = document.getElementById('playerView').parentNode;
            ppv.style.minHeight = '';
            ppv.style.width = width + 'px';
            ppv.style.height = height + 'px';

            window.playerViewWidth = width;
            window.playerViewHeight = height;
        } catch (e) {
            if (console && console.log) {
                console.log(e);
            }
        }
    }
};
if (window.location.href.indexOf('9F2252F04EC4874F9C33DC5901307461') > -1 ||
    window.location.href.indexOf('946E5240F140BE969C33DC5901307461') > -1 ||
    window.location.href.indexOf('88C79C053AFF11E39C33DC5901307461') > -1) {
    setInterval(function () {
        try {
            var s = document.querySelector('body').lastChild;
            if (s && s.nodeName == 'SPAN') {
                s.remove();
            }
        } catch (e) {

        }
    }, 80);
}

setInterval(function () {
    if (window.playerViewHeight > 0 && window.playerViewWidth > 0) {
        try {
            presentationView.resize(window.playerViewWidth, window.playerViewHeight);

            // ispring 的HTML页面宽度和高度如果超过了原始的宽度和高度，布局上会存在问题
            var child_dom = document.getElementById('content').children[0];
            child_dom.style.top = '0';
            child_dom.style.left = '0';

            var ppv = document.getElementById('playerView').parentNode;
            ppv.style.minHeight = '';
            ppv.style.width = window.playerViewWidth + 'px';
            ppv.style.height = window.playerViewHeight + 'px';
        } catch (e) {
            if (console && console.log) {
                console.log(e);
            }
        }
    }
}, 300);

function toJson(data) {
    if (typeof data === 'string') {
        try {
            return JSON.parse(data);
        } catch (e) {
            return {};
        }
    }
    return data;
}