/**
 * 二代身份证阅读器
 */
var IDCardReaderCallBack = function(){};//channel回调
;(function (window,undefined) {
	
	var idReader = {};
	
	function set(resolve){
		var callBack = function(ret){
			resolve(ret);
		}
		IDCardReaderCallBack = callBack;
	}
	/**
	 * 打开串口
	 */
	idReader.open = function() {
		return new Promise(function(resolve,reject){
            console.log("-> idReader open");
            set(resolve);
            top.channelManagenent.ZTOpen(Dev.IDCardReader,function(ret){
                console.log("<- idReader open :" + ret);
                // resolve(ret);
            });
        });
	};
	/**
	 * 初始化
	 * _mode 0(卡片不做处理),1(复位+退卡),2(复位+吞卡)
	 */
	idReader.reset = function(_mode) {
		return new Promise(function(resolve,reject){
			console.log("-> idReader reset");
			set(resolve);
			var mode = {};
			mode.MODE = Util.str.isNull(_mode)? "1" : _mode;
			top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_IDC_RESET,JSON.stringify(mode),Dev.IDCardReader,function(ret){
				console.log("<- idReader reset :" + ret);
			});
		});
	};
	/**
	 *获取身份证状态
	 */
	idReader.status = function() {
		return new Promise(function(resolve,reject){
			console.log("-> idReader status");
			set(resolve);
			top.channelManagenent.ZTExec(top.CmdCode.DAM_INF_IDC_STATUS,'',Dev.IDCardReader,function(ret){
				console.log("<- idReader status :" + ret);
			});
		});
	};
	
	/**
	 * 退卡
	 * _mode
	 */
	/*idReader.reject = function(_mode,callBack) {
		console.log("-> idReader reject");
		if(typeof callBack === "function"){
			IDCardReaderCallBack = callBack;
		}
		var mode = {};
		mode.TIMEOUT = Util.str.isNull(_mode)? 0 : _mode;
		top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_IDC_EJECT_CARD,JSON.stringify(mode),Dev.IDCardReader,function(ret){
			console.log("<- idReader reject :" + ret);
		});
	};*/
    idReader.reject = function(_mode) {
        return new Promise(function(resolve,reject){
            console.log("-> idReader reject");
            set(resolve);
            var mode = {};
            mode.TIMEOUT = Util.str.isNull(_mode)? 0 : _mode;
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_IDC_EJECT_CARD,JSON.stringify(mode),Dev.IDCardReader,function(ret){
                console.log("<- idReader reject :" + ret);
            });
        });
    };

	/**
	 * 取消
	 * _mode 0(取消全部命令),1(取消当前命令)
	 */
	/*idReader.cancel = function(_mode,callBack) {
		console.log("-> idReader cancel");
		if(typeof callBack === "function"){
			IDCardReaderCallBack = callBack;
		}
		var mode = {};
		mode.CMDID = Util.str.isNull(_mode)? 0 : _mode;
		top.channelManagenent.ZTCancel(JSON.stringify(mode), Dev.IDCardReader,function(ret){
			console.log("<- idReader cancel :" + ret);
		});
	};*/
    idReader.cancel = function(_mode) {
        return new Promise(function(resolve,reject){
            console.log("-> idReader cancel");
            set(resolve);
            var mode = {};
            mode.CMDID = Util.str.isNull(_mode)? 0 : _mode;
            top.channelManagenent.ZTCancel(JSON.stringify(mode), Dev.IDCardReader,function(ret){
                console.log("<- idReader cancel :" + ret);
            });
        });
    };
	
	/**
	 * 允许进卡 
	 * _mode 1(仅读磁道数据),2(读磁道+IC卡数据)
	 */
	/*idReader.read = function(_mode,callBack) {
		console.log("-> idReader read");
		if(typeof callBack === "function"){
			IDCardReaderCallBack = callBack;
		}
		var mode = {};
		mode.TRACKS = Util.str.isNull(_mode)? 1 : _mode;
		top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_IDC_READ_RAW_DATA,JSON.stringify(mode),Dev.IDCardReader,function(ret){
			console.log("<- idReader read :" + ret);
		});
	};*/
    idReader.read = function(_mode) {
        return new Promise(function(resolve,reject){
            console.log("-> idReader read");
            set(resolve);
            var mode = {};
            mode.TRACKS = Util.str.isNull(_mode)? 1 : _mode;
            // mode.TRACKS = _mode;
            top.channelManagenent.ZTExec(top.CmdCode.DAM_CMD_IDC_READ_RAW_DATA,JSON.stringify(mode),Dev.IDCardReader,function(ret){
                console.log("<- idReader read :" + ret);
            });
		});
    };

    /**
     *  关闭设备
     *
     */
	idReader.close = function(){
		return new Promise(function(resolve,reject){
			console.log("-> idReader close");
			set(resolve);
			top.channelManagenent.ZTClose(Dev.IDCardReader,function(ret){
				console.log("<- idReader close :" + ret);
			});
		});
	};
	window.IDCardReader = idReader;
})(window);

