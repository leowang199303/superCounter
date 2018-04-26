angular.module('myApp').controller('countOwn_controller', function($scope, $rootScope, $interval, actcard_service, $rootScope, common_service, $state) {
	var countOwn = {};
	$scope.countOwn = countOwn;
	$scope.isPwd = false;
	$scope.isDisabled = true;
	$scope.isSend = false;
	$scope.codeIsRight = false;
	$scope.isPhoneNum = false;
	$scope.isPwdResetAgain = false;
	$scope.isPwdReset = false;
	$scope.isRightPwdNewAgain = false;
	$scope.getMsgBtn = "获取";
	var codeTimer;
	$scope.errorMsg = "请输入六位数字密码";
	$scope.oldPwdTips = "请输入六位数字密码"
	var res = $rootScope.res.actcard_service;
	var urla = 'http://' + ipAdre + res.TWScreateSerialNo.url;
	var telObj = {};
	var subFrom = res.DealObj;
	var bankCardIdTimer;
	var countIdReadTimer;
	//	$scope.subFrom = subFrom;
	var pwdStyle = /^[0-9]{6}$/;
	var phoneNum = /^1[34578]\d{9}$/;
	$("#mask").css("height", "1024px");
	$("#mask").css("width", $(document).width());
	$("#mask").hide();
	$(".count-own-pwd").hide();
	//  $scope.timeStart = 30;
	// 回到首页
	$scope.backhome = function() {
		$state.go('dashboard')
	}

	//card password check
	countOwn.checkPassword = function() {
			$scope.errorMsg = "请输入六位数字密码"
			var cardPwd = countOwn.cardPwd;
			if(!pwdStyle.test(cardPwd)) {
				$scope.isPwd = true;
				return;
			} else {
				$scope.isPwd = false;
			}
		}
		// 倒计时计时器
	var datetime = 30;
	$scope.timeStart = datetime;
	var idCardTime = 30;
	$scope.timeStart = idCardTime;
	var idCardTimer;
	var timerCount = window.setInterval(function() {
		datetime--;
		console.log(datetime)
		$scope.timeStart = datetime;
		if(datetime < 1) {
			datetime = 0;
			$state.go('dashboard');
			window.clearInterval(timerCount);
		}
	}, 1000)

	//开始插银行卡
	var bankCardNum;
	TSSDeviceTools.initDevice().then(function(data) {
		if(data) {
			TSSDeviceTools.icReaderRead(2, 1).then(function(ret) { //银行卡读取信息					
				// find the msg of bank card
				var bankCardObj = {};
				bankCardObj.BDY = {};
				bankCardObj.BDY.cardNo = ret.cardNo;
				console.log(bankCardObj)
				common_service.post(res.QueryCardInfo.url, bankCardObj).then(function(data) {
					console.log(data)
					if(data.bsadata.RSD.retCode != 000000){
						alert(data.bsadata.RSD.retMsg);
						return;
					}
					var jsString = data.bsadata.RSD;
					$scope.trcmCardInstCode = jsString.openOrg;
					$scope.count = jsString.balance;
					var msg = JSON.parse(sessionStorage.getItem('msg'))
					var mock = msg.mock;
					var bankCardIdTime = 5;
					if(mock) { //模拟数据
						bankCardIdTimer = window.setInterval(function() {
							bankCardIdTime--;
							if(bankCardIdTime == 0) {
								window.clearInterval(timerCount);
								window.clearInterval(bankCardIdTimer);
								$scope.countOwnFlag = 1;
								$("#mask").show();
								$(".count-own-pwd").show();
							}
						}, 1000)
						$scope.bankCardNum = ret.cardNo;
					} else {
						$scope.bankCardNum = ret.cardNo;
						window.clearInterval(timerCount);
						$scope.countOwnFlag = 1;
						$("#mask").show();
						$(".count-own-pwd").show();
					}
				})
			})
		}
	})

	//查询账号信息

	// 页签跳转 next
	var countOwnFlag = 0;
	$scope.countOwnFlag = countOwnFlag;

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
		//查询交易流水
	var moneyDetailObj = {};
	moneyDetailObj.NamingSqlID = '_1c87077a9047ea68_sql.TransJournalDao.queryBtfTransjnl';
	moneyDetailObj.StartNo = '0' //开始条数
	moneyDetailObj.Length = '9999' //结果条数
	moneyDetailObj.ParamObject = {};
	moneyDetailObj.ParamObject.TRANS_SERIAL_NO = ''; //交易流水
	moneyDetailObj.ParamObject.SERVICE_SERIAL_NO = ''; //服务流水
	moneyDetailObj.ParamObject.CHANNEL_CODE = ''; //渠道号
	moneyDetailObj.ParamObject.TRANS_DATE = ''; //交易日期
	moneyDetailObj.ParamObject.TELLER_CODE = ''; //柜员
	moneyDetailObj.ParamObject.ORG_CODE = ''; //柜员号
	moneyDetailObj.ParamObject.WORKSTATION_CODE = '';
	moneyDetailObj.ParamObject.TRANS_CODE = ''; //交易代码
	moneyDetailObj.ParamObject.DEBIT_ACCTNO = ''; //贷方账号
	moneyDetailObj.ParamObject.CREDIT_ACCTNO = ''; //借方账号
	moneyDetailObj.ParamObject.CUST_NO = ''; //客户账号
	moneyDetailObj.ParamObject.CUR_CODE = ''; //币种
	moneyDetailObj.ParamObject.VOUCH_NO = ''; //凭证号码
	moneyDetailObj.ParamObject.CASH_FLAG = ''; //现金标志
	moneyDetailObj.ParamObject.TRANS_AMT = ''; //交易金额
	moneyDetailObj.ParamObject.START_TIME = '20171001'; //开始时间
	moneyDetailObj.ParamObject.END_TIME = '20171201'; //结束时间
	moneyDetailObj.ParamObject.TRANS_DURATION = '';
	moneyDetailObj.ParamObject.TRANS_STATE = ''; //交易状态
	moneyDetailObj.ParamObject.TRANSINFO_STATE = '';
	moneyDetailObj.ParamObject.AUTH_TELLER = '' //授权柜员;
	moneyDetailObj.ParamObject.CHECK_TELLER = ''

	function endDay(a, b) {
		var nowFirstDay = a.split(' ');
		var nowFirstDayArr = nowFirstDay[0].split('-');
		console.log(nowFirstDayArr) //年月日数组
		if(b == 'month') {
			nowFirstDayArr[2] = '01'; //当月的第一天			
		} else if(b == 'season') { //近三个月流水
			var monthNow = nowFirstDayArr[1];
			var seaonMonth = Number(monthNow);
			if(seaonMonth <= 3) { //如果当前月份小于等于3月份，算上去年
				nowFirstDayArr[0] = nowFirstDayArr - 1;
				if(seaonMonth == 1) {
					nowFirstDayArr[1] = '10';
				} else if(seaonMonth == 2) {
					nowFirstDayArr[1] = '11';
				} else if(seaonMonth == 3) {
					nowFirstDayArr[1] = '12';
				}
			} else {
				var monthThreeBrfore = seaonMonth - 3;
				var monthThreeBrforeStyle = '0' + monthThreeBrfore;
				nowFirstDayArr[1] = monthThreeBrforeStyle;
			}
		}
		nowFirstDay[1] = '00:00:00';
		nowFirstDay[0] = nowFirstDayArr.join('-'); // 01 day
		var afterYear = nowFirstDay.join(' ');
		return afterYear;
	}

	function timeStringChange(str) {
		var year = str.substring(0, 4);
		var month = str.substring(4, 6);
		var day = str.substring(6, 8);
		var hour = str.substring(8, 10);
		var minute = str.substring(10, 12);
		var sends = str.substring(12, 14);
		var timeStyle = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + sends;
		return timeStyle;
	}
	countOwn.moneyDetail = function(event) {
		var detailBet = $('input:radio[name="bill"]:checked').attr('value');
		var now = new Date().Format("yyyy-MM-dd hh:mm:ss");
		//结束时间赋值
		//moneyDetailObj.ParamObject.END_TIME = now; 
		var startTime;
		if(detailBet == "month") { //月流水       
			var b = 'month'
			startTime = endDay(now, b);
		} else if(detailBet == 'season') { //季度流水
			var b = 'season';
			startTime = endDay(now, b);
		}
		//开始时间复制
		//moneyDetailObj.ParamObject.START_TIME = startTime;
		common_service.post(res.NamingSqlCommonService.url, moneyDetailObj).then(function(data) {
			console.log(data);
			var streamChange = data.bsadata;
			for(var i = 0; i < streamChange.length; i++) {
				//结束时间格式转换
				var timeStringEnd = streamChange[i].END_TIME;
				streamChange[i].END_TIME = timeStringChange(timeStringEnd);

				//开始时间格式转换
				var timeStringStart = streamChange[i].START_TIME;
				streamChange[i].START_TIME = timeStringChange(timeStringStart);

				//交易时间格式转换
				var timeStringTrans = streamChange[i].TRANS_DATE;
				streamChange[i].TRANS_DATE = timeStringChange(timeStringTrans);
			}
			if(detailBet == 3) { //近三笔流水
				var threeData = [];
				for(var i = 0; i < 3; i++) {
					threeData.push(streamChange[i]);
				}
				streamChange = threeData;
			}
			if(detailBet == 10) { //近三笔流水
				var threeData = [];
				for(var i = 0; i < 10; i++) {
					threeData.push(streamChange[i]);
				}
				streamChange = threeData;
			}
			$scope.streams = streamChange;
		})
	}
	countOwn.checkPwdIsright = function() {
		var cardPwd = $scope.countOwn.cardPwd;

		if(cardPwd == undefined || cardPwd == '' || $scope.isPwd == true) {
			$scope.isPwd = true;
			return;
		} else {
			var passwordCheck = {};
			passwordCheck.BDY = {};
			passwordCheck.BDY.cardNo = $scope.bankCardNum;;
			passwordCheck.BDY.passWord = $scope.countOwn.cardPwd;
			common_service.post(res.CardPassWordVerify.url, passwordCheck).then(function(retp) {
				console.log(retp)
				if(retp.bsadata.RSD.retCode == 000000) {
					//显示交易流水板块 ，默认为一个月
					common_service.post(res.NamingSqlCommonService.url, moneyDetailObj).then(function(data) {
						var streamChange = data.bsadata;
						for(var i = 0; i < streamChange.length; i++) {
							//结束时间格式转换
							var timeStringEnd = streamChange[i].END_TIME;
							streamChange[i].END_TIME = timeStringChange(timeStringEnd);

							//开始时间格式转换
							var timeStringStart = streamChange[i].START_TIME;
							streamChange[i].START_TIME = timeStringChange(timeStringStart);

							//交易时间格式转换
							var timeStringTrans = streamChange[i].TRANS_DATE;
							streamChange[i].TRANS_DATE = timeStringChange(timeStringTrans);
						}
						$scope.streams = streamChange;
					})
					$scope.isPwd = false;
					$scope.countOwnFlag = 2;
					$("#mask").hide();
					$(".count-own-pwd").hide();
				} else {
					$scope.isPwd = true;
					$scope.errorMsg = "密码错误";
					return;
				}
			})
		}

	}
	countOwn.next = function(countOwnFlag) {
			console.log(countOwnFlag)
			countOwnFlag++;
			$scope.countOwnFlag = countOwnFlag;

		}
		// card-option
	var cardOwn;
	$scope.cardOwn = cardOwn;

	countOwn.backCardID = function(countOwnFlag) {
		$scope.countOwnFlag = 5;

	}

	countOwn.clean = function() {
		window.clearInterval(timerCount);
		window.clearInterval(timerCount);
		window.clearInterval(idCardTimer);
		window.clearInterval(codeTimer);
		window.clearInterval(countIdReadTimer);
		$state.go('dashboard');
	}

	// 忘记密码
	$scope.forgetPass = function(a) {
		$scope.countOwnFlag = 4;
		$("#mask").hide();
		$(".count-own-pwd").hide();
		idCardTime = 30;
		$scope.timeStart = idCardTime;
		idCardTimer = window.setInterval(function() {
			idCardTime--;
			console.log(idCardTime)
			$scope.timeStart = idCardTime;
			if(idCardTime == 0) {
				$state.go('dashboard');
				window.clearInterval(idCardTimer);
			}
		}, 1000)
		TSSDeviceTools.initDevice().then(function(data) {
			if(data) {
				TSSDeviceTools.idReaderRead(3, 1).then(function(ret) { //身份证外设接口
					console.log(ret.name)

					//身份核查方法,外设激活后调用
					var subFrom = {};
					subFrom.vcherType = "101"; //超哥定义的 不知道为什么
					subFrom.vcherNo = ret.idNumber;
					subFrom.name = ret.name; //页面输入的名称
					subFrom.phFlag = "1";
					subFrom.tellerNo = "900001005";
					subFrom.branchId = "900001"; //这三个写死

					common_service.post(res.queryBlackList.url, subFrom).then(function(data) {
						console.log(data)
						if(data.retCode == "TDCMCT08006") { //黑名单验证
							alert(data.retMsg);
							return;
						} else {
							//查询服务流水号
							var ServiceSerialNoObj = {};
							ServiceSerialNoObj.COH = {};
							ServiceSerialNoObj.BDY = {};
							ServiceSerialNoObj.CTL = {};
							ServiceSerialNoObj.CTL.serialNoCounts = "1" //后台说胡写一个
							ServiceSerialNoObj.BDY.soleNo = "01";
							ServiceSerialNoObj.BDY.idNo = ret.idNumber;
							ServiceSerialNoObj.BDY.idType = "02";
							ServiceSerialNoObj.COH.TRANSINSTNO = "CN0019009";
							ServiceSerialNoObj.COH.TRANSTELLER = "900001001";

							common_service.post(res.TWScreateServiceSerialNo.url, ServiceSerialNoObj).then(function(data) {
								console.log(data)
								if(data.retCode == "PD0000") {
									serviceNoa = data.bsadata.serialNoList[0];
									var msg = JSON.parse(sessionStorage.getItem('msg'))
									var mock = msg.mock;
									var countIdRead = 5;
									if(mock) {
										countIdReadTimer = window.setInterval(function() {
											countIdRead--;
											console.log(countIdRead)
											if(countIdRead == 0) {
												console.log(a)
												if(a == "1") {
													$scope.countOwnFlag = 5;
												} else if(a == "2") {
													$scope.countOwnFlag = 3;
												}

												window.clearInterval(countIdReadTimer);
												window.clearInterval(idCardTimer)
											}
										}, 1000)
									} else {
										window.clearInterval(idCardTimer)
										if(a == 1) {
											$scope.countOwnFlag = 5;
										} else if(a == "2") {
											$scope.countOwnFlag = 3;
										}
									}
								} else {
									alert("获取流水服务号失败")
									return;
								}
							})
							console.log(data.retMsg);
						}

					})

				});
			}
		})
	}

	countOwn.inputResetOne = function() {
		//设置新密码
		var ResetOneValue = $scope.countOwn.resetOne;
		var ResetTwoValue = $scope.countOwn.resetTwo;
		var cardPwd = $scope.countOwn.cardPwd
		if(ResetOneValue == cardPwd) {
			$scope.isPwdResetAgain = true;
			$scope.countMsgOne = '不能与原始密码相同';
			return;
		} else {
			$scope.isPwdResetAgain = false;
		}

		if(!pwdStyle.test(ResetOneValue)) {
			$scope.isPwdResetAgain = true;
			$scope.countMsgOne = '请输入六位数字';
			return;
		} else {
			$scope.isPwdResetAgain = false;
		}

		if(ResetTwoValue != undefined) {
			if(ResetOneValue == ResetTwoValue) {
				$scope.isPwdResetAgain = false;
			} else {
				$scope.isPwdResetAgain = true;
				return;
			}
		}

		if(!$scope.isPwdReset) {
			if(!$scope.isPwdResetAgain) {
				var getNum = {};
				var COH = {};
				var CTL = {};
				COH.TRANSINSTNO = "900001";
				COH.TRANSTELLER = "900001001";
				CTL.serialNoCounts = "1"; //目前写死，都是报文里的 以后要取值
				getNum.COH = COH;
				getNum.CTL = CTL;
				common_service.post(res.TWScreateSerialNo.url, getNum).then(function(data) {
					console.log(data)
					$scope.transSerialNo = data.bsadata.serialNoList;
					console.log($scope.transSerialNo)
				})
			}
		}
	}

	countOwn.inputResetTwo = function() {
		//获取流水号,交易流请求的时候都要包COH  CTL  BDY
		var ResetTwoValue = $scope.countOwn.resetTwo;
		var ResetOneValue = $scope.countOwn.resetOne;
		if(ResetTwoValue != ResetOneValue) {
			$scope.isPwdResetAgain = true;
			$scope.countMsgOne = "两次密码输入不一致"
			return;
		} else {
			$scope.isPwdResetAgain = false;
		}
		
		if(!pwdStyle.test(ResetOneValue)) {
			$scope.isPwdResetAgain = true;
			$scope.countMsgOne = '请输入六位数字';
			return;
		} else {
			$scope.isPwdResetAgain = false;
		}

		if(!$scope.isPwdResetAgain) {

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

		}
	}

	countOwn.oldPwdFun = function() {
		//检测原始密码
		var oldPwd = $scope.countOwn.oldPwdNum;
		if(!pwdStyle.test(oldPwd)) {
			$scope.isPwdResetAgain = true;
			$scope.countMsgOne = "密码错误"
			return;
		} else {
			$scope.isPwdResetAgain = false;
		}
		var getNum = {};
		var COH = {};
		var CTL = {};
		COH.TRANSINSTNO = "900001";
		COH.TRANSTELLER = "900001001";
		CTL.serialNoCounts = "1";
		getNum.COH = COH;
		getNum.CTL = CTL;
		common_service.post(res.TWScreateSerialNo.url, getNum).then(function(data) {
			$scope.transSerialNum = data.bsadata.serialNoList;
			console.log($scope.transSerialNum)
		})
		var passwordCheck = {};
		passwordCheck.BDY = {};
		passwordCheck.BDY.cardNo = $scope.bankCardNum;;
		passwordCheck.BDY.passWord = $scope.countOwn.oldPwdNum;
		common_service.post(res.CardPassWordVerify.url, passwordCheck).then(function(retp) {
			console.log(retp)
			if(retp.bsadata.RSD.retCode == 000000) {
				$scope.oldPwdIsRight = false;
			} else {
				$scope.oldPwdIsRight = true;
				$scope.oldPwdTips = "密码错误";
				return;
			}
		})
	}

	countOwn.resetPwdA = function() {

		if($scope.countOwn.oldPwdNum == undefined) {
			return;
		}

		if($scope.countOwn.resetOne == undefined) {
			return;
		}

		if($scope.countOwn.resetTwo == undefined) {
			return;
		}

		if($scope.isPwdResetAgain) {
			return;
		}

		subFrom.BDY = {};
		var now = new Date().Format("yyyy-MM-dd hh:mm:ss");
		subFrom.BDY.cardNo = $scope.bankCardNum;
		subFrom.BDY.passWord = $scope.countOwn.cardPwd;
		subFrom.BDY.oldCardPass = $scope.countOwn.cardPwd;
		subFrom.BDY.newCardPass = $scope.countOwn.resetOne;

		subFrom.COH.TRANSSTARTTIME = now;
		subFrom.COH.TRANSDATE = now;
		subFrom.COH.TRANSSERIALNO = $scope.transSerialNo.toString(); //交易流水号
		subFrom.COH.SERVICESERIALNO = serviceNoa;
		console.log(subFrom.COH.SERVICESERIALNO)
		subFrom.COH.TRANSTIME = now;
		subFrom.COH.TRANSCODE = 'TX600102';
		console.log(subFrom);
		common_service.post(res.TX600102.url, subFrom).then(function(data) {
			console.log(data)
			if(data.retCode == 000000) {
				alert('修改成功');
				$state.go('dashboard');
			}
		})

	}
	countOwn.phoneCheck = function() {
		$scope.countOwnFlag = 6;
	}
	countOwn.memberCheck = function() {
			$scope.countOwnFlag = 7;
		}
		//check phone numbern isRight when reset password
	countOwn.resetPhone = function() {
		var forgetTel = $scope.countOwn.forgetTel;
		if(!phoneNum.test(forgetTel)) {
			$scope.codeIsRight = true;
			$scope.countPhoneNumber = "请输入正确手机号码"
			$scope.isDisabled = true;
			$scope.isSend = false;
			return;
		} else {
			$scope.isDisabled = false;
			$scope.codeIsRight = false;
			$scope.isSend = true;
		}
	}

	//get the code fome msg
	countOwn.getMsgCode = function() {
		var codetime = 30;
		$scope.getMsgBtn = codetime + 's';
		$('.checkCodeBtn').css('margin-right', '50px');
		$scope.isDisabled = true;
		codeTimer = window.setInterval(function() {
			codetime--;
			$scope.getMsgBtn = codetime + 's';
			if(codetime == 1) {
				$scope.getMsgBtn = '重新获取';
				$scope.isDisabled = false;
				window.clearInterval(codeTimer);
				$('.checkCodeBtn').css('margin-right', '0');
			}
		}, 1000)

		telObj.telNumber = $scope.countOwn.forgetTel
			//		common_service.post(res.createVerifyCode.url, telObj).then(function(data) {
			//			console.log(data);
			//			$scope.verifyCode = data.bsadata.verifyCode;
			//			alert("验证码是：" + $scope.verifyCode);
			//		})
	}

	//check code isRight when send code to the phone number
	countOwn.resetCode = function() {
		var resetCode = $scope.countOwn.forgetCode;
		if(resetCode != undefined) {
			$scope.codeIsRight = false;
		}
		//		if(resetCode == $scope.verifyCode) {
		//			$scope.codeIsRight = false;
		//		} else {
		//			$scope.codeIsRight = true;
		//			return;
		//		}
	}

	countOwn.finishCheck = function() {
		var forgetTel = $scope.countOwn.forgetTel
		var forgetCode = $scope.countOwn.forgetCode;
		console.log(forgetCode)
		if($scope.codeIsRight == true) {
			return;
		}

		if(forgetTel == undefined || forgetTel == '') {
			$scope.codeIsRight = true;
			$scope.countPhoneNumber = "请输入正确的手机号码"
			return;
		} else {
			$scope.codeIsRight = false;
		}

		if(forgetCode == undefined || forgetCode == '') {
			$scope.codeIsRight = true;
			$scope.countPhoneNumber = "验证码不正确"
			return;
		} else {
			console.log('aa')
			$scope.codeIsRight = false;
		}

		$scope.countOwnFlag = 8;

	}

	countOwn.setNewPwd = function() {
		//第一次输入密码
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

		var setNewPwdValue = $scope.countOwn.setNewPwdValue;
		var setNewPwdAgainValue = $scope.countOwn.setNewPwdAgainValue;
		if(!pwdStyle.test(setNewPwdValue)) {
			$scope.isRightPwdNewAgain = true;
			$scope.countMsgTwo = "请输入六位数字密码"
			return;
		} else {
			$scope.isRightPwdNewAgain = false;
		}
		if(setNewPwdAgainValue != undefined) {
			if(setNewPwdValue != setNewPwdAgainValue) {
				$scope.isRightPwdNewAgain = true;
				$scope.countMsgTwo = "两次输入密码不一致"
				return;
			} else {
				$scope.isRightPwdNewAgain = false;
			}
		}
	}

	countOwn.setNewPwdAgain = function() {
		//sencond pwd
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

		var setNewPwdAgainValue = $scope.countOwn.setNewPwdAgainValue;
		var setNewPwdValue = $scope.countOwn.setNewPwdValue;
		if(setNewPwdAgainValue != setNewPwdValue) {
			$scope.isRightPwdNewAgain = true;
			$scope.countMsgTwo = "两次输入密码不一致"
			return;
		} else {
			$scope.isRightPwdNewAgain = false;
		}
	}

	countOwn.surePwd = function() {
		if($scope.isRightPwdNewAgain) {
			return;
		}

		if($scope.countOwn.setNewPwdAgainValue == undefined) {
			$scope.isRightPwdNewAgain = true;
			$scope.countMsgTwo = "两次输入密码不一致"
			return;
		}

		if($scope.countOwn.setNewPwd == undefined) {
			$scope.isRightPwdNew = true;
			$scope.countMsgTwo = "请输入六位数字密码"
			return;
		}
		subFrom.BDY = {};
		var now = new Date().Format("yyyy-MM-dd hh:mm:ss");
		subFrom.BDY.cardNo = $scope.bankCardNum;
		subFrom.BDY.newPassWord = $scope.countOwn.setNewPwdValue

		subFrom.COH.TRANSSTARTTIME = now;
		subFrom.COH.TRANSDATE = now;
		subFrom.COH.TRANSSERIALNO = $scope.transSerialNo.toString(); //交易流水号
		subFrom.COH.SERVICESERIALNO = serviceNoa;
		subFrom.COH.TRANSTIME = now;
		subFrom.COH.TRANSCODE = 'TX600105';
		console.log(subFrom)
		common_service.post(res.TX600105.url, subFrom).then(function(data) {
			console.log(data)
		})
		alert('修改成功')
		$state.go('dashboard');
	}

	countOwn.memeCheck = function() {
		$scope.countOwnFlag = 8;
	}

	countOwn.changePwd = function() {
		$scope.countOwnFlag = 3;
		//查询流水号
		var getNum = {};
		var COH = {};
		var CTL = {};
		COH.TRANSINSTNO = "900001";
		COH.TRANSTELLER = "900001001";
		CTL.serialNoCounts = "1";
		getNum.COH = COH;
		getNum.CTL = CTL;
		common_service.post(res.TWScreateSerialNo.url, getNum).then(function(data) {
			$scope.transSerialNum = data.bsadata.serialNoList;
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