/**
 * 指纹仪
 */
var CameraCallBack = function(){};//channel回调
;(function (window,undefined) {

    var camera = {};

    function set(resolve){
        var callBack = function(ret){
            resolve(ret);
        }
        CameraCallBack = callBack;
    }
    /**
     * 打开串口
     */
    camera.open = function() {
        return new Promise(function(resolve,reject){
            console.log("-> idReader open");
            set(resolve);
            top.channelManagenent.ZTOpen(Dev.Camera,function(ret){
                console.log("<- idReader open :" + ret);
                // resolve(ret);
            });
        });
    };
    /**
     * 初始化
     * _mode 0(卡片不做处理),1(复位+退卡),2(复位+吞卡)
     */
    camera.reset = function(_mode) {
        return new Promise(function(resolve,reject){
            console.log("-> idReader reset");
            set(resolve);
            var mode = {};
            mode.MODE = Util.str.isNull(_mode)? "1" : _mode;
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_CAM_RESET,JSON.stringify(mode),Dev.Camera,function(ret){
                console.log("<- idReader reset :" + ret);
            });
        });
    };


    /**
     * 取消
     * _mode 0(取消全部命令),1(取消当前命令)
     */

    camera.cancel = function (_mode) {
        return new Promise(function(resolve,reject){
            console.log("-> idReader cancel");
            set(resolve);
            var mode = {};
            mode.CMDID = Util.str.isNull(_mode)? 0 : _mode;
            top.channelManagenent.ZTCancel(JSON.stringify(mode), Dev.Camera,function(ret){
                console.log("<- idReader cancel :" + ret);
            });
        });
    };


    /**
     *  获取设备状态
     *
     */
    camera.status = function () {
        return new Promise(function(resolve,reject){
            console.log("-> idReader status");
            set(resolve);
            top.channelManagenent.ZTExec(top.CmdCode.DAM_INF_CAM_STATUS, "", Dev.Camera,function(ret){
                console.log("<- idReader status :" + ret);
            });
        });
    };



    /**
     *  关闭设备
     *
     */
    camera.close = function(){
        return new Promise(function(resolve,reject){
            console.log("-> idReader close");
            set(resolve);
            top.channelManagenent.ZTClose(Dev.Camera,function(ret){
                console.log("<- idReader close :" + ret);
            });
        });
    };

    /**
     *
     *  拍照
     *  image  照片保存路径
     *  camId1 摄像头编码
     */
    camera.takePicture = function(image, camId1){
        return new Promise(function(resolve,reject){
            console.log("-> idReader takePicture");
            set(resolve);
            var sCmdData = {};
            sCmdData.IMAGE = Util.str.isNull(image)? 0 : image;
            sCmdData.CAMID = Util.str.isNull(camId1)? "" : camId1;
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_CAM_TAKE_PICTURE,JSON.stringify(sCmdData),Dev.Camera,function(ret){
                console.log("<- idReader takePicture :" + ret);
            });
        });
    };

    /**
     * 预览
     *  action  0 - 关闭预览 1- 开启预览
     *  camId1 摄像头编码
     */
    camera.displayPicture = function(action, camId1){
        return new Promise(function(resolve,reject){
            console.log("-> idReader displayPicture");
            set(resolve);
            var sCmdData = {};
            sCmdData.ACTION = Util.str.isNull(action)? 0 : action;
            sCmdData.CAMID = Util.str.isNull(camId1)? "" : camId1;
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_CAM_DIAPLAY,JSON.stringify(sCmdData),Dev.Camera,function(ret){
                console.log("<- idReader displayPicture :" + ret);
            });
        });
    };

    window.Camera = camera;
})(window);

