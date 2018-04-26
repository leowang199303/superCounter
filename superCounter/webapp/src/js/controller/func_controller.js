angular.module('myApp').controller('func_controller', function($scope, $interval, actcard_service, $rootScope, common_service, $state) {

	//页签控制
	var func = {};
	$scope.func = func;
	$scope.func = func;
	// 回到首页
	$scope.backhome = function() {
		$state.go('dashboard')
	}

	// 页签跳转 next
	var funcDeviceFlag = 0;
	$scope.funcDeviceFlag = funcDeviceFlag;
	// func.next = function (funcDeviceFlag) {
	//     funcDeviceFlag++;
	//     $scope.funcDeviceFlag =funcDeviceFlag;
	//     console.log($scope.funcDeviceFlag)
	//     // countOwnFlag++;//利用next方法，让 countOwnFlag ++,相同步骤的子页面，
	//     // 不使用next方法，利用ng-if条件来控制页面显示隐藏，就完成了pageflag与bar对应的控制
	// }

	func.CardReader = function(funcDeviceFlag) {
		funcDeviceFlag = 0;
		$scope.funcDeviceFlag = funcDeviceFlag;
	}
	func.IDcardReader = function(funcDeviceFlag) {
		funcDeviceFlag = 1;
		$scope.funcDeviceFlag = funcDeviceFlag;
	}
	func.Printers = function(funcDeviceFlag) {
		funcDeviceFlag = 2;
		$scope.funcDeviceFlag = funcDeviceFlag;
	}
	func.Fingers = function(funcDeviceFlag) {
		funcDeviceFlag = 3;
		$scope.funcDeviceFlag = funcDeviceFlag;
	}
	func.Epps = function(funcDeviceFlag) {
		funcDeviceFlag = 4;
		$scope.funcDeviceFlag = funcDeviceFlag;
	}
	func.Cameras = function(funcDeviceFlag) {
		funcDeviceFlag = 5;
		$scope.funcDeviceFlag = funcDeviceFlag;
	}

	//card
//	func.caredOpen = function() {
//		alert('打开设备');
//		TSSDeviceTools.initDevice().then(function(data) {
//			if(data) {
//				TSSDeviceTools.icReaderRead(2, 2).then(function(ret) {
//					console.info("ret : " + ret);
//				});
//			}
//		})
//	}
	func.cardReset = function() {
		alert('复位读卡器');
	}
	func.cardResetEat = function() {
		alert('复位吞卡数');
	}
	func.cardGetStatus = function() {
		alert('获取设备状态');
	}
	func.cardCancelOpera = function() {
		alert('取消操作');
	}
//	func.cardCloseDevice = function() {
//		alert('关闭设备');
//	}

	func.cardReadMsg = function() {
		alert('读取卡片数据');
	}
	func.cardApdu = function() {
		alert('执行apdus');
	}
	func.cardWriteCard = function() {
		alert('写卡');
	}
	func.cardExitCard = function() {
		alert('退卡');
		TSSDeviceTools.initDevice().then(function(data) {
			if(data) {
				TSSDeviceTools.icReaderReject(2).then(function(ret) {
					console.info("ret : " + ret);
				});
			}
		})
	}
	func.cardEatCard = function() {
		alert('吞卡');
	}

	//id
//	func.idOpen = function() {
//		alert('打开设备');
//	}
//	func.idReset = function() {
//		alert('复位读卡器');
//	}
//	func.idResetEat = function() {
//		alert('复位吞卡数');
//	}
	func.idGetStatus = function() {
		alert('获取设备状态');
	}
//	func.idCancelOpera = function() {
//		alert('取消操作');
//	}
//	func.idCloseDevice = function() {
//		alert('关闭设备');
//	}
	func.idReadMsg = function() {
		alert('读取卡片数据');
	}
//	func.idApdu = function() {
//		alert('执行apdus');
//	}
//	func.idWriteCard = function() {
//		alert('写卡');
//	}
//	func.idExitCard = function() {
//		alert('退卡');
//	}
//	func.idEatCard = function() {
//		alert('吞卡');
//	}

	//ptr
	func.ptrOpen = function() {
		alert('打开设备');
	}
	func.ptrReset = function() {
		alert('复位打印机');
	}
	func.ptrGetStatus = function() {
		alert('获取设备状态');
	}
	func.ptrCancel = function() {
		alert('取消操作');
	}
	func.ptrClose = function() {
		alert('关闭设备');
	}
	func.ptrSetWord = function() {
		alert('设置字体（非WOSA）');
	}
	func.ptrSetBold = function() {
		alert('设置粗体（非WOSA）');
	}
	func.ptrExit = function() {
		alert('退纸/折');
	}
	func.ptrCutPaper = function() {
		alert('切纸');
	}
	func.ptrPrintMsg = function() {
		alert('打印行数据');
	}
	func.ptrFormP = function() {
		alert('Form打印');
	}
	func.ptrPrintImg = function() {
		alert('打印位图（非WOSA）');
	}
	func.ptrPrintMa = function() {
		alert('打印条码（非WOSA）');
	}
	func.ptrReadC = function() {
		alert('读存折');
	}
	func.ptrWrite = function() {
		alert('写存折磁道');
	}

	// 外设函数 -- 指纹设备 --
	func.fingersOpenDevice = function(flg) {
		alert("打开指纹设备");
	}
	func.fingersReset = function() {
		alert("复位指纹仪");
	}
	func.fingersAcquisitionStatus = function() {
		alert("获取指纹仪设备状态");
	}
	func.fingersAancelOption = function() {
		alert("取消指纹设备操作");
	}
	func.fingersCloseDevice = function() {
		alert("关闭指纹设备");
	}
	func.getFormwork = function() {
		alert("获取指纹模板");
	}
	func.getFeature = function() {
		alert("获取指纹特征码");
	}
	func.fingerMatching = function() {
		alert("指纹匹配");
	}

	// 外设函数 -- pinpad --
	func.pinpadOpenDevice = function(flg) {
		alert("打开pinpad设备");
	}
	func.resetPass = function() {
		alert("复位密码键盘");
	}
	func.pinpadAcquisitionStatus = function() {
		alert("获取pinpad设备状态");
	}
	func.pinpadCancelOption = function() {
		alert("取消pinpad设备操作");
	}
	func.pinpadCloseDevice = function() {
		alert("关闭pinpad设备");
	}
	func.pinpadSecret = function() {
		alert("下载pinpad主密钥");
	}
	func.pinpadWorkSecret = function() {
		alert("下载pinpad工作秘钥");
	}
	func.clearInput = function() {
		alert("pinpad明文输入");
	}
	func.PassInput = function() {
		alert("pinpad启用密码输入");
	}
	func.getPinBlock = function() {
		alert("获取PinBlock");
	}
	func.desEncrypt = function() {
		alert("des加密");
	}
	func.desDecrypt = function() {
		alert("des解密");
	}
	func.computeMAC = function() {
		alert("计算MAC");
	}

	// 外设函数 -- camera --
	func.camerasOpenDevice = function(track, timeout) {
		alert("打开相机");
		TSSDeviceTools.initDevice().then(function(data) {
			if(data) {
				TSSDeviceTools.idReaderRead(3, 1).then(function(ret) {
					console.info("ret : " + ret.name);
				});
			}
		})
	}
	func.resetCamera = function() {
		alert("复位相机摄像头");
	}
	func.camerasAcquisitionStatus = function() {
		alert("获取相机状态");
	}
	func.camerasCancelOption = function() {
		alert("取消操作");
	}
	func.camerasCloseDevice = function() {
		alert("关闭相机");
	}
	func.takePhoto = function() {
		alert("拍照");
	}
	func.preView = function() {
		alert("预览");
	}	
})