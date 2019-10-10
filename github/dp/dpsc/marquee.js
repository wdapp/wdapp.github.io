/**
 * dp
 *
 * Version 0.0.1
 *
 * Created by shanglt on 2018/05/21.
 */
!(function (window) {
    var MarqueeExampleData = {
        "loop": -1, // 循环次数，数据类型:int, -1表示无限循环
        "type": "text", // 跑马灯类型，字符串类型，值可为：text（文字），image（图片）
        "text": { // 当类型为text时，取该节点作为跑马灯内容
            "content": "跑马灯内容", // 跑马灯文字内容
            "font_size": 20, // 文字字体大小（单位：px）
            "color": "0xf0f00f" // 文字颜色，数据内容为16进制颜色
        },

        "image": { // 当类型为image时，取该节点作为跑马灯内容
            "image_url": "http://domain.com/marquee.png",
            "width": 100, // 图片宽度（单位：px）
            "height": 100 // 图片高度（单位：px）
        },

        "action": [ // 跑马灯的动作节点，可以定义一组动作，播放器会按顺序执行动作
            {
                "index": 0, // 动作的执行顺序，播放器从该值最小的动作开始执行
                "duration": 4000, // 动作的执行时间（单位：ms）
                "start": { // 动作起始点
                    "xpos": 0, // 距离视频左上角原点水平距离，数据类型：float，取值范围：0~1，具体距离：视频宽度* xpos
                    "ypos": 0, // 距离视频左上角原点垂直距离，数据类型：float，取值范围：0~1，具体距离：视频宽度* ypos
                    "alpha": 0.5 // 透明度，取值范围：0~1
                },
                "end": { // 动作结束点
                    "xpos": 0.6,
                    "ypos": 0,
                    "alpha": 1
                }
            },
            {
                "duration": 4000,
                "start": {
                    "xpos": 0,
                    "ypos": 0.7,
                    "alpha": 0.3
                },
                "end": {
                    "xpos": 0.7,
                    "ypos": 0.7,
                    "alpha": 0.9
                }
            }
        ]
    };

    var Marquee = function () {

    };


})(window, undefined);
