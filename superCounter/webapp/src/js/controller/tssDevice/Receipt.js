/**
 *  打印机
 */
var ReceiptCallBack = function(){};//channel回调
;(function (window,undefined) {

    var receipt = {};

    function set(resolve){
        var callBack = function(ret){
            resolve(ret);
        }
        FingerCallBack = callBack;
    }
    /**
     * 打开串口
     */
    receipt.open = function() {
        return new Promise(function(resolve,reject){
            console.log("-> idReader open");
            set(resolve);
            top.channelManagenent.ZTOpen(Dev.Receipt,function(ret){
                console.log("<- idReader open :" + ret);
                // resolve(ret);
            });
        });
    };
    /**
     * 初始化
     * _mode 0(卡片不做处理),1(复位+退卡),2(复位+吞卡)
     */
    receipt.reset = function(_mode) {
        return new Promise(function(resolve,reject){
            console.log("-> idReader reset");
            set(resolve);
            var mode = {};
            mode.MODE = Util.str.isNull(_mode)? "1" : _mode;
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_PTR_RESET,JSON.stringify(mode),Dev.Receipt,function(ret){
                console.log("<- idReader reset :" + ret);
            });
        });
    };


    /**
     * 取消
     * _mode 0(取消全部命令),1(取消当前命令)
     */

    receipt.cancel = function (_mode) {
        return new Promise(function(resolve,reject){
            console.log("-> idReader cancel");
            set(resolve);
            var mode = {};
            mode.CMDID = Util.str.isNull(_mode)? 0 : _mode;
            top.channelManagenent.ZTCancel(JSON.stringify(mode), Dev.Receipt,function(ret){
                console.log("<- idReader cancel :" + ret);
            });
        });
    };


    /**
     *  获取设备状态
     *
     */
    receipt.status = function () {
        return new Promise(function(resolve, reject){
            console.log("-> idReader status");
            set(resolve);
            top.channelManagenent.ZTExec(top.CmdCode.DAM_INF_PTR_STATUS, "", Dev.Receipt,function(ret){
                console.log("<- idReader status :" + ret);
            });
        });
    };

    /**
     *  关闭设备
     *
     */
    receipt.close = function(){
        return new Promise(function(resolve,reject){
            console.log("-> idReader close");
            set(resolve);
            top.channelManagenent.ZTClose(Dev.Receipt,function(ret){
                console.log("<- idReader close :" + ret);
            });
        });
    };

    /**
     *  设置字体(非WOSA)
     *  height字体高度  width字体宽度
     */
    receipt.SetFontDlg = function(height, width) {
        return new Promise(function(resolve, reject) {
            console.log("-> idReader SetFontDlg");
            set(resolve);
            var sCmdData = {};
            sCmdData.HEIGHT = height;
            sCmdData.WIDTH = width;
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_PTR_SET_FONT, JSON.stringify(sCmdData), Dev.Receipt,function(ret){
                console.log("<- idReader SetFontDlg :" + ret);
            });
        })
    }


    /**
     *  设置粗体(非WOSA)
     *  bold 粗体模式
     */
    receipt.setBoldDlg = function(bold) {
        return new Promise(function(resolve, reject) {
            console.log("-> idReader setBoldDlg");
            set(resolve);
            var sCmdData = {};
            sCmdData.MODE = Util.str.isNull(bold)? "0" : bold;;
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_PTR_SET_BOLD, JSON.stringify(sCmdData), Dev.Receipt,function(ret){
                console.log("<- idReader setBoldDlg :" + ret);
            });
        })
    }


    /**
     *  退纸/折
     *  _mode 超时时间
     */
    receipt.receiptControlMediaSec = function(_mode) {
        return new Promise(function(resolve, reject) {
            console.log("-> idReader ReceiptControlMediaSec");
            set(resolve);
            var mode = {};
            mode.MODE = Util.str.isNull(_mode)? "0" : _mode;
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_PTR_CONTROLMEDIA, JSON.stringify(mode),Dev.Receipt,function(ret){
                console.log("<- idReader ReceiptControlMediaSec :" + ret);
            });
        })
    }

    /**
     *  打印行数据
     *  prtData 需打印的数据	  lineNo 行号(存打使用)
     */
    receipt.receiptReadRawData = function(prtData, lineNo) {
        return new Promise(function(resolve, reject) {
            console.log("-> idReader ReceiptReadRawData");
            set(resolve);
            var sCmdData = {};
            sCmdData.DATA = prtData;
            sCmdData.LINENO = lineNo;
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_PTR_RAW_DATA, JSON.stringify(mode),Dev.Receipt,function(ret){
                console.log("<- idReader ReceiptReadRawData :" + ret);
            });
        })
    }

    /**
     *  Form打印
     *  FormName Form名
     *  MediaName Media名
     *  FormData 打印数据
     */
    receipt.receiptPrintForm = function(FormName, MediaName, FormData) {
        return new Promise(function(resolve, reject) {
            console.log("-> idReader ReceiptPrintForm");
            set(resolve);
            var sCmdData = {};
            sCmdData.FormName = FormName;
            sCmdData.MediaName = MediaName;
            sCmdData.Data = FormData;
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_PTR_PRINT_FORM, JSON.stringify(sCmdData),Dev.Receipt,function(ret){
                console.log("<- idReader ReceiptPrintForm :" + ret);
            });
        })
    }


    /**
     *  打印位图(非WOSA)
     */




    /**
     *  打印条码(非WOSA)
     *  CodeType 条码类型
     *  CodeData 条码数据
     */
    receipt.receiptPrintCode = function(CodeType, CodeData) {
        return new Promise(function(resolve, reject) {
            console.log("-> idReader ReceiptPrintCode");
            set(resolve);
            var sCmdData = {};
            sCmdData.TYPE = CodeType;
            sCmdData.DATA = CodeData;
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_PTR_PRINT_BARCODE, JSON.stringify(sCmdData),Dev.Receipt,function(ret){
                console.log("<- idReader ReceiptPrintCode :" + ret);
            });
        })
    }


    /**
     *  读存折
     *  PassBookForm Form名
     */
    receipt.receiptReadPassBook = function(PassBookForm) {
        return new Promise(function(resolve, reject) {
            console.log("-> idReader ReceiptReadPassBook");
            set(resolve);
            var sCmdData = {};
            sCmdData.Form = PassBookForm;
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_PTR_READPASSBOOK, JSON.stringify(sCmdData),Dev.Receipt,function(ret){
                console.log("<- idReader ReceiptReadPassBook :" + ret);
            });
        })
    }

    /**
     *  写存折磁道
     *  track2 二磁道数据
     *  track3 三磁道数据
     */
    receipt.receiptWritePassBook = function(track2, track3) {
        return new Promise(function(resolve, reject) {
            console.log("-> idReader ReceiptWritePassBook");
            set(resolve);
            var sCmdData = {};
            sCmdData.TRACK2 = track2;
            sCmdData.TRACK3 = track3;
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_PTR_WRITEPASSBOOK, JSON.stringify(sCmdData),Dev.Receipt,function(ret){
                console.log("<- idReader ReceiptWritePassBook :" + ret);
            });
        })
    }
    window.Printer = receipt;
})(window);
