/**
 *  软键盘
 */
(function (window,undefined) {
    var imeService = {};

    /**
     * 打开串口
     * type :
     * 1  - 英文键盘-九宫格
     * 2  - 数字键盘-九宫格
     * 3  - 拼音键盘-九宫格
     * 4  - 手写键盘-九宫格
     * 5  - 身份证键盘-九宫格
     * 11 - 英文键盘-全键盘
     * 12 - 数字键盘-全键盘
     * 13 - 拼音键盘-全键盘
     * 14 - 手写键盘-全键盘
     * track : 是否跟踪（默认-1） 0 - 不跟踪， 1- 跟踪
     * width : 键盘宽度（默认-1）
     * high  : 键盘高度（默认-1）
     * x : 初始x坐标（默认-1）
     * y : 初始y坐标（默认-1）
     *
     */
    imeService.open = function(type, track, width, high, x, y) {

            console.log("-> imeService open");

            var tempTrack = Util.str.isNull(track)? "-1" : track;
            var tempWidth = Util.str.isNull(width)? "-1" : width;
            var tempHigh = Util.str.isNull(high)? "-1" : high;
            var tempX = Util.str.isNull(x)? "-1" : x;
            var tempY = Util.str.isNull(y)? "-1" : y;
            window.IMEService.Open(type,tempTrack,tempWidth,tempHigh,tempX,tempY,function(ret){
                console.log("<- imeService open");
            });

    };


    window.InputService = imeService;
})(window);

