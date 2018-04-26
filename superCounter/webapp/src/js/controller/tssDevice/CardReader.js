/**
 * 二代身份证阅读器
 */
var CardReaderCallBack = function(){};//channel回调
;(function (window,undefined) {

    var icReader = {};

    function set(resolve){
        var callBack = function(ret){
            resolve(ret);
        }
        CardReaderCallBack = callBack;
    }
    /**
     * 打开串口
     */
    icReader.open = function() {
        return new Promise(function(resolve,reject){
            console.log("-> idReader open");
            set(resolve);
            top.channelManagenent.ZTOpen(Dev.CardReader,function(ret){
                console.log("<- idReader open :" + ret);
                // resolve(ret);
            });
        });
    };
    /**
     * 初始化
     * _mode 0(卡片不做处理),1(复位+退卡),2(复位+吞卡)
     */
    icReader.reset = function(_mode) {
        return new Promise(function(resolve,reject){
            console.log("-> idReader reset");
            set(resolve);
            var mode = {};
            mode.MODE = Util.str.isNull(_mode)? "1" : _mode;
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_IDC_RESET,JSON.stringify(mode),Dev.CardReader,function(ret){
                console.log("<- idReader reset :" + ret);
            });
        });
    };


    /**
     * 退卡
     * _mode
     */
    /*icReader.reject = function(_mode,callBack) {
        console.log("-> idReader reject");
        if(typeof callBack === "function"){
            IDCardReaderCallBack = callBack;
        }
        var mode = {};
        mode.TIMEOUT = Util.str.isNull(_mode)? 0 : _mode;
        top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_IDC_EJECT_CARD,JSON.stringify(mode),Dev.CardReader,function(ret){
            console.log("<- idReader reject :" + ret);
        });
    };*/
    icReader.reject = function (_mode) {
        return new Promise(function(resolve,reject){
            console.log("-> idReader cancel");
            set(resolve);
            var mode = {};
            mode.TIMEOUT = Util.str.isNull(_mode)? 0 : _mode;
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_IDC_EJECT_CARD,JSON.stringify(mode),Dev.CardReader,function(ret){
                console.log("<- idReader reject :" + ret);
            });
        });
    };

    /**
     * 取消
     * _mode 0(取消全部命令),1(取消当前命令)
     */
    /*icReader.cancel = function(_mode,callBack) {
        console.log("-> idReader cancel");
        if(typeof callBack === "function"){
            IDCardReaderCallBack = callBack;
        }
        var mode = {};
        mode.CMDID = Util.str.isNull(_mode)? 0 : _mode;
        top.channelManagenent.ZTCancel(JSON.stringify(mode), Dev.CardReader,function(ret){
            console.log("<- idReader cancel :" + ret);
        });
    };*/
    icReader.cancel = function (_mode) {
        return new Promise(function(resolve,reject){
            console.log("-> idReader cancel");
            set(resolve);
            var mode = {};
            // mode.CMDID = Util.str.isNull(_mode)? 0 : _mode;
            mode.CMDID = _mode;
            top.channelManagenent.ZTCancel(JSON.stringify(mode), Dev.CardReader,function(ret){
                console.log("<- idReader cancel :" + ret);
            });
        });
    };


    /**
     * 允许进卡
     * _mode 1(仅读磁道数据),2(读磁道+IC卡数据)
     */
    /*icReader.read = function(_mode,callBack) {
        console.log("-> idReader read");
        if(typeof callBack === "function"){
            IDCardReaderCallBack = callBack;
        }
        var mode = {};
        // mode.TRACKS = Util.str.isNull(_mode)? 1 : _mode;
        mode.TRACKS = _mode;
        top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_IDC_READ_RAW_DATA,JSON.stringify(mode),Dev.CardReader,function(ret){
            console.log("<- idReader read :" + ret);
        });
    };*/
    icReader.read = function (_mode) {
        return new Promise(function(resolve,reject){
            console.log("-> idReader read");
            set(resolve);
            var mode = {};
            mode.TRACKS = Util.str.isEmpty(_mode)? 1 : _mode;
            mode.TRACKS = _mode;
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_IDC_READ_RAW_DATA,JSON.stringify(mode),Dev.CardReader,function(ret){
                console.log("<- idReader read :" + ret);
            });
        });
    };


    /**
     *
     *  复位吞卡数
     */
    icReader.resetCardCount = function () {
        return new Promise(function(resolve,reject){
            console.log("-> idReader resetCardCount");
            set(resolve);
            top.channelManagenent.ZTClose(top.CmdCode.DAM_CMD_IDC_RESET_COUNT, "", Dev.CardReader, function(ret){
                console.log("<- idReader resetCardCount :" + ret);
            });
        });
    };
    /**
     *  获取设备状态
     *
     */
    icReader.status = function () {
        return new Promise(function(resolve,reject){
            console.log("-> idReader status");
            set(resolve);
            top.channelManagenent.ZTExec(top.CmdCode.DAM_INF_IDC_STATUS, "", Dev.CardReader,function(ret){
                console.log("<- idReader status :" + ret);
            });
        });
    };

    /**
     *
     *  执行apdu
     * type 0 - 非接触式IC卡, 1 - 接触式IC卡
     * protrol 0 - 按T=0协议, 1 - 按T=1协议
     * apdu 00A40000023F00
     *
     */
    icReader.icApdu = function (type, protrol, apdu) {
        return new Promise(function(resolve,reject){
            console.log("-> idReader icApdu");
            set(resolve);
            var sCmdData = {};
            sCmdData.TYPE = Util.str.isNull(type)? 0 : type;
            sCmdData.Protrol = Util.str.isNull(protrol)? 0 : protrol;
            sCmdData.APDUIN = Util.str.isNull(apdu)? 1 : apdu;
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_IDC_CHIP_IO, JSON.stringify(sCmdData), Dev.CardReader,function(ret){
                console.log("<- idReader icApdu :" + ret);
            });
        });
    };

    /**
     *
     *  写卡操作
     *
     */
    icReader.writeCard = function (sTrack1, sTrack2, sTrack3) {
        return new Promise(function(resolve,reject){
            console.log("-> idReader writeCard");
            set(resolve);
            var sCmdData = {};
            sCmdData.TRACK1 = Util.str.isNull(sTrack1)? 0 : sTrack1;
            sCmdData.TRACK2 = Util.str.isNull(sTrack2)? 0 : sTrack2;
            sCmdData.TRACK3 = Util.str.isNull(sTrack3)? 0 : sTrack3;
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_IDC_WRITE_RAW_DATA, JSON.stringify(sCmdData), Dev.CardReader,function(ret){
                console.log("<- idReader writeCard :" + ret);
            });
        });
    }

    /**
     *  吞卡
     *
     */
    icReader.retainCard = function () {
        return new Promise(function(resolve,reject){
            console.log("-> idReader retainCard");
            set(resolve);
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_IDC_RETAIN_CARD, "", Dev.CardReader,function(ret){
                console.log("<- idReader retainCard :" + ret);
            });
        });
    }

    /**
     *  关闭设备
     *
     */
    icReader.close = function(){
        return new Promise(function(resolve,reject){
            console.log("-> idReader close");
            set(resolve);
            top.channelManagenent.ZTClose(Dev.CardReader,function(ret){
                console.log("<- idReader close :" + ret);
            });
        });
    };
    window.CardReader = icReader;
})(window);

