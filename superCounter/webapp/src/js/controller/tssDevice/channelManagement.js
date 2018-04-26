var channelManagenent = {};
var zt_web_socket = null;
channelManagenent.ztinit = function () {
	return new Promise(function(resolve, reject) {
		zt_web_socket = new WebSocket(Constant.websocket_url);
	    zt_web_socket.onclose = function () {
	        reject(new Error("QT服务关闭"));
	    };
	    zt_web_socket.onerror = function (error) {
	        reject(new Error("QT服务异常"));
	    };
	    zt_web_socket.onopen = function () {
	        new QWebChannel(zt_web_socket, function (channel) {
	        	try{

                    // window.CardReader = channel.objects.CardReader;
                    // Dev.IDCardReader = channel.objects.IDCardReader;
                    // Dev.IDCardReader.sigDeviceCallBack.connect(function(ret){
                    //     console.info("ret"+ret);
                    //     IDCardReaderCallBack(ret);
                    // });
                    // window.Tools = channel.objects.Tools;

	        		// window.File.getINIInfo("TERM","termType","",window.Constant.termConfigPath).then(function(ret){
	        		// 	if(ret == "1"){
	        		// 		console.info("终端类型:"+ret);
	        		// 		Dev["ICCardReader"] = null;
	        		// 		Dev["CardReader"] = null;
	        		// 	}
                        // window.EmvService = channel.objects.EmvService;
    	            	// window.RSAService = channel.objects.RSAService;
      	            	 window.IMEService = channel.objects.IMEService;
    	            	for(var p in Dev){
    	            		Dev[p] = eval("channel.objects."+p);
                            console.info("p->"+p);
    	                    eval("Dev[p].sigDeviceCallBack.connect(function(ret){" +
    	                    		"var result={};" +
    	                    		"result.id=\"\";" +
    	                    		"result.stat=\"\";" +
    	                    		"result.val=\"\";" +
    	                    		"result.code=\"\";" +
									"console.info(ret);" +
    	                    		"if(ret&&ret.length==4){" +
    	                    			"result.id=ret[0];" +
    	                    			"result.stat=ret[1];" +
    	                    			"result.val=ret[2];" +
    	                    			"result.code=ret[3];" +
    	                    			"console.info(JSON.stringify(result));" +
    	                    		"};" +
    	                    		""+p+"CallBack(result);})"
    	                    		);
    	            	}
	        		// })
	            
	        	}catch(err){
	        		console.error("channelManagenent.ztinit error->"+err);
	        		reject(new Error('绑定服务失败'));
	        	}
	            resolve();
	        });
	    };
	});
};
/**
 * 执行命令
 */
channelManagenent.ZTExec = function (zticmd, ztdata,device,callbackFun) {
	device.ZTExec(zticmd,ztdata,0, function (ret) {callbackFun(ret);});
};
/**
 * 打开设备
 */
channelManagenent.ZTOpen = function (device,callbackFun) {
		device.ZTOpen(CmdCode.WFS_OPEN, 0, function (ret) {callbackFun(ret);})
    // device.ZTOpen(1, 0, function (ret) {callbackFun(ret);})
};
/**
 * 取消操作
 * ztdata : CMDID 0:取消全部  1: 取消当前命令
 */
channelManagenent.ZTCancel = function (ztdata,device,callbackFun) {
	device.ZTCancel(CmdCode.WFS_CANCEL,ztdata, function (ret) {callbackFun(ret);})
};
/**
 * 关闭设备
 */
channelManagenent.ZTClose = function (device,callbackFun) {
	device.ZTClose(CmdCode.WFS_CLOSE,0, function (ret) {callbackFun(ret);})
};