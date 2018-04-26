angular.module('myApp').controller('saveMoney_controller', function($scope, $rootScope, actcard_service, $rootScope, common_service, $state, $interval) {
	$scope.saveMoneyPage = 0;
	var saveMoneyObj = {};

	$scope.saveMoneyObj = saveMoneyObj;
	var res = $rootScope.res.actcard_service;
	var subform = res.DealObj;
	var saveMoneyTime = 30;
	$scope.timeStart = saveMoneyTime;
	var bankCardIdTimer;
	var moneyStyle = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
	var bankStyle = /^(998801|998802|622525|622526|435744|435745|483536|528020|526855|622156|622155|356869|531659|622157|627066|627067|627068|627069)\d{10}$/;
	var saveMoneyFinishTimer;
	var saveMoneyTimer = window.setInterval(function() {
		saveMoneyTime--;
		console.log(saveMoneyTime)
		$scope.timeStart = saveMoneyTime;
		if(saveMoneyTime < 1) {
			$state.go('dashboard');
			window.clearInterval(saveMoneyTimer);
		}
	}, 1000)

	//read the bank card
	TSSDeviceTools.initDevice().then(function(data) {
		if(data) {
			TSSDeviceTools.icReaderRead(2, 1).then(function(ret) { //银行卡读取信息		
				$scope.bankCardNum = ret.cardNo;
				// find the msg of bank card
				var bankCardObj = {};
				bankCardObj.BDY = {};
				bankCardObj.BDY.cardNo = ret.cardNo;
				$scope.afterChangeStyle = commonUseTools.changeBankCardNumStyle(ret.cardNo)
				common_service.post(res.QueryCardInfo.url, bankCardObj).then(function(data) {
					console.log(data)

					if(data.bsadata.RSD.retCode != 000000) { //error happens
						alert(data.bsadata.RSD.retMsg);
						return;
					}
					$scope.bankName = data.bsadata.RSD.bankName;
					$scope.currencyOne = data.bsadata.RSD.currency;
					var jsString = data.bsadata.RSD;
					$scope.trcmCardInstCode = jsString.openOrg;
					$scope.count = jsString.balance;
					var msg = JSON.parse(sessionStorage.getItem('msg'))
					var mock = msg.mock;
					var bankCardIdTime = 3;
					if(mock) { //模拟数据

						bankCardIdTimer = window.setInterval(function() {
							bankCardIdTime--;
							if(bankCardIdTime == 0) {
								window.clearInterval(saveMoneyTimer);
								window.clearInterval(bankCardIdTimer);
								$scope.saveMoneyPage = 1;
							}
						}, 1000)

						$scope.bankCardNum = ret.cardNo;

					} else {

						$scope.bankCardNum = ret.cardNo;
						window.clearInterval(saveMoneyTimer);
						$scope.saveMoneyPage = 1;

					}
				})
			})
		}
	})

	saveMoneyObj.last = function() {
		$scope.saveMoneyPage = 1;
	}

	saveMoneyObj.next = function() {
		if($scope.saveMoneyObj.getBankNo == undefined) {
			$scope.getBankNo = true;
			$scope.getBankNoText = "请输入卡号";
			return
		} else {
			$scope.getBankNo = false;
		}

		//银行卡号不合法
		//		if(!commonUseTools.isValidityByCardNo($scope.saveMoneyObj.getBankNo)) {
		//			$scope.getBankNo = true;
		//			$scope.getBankNoText = "银行卡号不存在"
		//			return;
		//		} else {
		//			$scope.getBankNo = false;
		//		}
		//户名
		if($scope.saveMoneyObj.cardPerson == undefined) {
			$scope.cardPerson = true;
			$scope.cardPersonText = "请输入收款户名"
			return;
		} else {
			$scope.cardPerson = false;
		}

		//转账金额没填
		if($scope.saveMoneyObj.cardCount == undefined) {
			$scope.cardCount = true;
			$scope.cardCountText = "请输入转账金额"
			return;
		} else {
			$scope.cardCount = false;
		}

		//转账金额不为数字格式
		if(!moneyStyle.test($scope.saveMoneyObj.cardCount)) {
			$scope.cardCount = true;
			$scope.cardCountText = "请输入正确的转账金额"
			return;
		} else {
			$scope.cardCount = false;
		}

		//转账金额大余额
		if($scope.saveMoneyObj.cardCount * 1 > $scope.count * 1) {
			$scope.cardCount = true;
			$scope.cardCountText = "余额不足"
			return;
		} else {
			$scope.cardCount = false;
		}

		//get some msg
		$scope.msgObj = {};
		$scope.msgObj.cardPerson = $scope.saveMoneyObj.cardPerson;
		$scope.msgObj.cardCount = $scope.saveMoneyObj.cardCount;
		$scope.msgObj.getBankNo = $scope.saveMoneyObj.getBankNo;

		$scope.saveMoneyPage = 2;
	}

	saveMoneyObj.makeSure = function() {
		var getNum = {};
		var COH = {};
		var CTL = {};
		COH.TRANSINSTNO = "900001";
		COH.TRANSTELLER = "900001001";
		CTL.serialNoCounts = "1"; //目前写死，都是报文里的 以后要取值
		getNum.COH = COH;
		getNum.CTL = CTL;
		common_service.post(res.TWScreateSerialNo.url, getNum).then(function(data) {
			$scope.transSerialNo = data.bsadata.serialNoList;
			console.log($scope.transSerialNo)
		})
		$scope.saveMoneyPage = 3;
	}

	saveMoneyObj.rightPwd = function() {
		//check pwd isRight
		var passwordCheck = {};
		passwordCheck.BDY = {};
		passwordCheck.BDY.cardNo = $scope.bankCardNum;
		passwordCheck.BDY.passWord = $scope.saveMoneyObj.pwd;
		common_service.post(res.CardPassWordVerify.url, passwordCheck).then(function(data) {
			console.log(data)
			if(data.bsadata.RSD.retCode == 000000) { //right
				//获取服务流水号
				var ServiceSerialNoObj = {};
				ServiceSerialNoObj.COH = {};
				ServiceSerialNoObj.BDY = {};
				ServiceSerialNoObj.CTL = {};
				ServiceSerialNoObj.CTL.serialNoCounts = "1" //后台说胡写一个
				ServiceSerialNoObj.BDY.soleNo = "01";
				ServiceSerialNoObj.COH.TRANSINSTNO = "CN0019009";
				ServiceSerialNoObj.COH.TRANSTELLER = "900001001";
				common_service.post(res.TWScreateServiceSerialNo.url, ServiceSerialNoObj).then(function(result) {
					console.log(result)
					$scope.serialNoList = result.bsadata.serialNoList[0];

					//提交转账信息
					var obj = subform;
					var now = new Date().Format("yyyy-MM-dd hh:mm:ss");
					obj.COH.TRANSSTARTTIME = now;
					obj.COH.TRANSDATE = now;
					obj.COH.TRANSSERIALNO = $scope.transSerialNo.toString(); //交易流水号
					obj.COH.SERVICESERIALNO = $scope.serialNoList;
					obj.COH.TRANSTIME = now;
					obj.COH.TRANSCODE = 'TX600117';

					obj.BDY = {};
					obj.BDY.tranCardNo = $scope.bankCardNum;
					obj.BDY.tranBank = $scope.bankName;
					obj.BDY.money = $scope.saveMoneyObj.cardCount;
					obj.BDY.incomeCardNo = $scope.saveMoneyObj.getBankNo;
					obj.BDY.incomeName = $scope.saveMoneyObj.cardPerson;
					obj.BDY.incomeBank = $scope.getBankName;
					console.log(obj)
					common_service.post(res.TX600117.url, obj).then(function(resultOne) {
						console.log(resultOne);
						if(resultOne.retCode == 000000) { //交易提交成功
							$scope.msgCome = "转账成功";
							$scope.saveMoneyPage = 4;
							saveMoneyFinishTime = 30
							$scope.timeStart = saveMoneyFinishTime;
							var saveMoneyFinishTimer = window.setInterval(function() {
								saveMoneyFinishTime--;
								console.log(saveMoneyFinishTime)
								$scope.timeStart = saveMoneyFinishTime;
								if(saveMoneyFinishTime < 1) {
									$state.go('dashboard');
									window.clearInterval(saveMoneyFinishTimer);
								}
							}, 1000)
						} else {
							$scope.saveMoneyPage = 4;
							$scope.msgCome = resultOne.retMsg;
							saveMoneyFinishTime = 30
							$scope.timeStart = saveMoneyFinishTime;
							var saveMoneyFinishTimer = window.setInterval(function() {
								saveMoneyFinishTime--;
								console.log(saveMoneyFinishTime)
								$scope.timeStart = saveMoneyFinishTime;
								if(saveMoneyFinishTime < 1) {
									$state.go('dashboard');
									window.clearInterval(saveMoneyFinishTimer);
								}
							}, 1000)
							return;
						}
					})

				})
			} else { //err
				$scope.pwd = true;
				$scope.pwdText = "密码错误";
				return;
			}
		})

	}

	saveMoneyObj.clean = function() {

		window.clearInterval(saveMoneyFinishTimer);
		window.clearInterval(bankCardIdTimer);
		window.clearInterval(saveMoneyTimer);
		$state.go('dashboard');
	}

	saveMoneyObj.findBank = function() {
		var bankCardObj = {};
		bankCardObj.BDY = {};
		bankCardObj.BDY.cardNo = $scope.saveMoneyObj.getBankNo
		console.log(bankCardObj)
		common_service.post(res.QueryCardInfo.url, bankCardObj).then(function(data) {
			console.log(data)
			if(data.bsadata.RSD.retCode == "000000") {
				$scope.getBankLogol = data.bsadata.RSD.logoUrl;
				$(".logoImg").css("display", "inline-block");
				$scope.getBankName = data.bsadata.RSD.bankName;
			} else {
				$(".logoImg").css("display", "none");
				$scope.getBankName = "";
			}
		})
	}

	Date.prototype.Format = function(fmt) { //author: meizz
		var o = {
			"M+": this.getMonth() + 1, //月份
			"d+": this.getDate(), //日
			"h+": this.getHours(), //小时
			"m+": this.getMinutes(), //分
			"s+": this.getSeconds(), //秒
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度
			"S": this.getMilliseconds() //毫秒
		};
		if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for(var k in o)
			if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}
})