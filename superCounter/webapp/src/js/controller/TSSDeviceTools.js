;(function (window,undefined) {

    var tssDeviceTools = {};

    /**
     * 初始化设备
     */
    tssDeviceTools.initDevice = function () {
        return new Promise(function(resolve,reject) {
        	//判断程序是否运行在外设上
        	var msg = JSON.parse(sessionStorage.getItem('msg'))
        	var mock = msg.mock; 
        	if(mock){
        		console.log('程序未运行在外设上，为模拟数据');
        		resolve(true);
        		return;
        	}
            if(Dev.IDCardReader == null){
                channelManagenent.ztinit().then(function (data) {
                    resolve(true);
                });
            }else{
                resolve(true);
            }
        });
    };


    /**
     *  读取卡片数据
     *  mode :
     *  1(仅读磁道数据)
     *  2(读磁道+IC卡数据)
     *  timeout (s)
     */
    tssDeviceTools.icReaderRead = function (mode, timeout) {
        return new Promise(function(resolve,reject){
       	var msg = JSON.parse(sessionStorage.getItem('msg'))
        var mock = msg.mock;
        var num = msg.bankcard;
        	if(mock){     
        		console.log('读取模拟银行卡信息');
        		console.log(num)
        		resolve(num);
        		return;
        	}
            CardReader.open().then(function (openStuts) {
                if (openStuts.stat == Constant.SUCCESS) {
                    CardReader.read(mode).then(function (cardData) {
                        // console.info("cardData : " + cardData);
                        if (cardData.stat == Constant.SUCCESS) {
                            CardReader.reject(timeout).then(function (rejectData) {
                                if(rejectData.stat == Constant.SUCCESS){
                                    // console.info("rejectData : " + rejectData);
                                    var tempData = rejectData.val;
                                    var icCardData = JSON.parse(tempData);
                                    ICCardInfoEntity.track1 = icCardData.TRACK1;
                                    ICCardInfoEntity.track2 = icCardData.TRACK2;
                                    ICCardInfoEntity.cardNo = icCardData.TRACK2.split("=")[0];
                                    ICCardInfoEntity.track3 = icCardData.TRACK3;
                                    ICCardInfoEntity.atr = icCardData.ATR;
                                    resolve(ICCardInfoEntity);
                                }
                                else{
                                    reject(new Error("退卡失败!"));
                                }
                                CardReader.close();
                            });

                        } else {
                            reject(new Error("获取读卡器信息失败"));
                        }

                    });
                    // IDCardReader.close();
                } else {
                    reject(new Error("打开读卡器失败"));
                    CardReader.close();
                }
            });
        });
    };

    /**
     *  执行apdu
     */
    tssDeviceTools.icReaderApdu = function (type, protrol, apdu) {
        return new Promise(function(resolve,reject){
            CardReader.open().then(function (openStuts){
                if (openStuts.stat == Constant.SUCCESS) {
                    // console.info(ret);
                    CardReader.icApdu(type, protrol, apdu).then(function (apduData) {
                        if (apduData.stat == Constant.SUCCESS) {
                            resolve(apduData);
                        } else {
                            reject(new Error("读卡器复位失败"));
                        }
                        console.info("cardData : " + apduData);
                    });
                    CardReader.close();
                }else{
                    reject(new Error("打开读卡器失败"));
                }
            });
        });
    };

    /**
     *  写卡
     *
     */
    tssDeviceTools.icReaderWriteCard = function (sTrack1, sTrack2, sTrack3) {
        return new Promise(function(resolve,reject){
            CardReader.open().then(function (openStuts){
                if (openStuts.stat == Constant.SUCCESS) {
                    // console.info(ret);
                    CardReader.writeCard(sTrack1, sTrack2, sTrack3).then(function (apduData) {
                        if (apduData.stat == Constant.SUCCESS) {
                            resolve(apduData);
                        } else {
                            reject(new Error("写卡失败失败"));
                        }
                        console.info("cardData : " + apduData);
                    });
                    CardReader.close();
                }else{
                    reject(new Error("打开读卡器失败"));
                }
            });
        });
    };

    /**
     *  退卡
     *  timeOut 退卡时间
     */
    tssDeviceTools.icReaderReject = function (timeOut) {
        return new Promise(function(resolve,reject){
            CardReader.open().then(function (openStuts){
                if (openStuts.stat == Constant.SUCCESS) {
                    CardReader.reject(timeOut).then(function (cardData) {
                        if (cardData.stat == Constant.SUCCESS) {
                            resolve(cardData);
                        } else {
                            reject(new Error("退卡失败"));
                        }
                        console.info("cardData : " + cardData);
                    });
                    CardReader.close();
                }else{
                    reject(new Error("打开读卡器失败"));
                }
            });
        });
    };

    /**
     *  吞卡
     *
     */
    tssDeviceTools.icReaderRetainCard = function () {
        return new Promise(function(resolve,reject){
            CardReader.open().then(function (openStuts){
                if (openStuts.stat == Constant.SUCCESS) {
                    CardReader.retainCard(mode).then(function (cardData) {
                        if (cardData.stat == Constant.SUCCESS) {
                            resolve(cardData);
                        } else {
                            reject(new Error("读卡器复位失败"));
                        }
                        console.info("cardData : " + cardData);
                    });
                    CardReader.close();
                }else{
                    reject(new Error("打开读卡器失败"));
                }
            });
        });
    };

    /**
     * 复位读卡器
     *
     * mode :
     * 0(卡片不做处理),
     * 1(复位+退卡),
     * 2(复位+吞卡)
     */
    tssDeviceTools.icReaderReset = function (mode) {
        return new Promise(function(resolve,reject){
            CardReader.open().then(function (openStuts){
                if (openStuts.stat == Constant.SUCCESS) {
                    CardReader.reset(mode).then(function (cardData) {
                        if (cardData.stat == Constant.SUCCESS) {
                            resolve(cardData);
                        } else {
                            reject(new Error("读卡器复位失败"));
                        }
                        console.info("cardData : " + cardData);
                    });
                    CardReader.close();
                }else{
                    reject(new Error("打开读卡器失败"));
                }
            });
        });
    };

    /**
     *
     *  复位吞卡数量
     *
     */
    tssDeviceTools.icReaderResetCardCount = function () {
        return new Promise(function (resolve, reject) {
            CardReader.open().then(function (openStuts) {
                if (openStuts.stat == Constant.SUCCESS) {
                    // console.info(ret);
                    CardReader.resetCardCount().then(function (cardData) {
                        if (cardData.stat == Constant.SUCCESS) {
                            resolve(cardData);
                        } else {
                            reject(new Error("读卡器复位失败"));
                        }
                        console.info("cardData : " + cardData);
                    });
                    CardReader.close();
                } else {
                    reject(new Error("打开读卡器失败"));
                    CardReader.close();
                }
            });
        });
    };


    /**
     *
     * 获取卡片读取状态
     */
    tssDeviceTools.icReaderStatus = function () {
        return new Promise(function (resolve, reject) {
            CardReader.open().then(function (openStuts) {
                if (openStuts.stat == Constant.SUCCESS) {
                    // console.info(ret);
                    CardReader.status().then(function (cardData) {
                        if (cardData.stat == Constant.SUCCESS) {
                            resolve(cardData);
                        } else {
                            reject(new Error("获取卡片读取状态失败"));
                        }
                        console.info("cardData : " + cardData);
                    });
                    CardReader.close();
                } else {
                    reject(new Error("打开读卡器失败"));
                    CardReader.close();
                }
            });
        });
    };

    /**
     *
     * 取消卡片外设操作
     * mode 0(取消全部命令),1(取消当前命令)
     */
    tssDeviceTools.icReaderCancel = function (mode) {
        return new Promise(function (resolve, reject) {
            CardReader.open().then(function (openStuts) {
                if (openStuts.stat == Constant.SUCCESS) {
                    // console.info(ret);
                    CardReader.cancel(mode).then(function (cardData) {
                        if (cardData.stat == Constant.SUCCESS) {
                            resolve(cardData);
                        } else {
                            reject(new Error("获取卡片读取状态失败"));
                        }
                        console.info("cardData : " + cardData);
                    });
                    CardReader.close();
                } else {
                    reject(new Error("打开读卡器失败"));
                    CardReader.close();
                }
            });
        });
    };


    /**
     * 获取身份证
     */
    tssDeviceTools.idReaderRead = function (mode, timeout) {
        return new Promise(function (resolve, reject) {
       	var msg = JSON.parse(sessionStorage.getItem('msg'))
        	var mock = msg.mock;  
        	if(mock){
        		console.log('获取模拟身份证信息');
        		 resolve(msg.idCard);
        		 return;
        	}
            IDCardReader.open().then(function (openStuts) {
                if (openStuts.stat == Constant.SUCCESS) {
                    IDCardReader.read(mode).then(function (cardData) {
                        // console.info("cardData : " + cardData);
                        if (cardData.stat == Constant.SUCCESS) {
                            IDCardReader.reject(timeout).then(function (rejectData) {
                                if(rejectData.stat == Constant.SUCCESS){
                                    // console.info("rejectData : " + rejectData);
                                    var tempData = rejectData.val;
                                    var personData = JSON.parse(tempData);
                                    var track2 = personData.TRACK2;
                                    var person = track2.split("|");
                                    // console.info("track2 : " +  track2);
                                    IDCardInfoEntity.name = person[1];
                                    IDCardInfoEntity.sex = person[2];
                                    IDCardInfoEntity.ethnicity = person[3];
                                    IDCardInfoEntity.birthday = person[4];
                                    IDCardInfoEntity.address = person[5];
                                    IDCardInfoEntity.idNumber = person[6];
                                    IDCardInfoEntity.authority = person[7];
                                    IDCardInfoEntity.expiryDate = person[8];
                                    IDCardInfoEntity.upPhoto = person[9];
                                    IDCardInfoEntity.bgPhoto= person[10];
                                    // console.info("tempData : " + tempData);
                                    resolve(IDCardInfoEntity);
                                }
                                else{
                                    reject(new Error("退卡失败!"));
                                }
                                IDCardReader.close();
                            });

                        } else {
                            reject(new Error("获取身份证信息失败"));
                        }

                    });
                    // IDCardReader.close();
                } else {
                    reject(new Error("打开身份证器失败"));
                    IDCardReader.close();
                }
            });
        });
    };

    /**
     *  启动密码键盘
     *
     */
    tssDeviceTools.doPassword  = function (keyLength,endOuto) {
        return new Promise(function (resolve, reject) {
            Pinpad.open().then(function (openStuts) {
                if (openStuts.stat == Constant.SUCCESS) {
                    // console.info(ret);
                    Pinpad.pinpadGetKey(keyLength, endOuto, function (keydata) {
                        console.info("keydata" + keydata);
                    });
                    // Pinpad.close();
                } else {
                    reject(new Error("启动密码键盘失败"));
                    Pinpad.close();
                }
            });
        });
    };


    /**
     *  启动摄像头 拍照
     *
     */
    tssDeviceTools.cameraTakePicture = function (image, camId1){
        return new Promise(function (resolve, reject) {
            Camera.open().then(function (openStuts) {
                if (openStuts.stat == Constant.SUCCESS) {
                    // console.info(ret);
                    Camera.takePicture(image, camId1).then(function (cardData) {
                        if (cardData.stat == Constant.SUCCESS) {
                            resolve(cardData);
                        } else {
                            reject(new Error("获取摄像头拍照失败"));
                        }
                        console.info("cardData : " + cardData);
                    });
                    Camera.close();
                } else {
                    reject(new Error("打开摄像头失败"));
                    Camera.close();
                }
            });
        });
    };

    /**
     *  启动摄像头 预览
     *
     */
    tssDeviceTools.cameraDisplayPicture = function (action, camId1){
        return new Promise(function (resolve, reject) {
            Camera.open().then(function (openStuts) {
                if (openStuts.stat == Constant.SUCCESS) {
                    // console.info(ret);
                    Camera.displayPicture(action, camId1).then(function (cardData) {
                        if (cardData.stat == Constant.SUCCESS) {
                            resolve(cardData);
                        } else {
                            reject(new Error("照片预览失败"));
                        }
                        console.info("cardData : " + cardData);
                    });
                    Camera.close();
                } else {
                    reject(new Error("打开读卡器失败"));
                    Camera.close();
                }
            });
        });
    };

    /**
     *  启动输入法
     *
     */
    tssDeviceTools.inputServiceOpen = function (type, track, width, high, x, y) {

        InputService.open(type, track, width, high, x, y);

    };

    window.TSSDeviceTools = tssDeviceTools;
})(window);