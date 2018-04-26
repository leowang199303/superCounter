/**
 * 指纹仪
 */
var FingerCallBack = function(){};//channel回调
;(function (window,undefined) {

    var finger = {};

    function set(resolve){
        var callBack = function(ret){
            resolve(ret);
        }
        FingerCallBack = callBack;
    }
    /**
     * 打开串口
     */
    finger.open = function() {
        return new Promise(function(resolve,reject){
            console.log("-> idReader open");
            set(resolve);
            top.channelManagenent.ZTOpen(Dev.Finger,function(ret){
                console.log("<- idReader open :" + ret);
                // resolve(ret);
            });
        });
    };
    /**
     * 初始化
     * _mode 0(卡片不做处理),1(复位+退卡),2(复位+吞卡)
     */
    finger.reset = function(_mode) {
        return new Promise(function(resolve,reject){
            console.log("-> idReader reset");
            set(resolve);
            var mode = {};
            mode.MODE = Util.str.isNull(_mode)? "1" : _mode;
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_FIN_RESET,JSON.stringify(mode),Dev.Finger,function(ret){
                console.log("<- idReader reset :" + ret);
            });
        });
    };


    /**
     * 取消
     * _mode 0(取消全部命令),1(取消当前命令)
     */

    finger.cancel = function (_mode) {
        return new Promise(function(resolve,reject){
            console.log("-> idReader cancel");
            set(resolve);
            var mode = {};
            mode.CMDID = Util.str.isNull(_mode)? 0 : _mode;
            top.channelManagenent.ZTCancel(JSON.stringify(mode), Dev.Finger,function(ret){
                console.log("<- idReader cancel :" + ret);
            });
        });
    };


    /**
     *  获取设备状态
     *
     */
    finger.status = function () {
        return new Promise(function(resolve,reject){
            console.log("-> idReader status");
            set(resolve);
            top.channelManagenent.ZTExec(top.CmdCode.DAM_INF_FIN_STATUS, "", Dev.Finger,function(ret){
                console.log("<- idReader status :" + ret);
            });
        });
    };



    /**
     *  关闭设备
     *
     */
    finger.close = function(){
        return new Promise(function(resolve,reject){
            console.log("-> idReader close");
            set(resolve);
            top.channelManagenent.ZTClose(Dev.Finger,function(ret){
                console.log("<- idReader close :" + ret);
            });
        });
    };

    /**
     *  获取指纹模板
     *  template 生成模板文件路径
     *  timeOut 超时时间(单位：s)
     */
    finger.getTemplate = function (template, timeOut) {
        return new Promise(function(resolve,reject){
            console.log("-> idReader status");
            set(resolve);
            var sCmdData = {};
            sCmdData.TEMPLATE = Util.str.isNull(template)? "" : template;
            sCmdData.TIMEOUT = Util.str.isNull(timeOut)? 0 : timeOut;
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_FIN_GETTEMPLATE, JSON.stringify(sCmdData), Dev.Finger,function(ret){
                console.log("<- idReader status :" + ret);
            });
        });
    }

    /**
     *
     *  获取指纹特征码
     *  feature 生成特征文件路径
     *  timeOut 超时时间(单位：s)
     */
    finger.getFeature = function(feature, timeOut){
        return new Promise(function(resolve,reject){
            console.log("-> idReader status");
            set(resolve);
            var sCmdData = {};
            sCmdData.TEMPLATE = Util.str.isNull(feature)? "" : feature;
            sCmdData.TIMEOUT = Util.str.isNull(timeOut)? 0 : timeOut;
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_FIN_GETFEATURE, JSON.stringify(sCmdData), Dev.Finger,function(ret){
                console.log("<- idReader status :" + ret);
            });
        });
    }

    /**
     *  指纹匹配
     *
     *  feature 生成特征文件路径
     *  timeOut 超时时间(单位：s)
     */
    finger.getMatch = function (sFeature, sTemplate) {
        return new Promise(function(resolve,reject){
            console.log("-> idReader status");
            set(resolve);
            var sCmdData = {};
            sCmdData.FEATURE = Util.str.isNull(sFeature)? "" : sFeature;
            sCmdData.TEMPLATE = Util.str.isNull(sTemplate)? "" : sTemplate;
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_FIN_MATCH, JSON.stringify(sCmdData), Dev.Finger,function(ret){
                console.log("<- idReader status :" + ret);
            });
        });
    }

    window.Finger = finger;
})(window);

