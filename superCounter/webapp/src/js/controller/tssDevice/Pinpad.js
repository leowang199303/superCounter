/**
 *  密码键盘
 */
var PinpadCallBack = function() {}; //channel回调
;
(function(window, undefined) {

    var pinpad = {};

    function set(resolve) {
        var callBack = function(ret) {
            resolve(ret);
        }
        PinpadCallBack = callBack;
    }
    /**
     * 打开串口
     */
    pinpad.open = function() {
        return new Promise(function(resolve, reject) {
            console.log("-> pinpads open");
            set(resolve);
            top.channelManagenent.ZTOpen(Dev.Pinpad, function(ret) {
                console.log("<- pinpad open :" + ret);
                // resolve(ret);
            });
        });
    };

    /**
     * 初始化
     * _mode 0(卡片不做处理),1(复位+退卡),2(复位+吞卡)
     */
    pinpad.reset = function(_mode) {
        return new Promise(function(resolve, reject) {
            console.log("-> pinpad reset");
            set(resolve);
            var mode = {};
            mode.MODE = Util.str.isNull(_mode) ? "1" : _mode;
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_PIN_RESET, JSON.stringify(mode), Dev.Pinpad, function(ret) {
                console.log("<- pinpad reset :" + ret);
            });
        });
    };

    /**
     * 取消
     * _mode 0(取消全部命令),1(取消当前命令)
     */

    pinpad.cancel = function(_mode) {
        return new Promise(function(resolve, reject) {
            console.log("-> pinpad cancel");
            set(resolve);
            var mode = {};
            mode.CMDID = Util.str.isNull(_mode) ? 0 : _mode;
            top.channelManagenent.ZTCancel(JSON.stringify(mode), Dev.Pinpad, function(ret) {
                console.log("<- pinpad cancel :" + ret);
            });
        });
    };

    /**
     *  获取设备状态
     *
     */
    pinpad.status = function() {
        return new Promise(function(resolve, reject) {
            console.log("-> idReader status");
            set(resolve);
            top.channelManagenent.ZTExec(top.CmdCode.DAM_INF_PIN_STATUS, "", Dev.Pinpad, function(ret) {
                console.log("<- pinpad status :" + ret);
            });
        });
    };

    /**
     *  关闭设备
     *
     */
    pinpad.close = function() {
        return new Promise(function(resolve, reject) {
            console.log("-> pinpad close");
            set(resolve);
            top.channelManagenent.ZTClose(Dev.Pinpad, function(ret) {
                console.log("<- pinpad close :" + ret);
            });
        });
    };

    /**
     *  下载主密钥
     *  mWorkKey主密钥函数
     *  WorkKey工作密钥
     *  KeyValue密钥值
     *  KVCValue校验值
     */
    pinpad.pinpadDownloadKey = function(mWorkKey,workKey,keyValue,kvcValue) {
        return new Promise(function(resolve, reject) {
            console.log("-> pinpad pinpadDownloadKey");
            set(resolve);
            var sCmdData = {};
            sCmdData.MK = Util.str.isNull(mWorkKey) ? "" : mWorkKey;
            sCmdData.WK = Util.str.isNull(workKey) ? "" : workKey;
            sCmdData.KEYVALUE = Util.str.isNull(keyValue) ? "" : keyValue;
            sCmdData.KVCVALUE = Util.str.isNull(kvcValue) ? "" : kvcValue;
            var send = JSON.stringify(sCmdData);
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_PIN_IMPORT_KEY_EX,send,Dev.Pinpad,function(ret) {
                console.log("<- pinpad pinpadDownloadKey :" + ret);
            });
        })
    }

    /**
     *
     *  明文输入
     *  keyLength输入最大长度
     *  endOuto是否自动结束换行
     */
    pinpad.pinpadGetKey = function(keyLength,endOuto) {
        return new Promise(function(resolve, reject) {
            console.log("-> pinpad pinpadGetKey");
            set(resolve);
            var sCmdData = {};
            sCmdData.MAXLEN = Util.str.isNull(keyLength) ? "" : mWorkKey;
            sCmdData.AUTOEND = Util.str.isNull(endOuto) ? "" : endOuto;
            var send = JSON.stringify(sCmdData);
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_PIN_GET_DATA,send,Dev.Pinpad,function(ret) {
                console.log("<- idReader pinpadGetKey :" + ret);
            });
        })
    }

    /**
     * 密文输入
     * pinMinLength密文输入最小长度
     * pinMaxLength密文输入最大长度
     * pinEndOuto是否自动结束换行
     */
    pinpad.pinpadGetPin = function(pinMinLength,pinMaxLength,pinEndOuto) {
        return new Promise(function(resolve, reject) {
            console.log("-> pinpad pinpadGetPin");
            set(resolve);
            var sCmdData = {};
            sCmdData.MINLEN = Util.str.isNull(pinMinLength) ? "" : pinMinLength;
            sCmdData.MAXLEN = Util.str.isNull(pinMaxLength) ? "" : pinMaxLength;
            sCmdData.AUTOEND = Util.str.isNull(pinEndOuto) ? "" : pinEndOuto;
            var send = JSON.stringify(sCmdData);
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_PIN_GET_PIN,send,Dev.Pinpad,function(ret) {
                console.log("<- pinpad pinpadGetPin :" + ret);
            });

        })
    }

    /**
     *
     * 获取pinblock
     * mainKeyNo主密钥号0-127
     * workKeyNo工作密钥号0-127
     * cardNo卡号
     * pswFormat密码格式
     */
    pinpad.pinpadGetPinBlock = function(mainKeyNo,workKeyNo,cardNo,pswFormat) {
        return new Promise(function(resolve, reject) {
            console.log("-> pinpad pinpadGetPinBlock");
            set(resolve);
            var sCmdData = {};
            sCmdData.MK = Util.str.isNull(mainKeyNo) ? "" : mainKeyNo;
            sCmdData.MK = Util.str.isNull(workKeyNo) ? "" : workKeyNo;
            sCmdData.CardNo = Util.str.isNull(cardNo) ? "" : cardNo;
            sCmdData.KeyFormat = Util.str.isNull(pswFormat) ? "" : pswFormat;
            var send = JSON.stringify(sCmdData);
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_PIN_GET_PINBLOCK,send,Dev.Pinpad,function(ret) {
                console.log("<- pinpad pinpadGetPinBlock :" + ret);
            });

        })
    }

    /**
     *
     * des加密
     * mainKeyNo主密钥号(走SP时传密钥名)0-127
     * workKeyNo工作密钥号(走SP时传密钥名)0-127
     * data需要运算的数据
     * addPinWay DES加密算法
     */
    pinpad.pinpadDesAddPin = function(mainKeyNo,workKeyNo,data,addPinWay) {
        return new Promise(function(resolve, reject) {
            console.log("-> pinpad pinpadDesAddPin");
            set(resolve);
            var sCmdData = {};
            sCmdData.MK = Util.str.isNull(mainKeyNo) ? "" : mainKeyNo;
            sCmdData.WK = Util.str.isNull(workKeyNo) ? "" : workKeyNo;
            sCmdData.TYPE = "1";
            sCmdData.DATA = Util.str.isNull(data) ? "" : data;
            sCmdData.MODE = Util.str.isNull(addPinWay) ? "" : addPinWay;
            var send = JSON.stringify(sCmdData);
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_PIN_CRYPT,send,Dev.Pinpad,function(ret) {
                console.log("<- pinpad pinpadDesAddPin :" + ret);
            });

        })
    }

    /**
     *
     * des解密
     * mainKeyNo 主密钥号0-127(走SP时传密钥名)
     * workKeyNo 工作密钥号0-127(走SP时传密钥名)
     * data 需要运算的数据
     * addPinWay DES解密算法
     */
    pinpad.pinpadDesOut = function(mainKeyNo,workKeyNo,data,addPinWay) {
        return new Promise(function(resolve, reject) {
            console.log("-> pinpad pinpadDesOut");
            set(resolve);
            var sCmdData = {};
            sCmdData.MK = Util.str.isNull(mainKeyNo) ? "" : mainKeyNo;
            sCmdData.WK = Util.str.isNull(workKeyNo) ? "" : workKeyNo;
            sCmdData.TYPE = "0";
            sCmdData.DATA = Util.str.isNull(data) ? "" : data;
            sCmdData.MODE = Util.str.isNull(addPinWay) ? "" : addPinWay;
            var send = JSON.stringify(sCmdData);
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_PIN_CRYPT,send,Dev.Pinpad,function(ret) {
                console.log("<- pinpad pinpadDesOut :" + ret);
            });

        })
    }

    /**
     *
     * 计算mac
     * mainKeyNo 主密钥号或密钥名
     * workKeyNo 工作密钥号或密钥名
     * data 数据
     * macWay MAC算法
     */
    pinpad.pinpadCalculateMAC = function(mainKeyNo,workKeyNo,data,macWay) {
        return new Promise(function(resolve, reject) {
            console.log("-> pinpad pinpadCalculateMAC");
            set(resolve);
            var sCmdData = {};
            sCmdData.MK = Util.str.isNull(mainKeyNo) ? "" : mainKeyNo;
            sCmdData.WK = Util.str.isNull(workKeyNo) ? "" : workKeyNo;
            sCmdData.TYPE = "0";
            sCmdData.DATA = Util.str.isNull(data) ? "" : data;
            sCmdData.MODE = Util.str.isNull(macWay) ? "" : macWay;
            var send = JSON.stringify(sCmdData);
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_PIN_MAC,send,Dev.Pinpad,function(ret) {
                console.log("<- pinpad pinpadCalculateMAC :" + ret);
            });
        })
    }
    window.Pinpad = pinpad;
})(window);