/**
 * PC端直播间页面common.js
 *
 * */
!(function ($, window, document) {
    // 没有Flash插件，增加提示样式
    var FlashTip = {
        show: function () {
            var tip = '<div class="flashtip"><p>您还没有安装flash播放器,请点击<a href="http://www.adobe.com/go/getflash" target="_blank">这里</a>安装</p></div>';
            $('#callbackPlayer, #livePlayer, #drawPanel, #playbackPanel, #playbackPlayer').append(tip);
        },

        checkFlash: function () {
            var isIE = (navigator.appVersion.indexOf('MSIE') >= 0);
            var hasFlash = true;

            if (isIE) {
                try {
                    var objFlash = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                } catch (e) {
                    hasFlash = false;
                }
            } else {
                if (!navigator.plugins['Shockwave Flash']) {
                    hasFlash = false;
                }
            }
            return hasFlash;
        },

        init: function () {
            if (!FlashTip.checkFlash()) {
                FlashTip.show();
            }
        }
    };


    $(function () {
        FlashTip.init();
    });
})(jQuery, window, document, undefined);