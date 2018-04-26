angular.module('myApp').controller('phonebank_controller', function($scope, $interval, actcard_service, $rootScope, common_service, $state) {
	//	var wang = 'file://C:/Users/Administrator/Desktop/303266202221637625.jpg';
	//  $('#img').attr('src',wang)
	var phoneBankPage = 0;
	$scope.phoneBankPage = phoneBankPage;
	var userSelectProcduct1;
	// Numer To Contronl Func
	var phoneBankFunc = 4;
	$scope.phoneBankFunc = phoneBankFunc;

	// Switch Of Func
	var onOf = 0;
	$scope.onOf = onOf;

	var phoneBankObj = {};
	$scope.phoneBankObj = phoneBankObj;
	$scope.isCardPwd = "请输入六位数字密码";
	var res = $rootScope.res.actcard_service;

	// Bank Card Timer
	var phoneBankCard = 30;
	$scope.timeStart = phoneBankCard;

	var codeTime = 30;
	var codeTimer;

	var endTips;
	$scope.endTips = endTips;

	var isRight = false;
	$scope.isRight = isRight;

	var phoneBankPwd = false;
	$scope.phoneBankPwd = phoneBankPwd;

	var newPwd = false;
	$scope.newPwd = newPwd;

	var newPwdAgain = false;
	$scope.newPwdAgain = newPwdAgain;

	var phoneBankPwdAgain = false;
	$scope.phoneBankPwdAgain = phoneBankPwdAgain;

	var isRightTelNum = false;
	$scope.isRightTelNum = isRightTelNum;

	var isDisabled = false;
	$scope.isDisabled = isDisabled;

	var isDisabledz = true;
	$scope.isDisabledz = isDisabledz;

	var title1 = '获取';
	$scope.title1 = title1;

	var tss = {};
	$scope.tss = tss;

	var isSigned = false;
	var subFromPhone = res.DealObj;

	// ID Card Timer
	var phoneBankIDCard;
	// Sign Cavas Timer
	var signCanvas;
	var signContainer;
	var pwdStyle = /^[0-9]{6}$/;
	var telNum = /^1[34578]\d{9}$/;
	var subFromObj = res.DealObj;
	var phoneIdCardTimer;
	var phoneIdCardTimert;
	var subFrom = {};
	subFrom.vcherType = "101";
	subFrom.phFlag = "1";
	subFrom.tellerNo = "900001005";
	subFrom.branchId = "900001";
	var bankCardIdTimer;
	var subFromObj = res.DealObj;
	var swichOff;

	function timer() {
		phoneBankCard--;
		console.log(phoneBankCard);
		$scope.timeStart = phoneBankCard;
		if(phoneBankCard == 0) {
			window.clearInterval(phoneBankCardTimer);
			window.clearInterval(phoneBankIDCard);
			$state.go('dashboard');
		}
	}

	var phoneBankCardTimer = window.setInterval(timer, 1000)

	//back to dashboard.html
	// 1 cleanInterval bankCard
	phoneBankObj.clean = function() {
		window.clearInterval(phoneBankCardTimer);
		window.clearInterval(phoneBankIDCard);
		window.clearInterval(signCanvas);
		window.clearInterval(bankCardIdTimer)
		window.clearInterval(phoneIdCardTimer);
		window.clearInterval(phoneIdCardTimert);
		window.clearInterval(swichOff)
		window.clearInterval(phoneBankEndTimer);
		$state.go('dashboard');
	}

	phoneBankObj.backToFunc = function() {
		$scope.phoneBankPage = 2;
	}
	phoneBankObj.backToAgree = function() {
			$scope.phoneBankFunc = 4;
		}
		// read bankCard Message
	TSSDeviceTools.initDevice().then(function(data) {
		if(data) {
			TSSDeviceTools.icReaderRead(2, 1).then(function(ret) { //银行卡读取信息
				//check the card isSigned
				$scope.bankCardNum = ret.cardNo;
				var cardIsSigned = {};
				cardIsSigned.BDY = {};
				cardIsSigned.BDY.cardNo = $scope.bankCardNum;
				console.log(cardIsSigned)
				common_service.post(res.JudegSignPhoneBank.url, cardIsSigned).then(function(data) {
					console.log(data)
					if(data.bsadata.RSD.retCode == 000000) {
						isSigned = true; //签约
					} else {
						isSigned = false //未签约
					}

					console.log(ret)
					var msg = JSON.parse(sessionStorage.getItem('msg'))
					var mock = msg.mock;
					var bankCardIdTime = 3;

					if(mock) {

						bankCardIdTimer = window.setInterval(function() {
							bankCardIdTime--;
							if(bankCardIdTime == 0) {
								window.clearInterval(bankCardIdTimer);
								window.clearInterval(phoneBankCardTimer);

								$scope.phoneBankPage = 1;
							}
						}, 1000)
					} else {
						window.clearInterval(phoneBankCardTimer);

						$scope.phoneBankPage = 1;
					}
				})
			})
		}
	})

	var productFirstNed
	phoneBankObj.finishChose = function() {
		productFirstNed = JSON.parse(sessionStorage.getItem("productFirstNed"));
		for(var i = 0; i < productFirstNed.length; i++) {
			for(var o = 0; o < productFirstNed[i].option.length; o++) {
				if("pay" in productFirstNed[i].option[o]) {
					if(productFirstNed[i].option[o].isOpen) {
						for(var p = 0; p < productFirstNed[i].option[o].pay.length; p++) {
							productFirstNed[i].option[o].pay[p].count = $(".one_" + o + "_" + p).val()
						}
					}

				}
			}
		}
		$('.switchOne').css("display", "none");
		$scope.phoneBankPage = 4;
		$scope.phoneBankFunc = 5;
	}

	phoneBankObj.next = function(phoneBankPage) {
		window.clearInterval(phoneBankCardTimer);
		phoneBankPage++;
		$scope.phoneBankPage = phoneBankPage;
	}

	phoneBankObj.checkCardPwd = function() {
			var pwd = $scope.tss.BankCardPwd;
			if(!pwdStyle.test(pwd)) {
				$scope.isCardPwd = "请输入六位数字密码";
				$scope.isRight = true;
				return;
			} else {
				$scope.isRight = false;
			}
		}
		// finish in pwd
	phoneBankObj.pwdMakeSure = function() {
		var pwd = $scope.tss.BankCardPwd;
		if($scope.isRight) {
			return;
		}
		if(pwd == undefined || pwd == '') {
			$scope.isRight = true;
			$scope.isCardPwd = "密码错误";
			return;
		} else {
			$scope.isRight = false;
		}
		var passwordCheck = {};
		passwordCheck.BDY = {};
		passwordCheck.BDY.cardNo = $scope.bankCardNum;;
		passwordCheck.BDY.passWord = $scope.tss.BankCardPwd;
		common_service.post(res.CardPassWordVerify.url, passwordCheck).then(function(retp) {
			console.log(retp)
			if(retp.bsadata.RSD.retCode == 000000) {
				$scope.phoneBankPage = 2;
				$scope.isRight = false;
			} else {
				$scope.isRight = true;
				$scope.isCardPwd = "密码错误";
				return;
			}
		})
	}

	// finish in function chosen
	// 1 手机签约
	// 2 密码重置
	// 3 信息修改
	// 4 账户维护
	phoneBankObj.funChoseq = function(i) {
		$scope.phoneBankPage = 3;
		$scope.onOf = 1;
		phoneBankCard--;
		console.log(phoneBankCard);
		$scope.timeStart = phoneBankCard;
		if(phoneBankCard == 0) {
			window.clearInterval(phoneBankCardTimer);
			window.clearInterval(phoneBankIDCard);
			$state.go('dashboard');
		}

	}

	phoneBankObj.signArealday = function() {
		$scope.phoneBankPage = 2;
	}

	phoneBankObj.funChose = function(i, a) {
		// Reset the Timer

		phoneBankCard = 30;
		$scope.timeStart = phoneBankCard;
		phoneBankIDCard = window.setInterval(timer, 1000);
		if(isSigned) {
			if(i == 1) {
				$scope.phoneBankPage = 12;
				window.clearInterval(phoneBankIDCard)
				$scope.onOf = 1;
				return
			} else if(i == 2) {
				$scope.phoneBankPage = 3;
				$scope.onOf = 2;
			} else if(i == 3) { //信息修改				
				var objMsg = {};
				objMsg.BDY = {};
				console.log(objMsg)
				common_service.post(res.PhoneBankSignMess.url, objMsg).then(function(data) {
						console.log(data)
						var product = JSON.parse(data.bsadata.RSD.selectProduct);
						$scope.options = product[0].option;
						sessionStorage.setItem("phoneBank", JSON.stringify($scope.options))
						for(var i = 0; i < $scope.options.length; i++) {
							if($scope.options[i].hasOwnProperty("pay")) {
								$scope.pays = $scope.options[i].pay;
							}
						}

						//获取用户签约的手机银行

						var phoneBankMsgObi = {};
						phoneBankMsgObi.BDY = {};
						phoneBankMsgObi.BDY.cardNo = $scope.bankCardNum
						common_service.post(res.SignMessageShow.url, phoneBankMsgObi).then(function(data) {
							console.log(data)
							if(data.bsadata.RSD.retCode == 000000) {
								var userSelectProcduct = data.bsadata.RSD.selectProduct;
								userSelectProcduct1 = JSON.parse(data.bsadata.RSD.selectProduct);
								sessionStorage.setItem("userSelectProcduct", userSelectProcduct);
								console.log(userSelectProcduct1)
								swichOff = window.setInterval(function() {
									var displayCSS = $('.myswitch').css("display");
									console.log(displayCSS)
									if(displayCSS == 'block') {
										$('.myswitch input').bootstrapSwitch('state');

										for(var i = 0; i < userSelectProcduct1.length; i++) {
											for(var o = 0; o < userSelectProcduct1[i].option.length; o++) {
												if(userSelectProcduct1[i].option[o].isOpen) {
													$('.chec_' + o).bootstrapSwitch('state', true);
												}
												if("pay" in userSelectProcduct1[i].option[o]) {
													for(var p = 0; p < userSelectProcduct1[i].option[o].pay.length; p++) {
														$(".one_" + o + "_" + p).val(userSelectProcduct1[i].option[o].pay[p].count)
													}
												}
											}
										}
										window.clearInterval(swichOff)
									}
								}, 100);

							} else {
								alert("签约信息查询失败");
								return;
							}
						})
					})
					//get the proctuc

				$scope.phoneBankPage = 3;
				$scope.onOf = 3;
			} else if(i == 4) {
				$scope.phoneBankPage = 3;
				$scope.onOf = 4;
			}

			TSSDeviceTools.initDevice().then(function(data) {
				if(data) {
					TSSDeviceTools.idReaderRead(3, 1).then(function(ret) {
						console.log(ret)
						subFrom.vcherNo = ret.idNumber;
						subFrom.name = ret.name;
						common_service.post(res.queryBlackList.url, subFrom).then(function(data) {
							console.log(data)
							if(data.retCode == "TNCMCT08104") { //black person
								alert(data.retMsg);
								return;
							}
							//请求服务流水号
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
								if(data.retCode == "PD0000") {
									serviceNoa = data.bsadata.serialNoList[0];
									var msg = JSON.parse(sessionStorage.getItem('msg'))
									var mock = msg.mock;
									var phoneIdCard = 3
									var i = $scope.onOf;

									if(mock) {
										phoneIdCardTimer = window.setInterval(function() {
											console.log(phoneIdCard)
											phoneIdCard--;
											if(phoneIdCard == 0) {
												window.clearInterval(phoneIdCardTimer);
												window.clearInterval(phoneBankIDCard);
												if(i == 1) {
													$scope.phoneBankPage = 4;
													$scope.phoneBankFunc = 4;
												} else if(i == 2) {
													$scope.phoneBankPage = 5;
													$scope.phoneBankFunc = 7;
												} else if(i == 3) {
													$scope.phoneBankPage = 6;
												} else if(i == 4) {
													$scope.phoneBankPage = 7;
												}
											}
										}, 1000)
									} else {
										console.log("进来了？")
										window.clearInterval(phoneBankIDCard);
										if(i == 1) {
											$scope.phoneBankPage = 4;
											$scope.phoneBankFunc = 4;
										} else if(i == 2) {
											$scope.phoneBankPage = 5;
											$scope.phoneBankFunc = 7;
										} else if(i == 3) {
											$scope.phoneBankPage = 6;
										} else if(i == 4) {
											$scope.phoneBankPage = 7;
										}
									}
								} else {
									alert("获取流水服务号失败")
									return;
								}
							})

						})
					})
				}
			})
		}

		// Get ID Card Message 
		if(!isSigned) {
			if(a == 1 || a == 2) {
				$scope.phoneBankPage = 3;
				$scope.phoneBankFunc = 4;
				$scope.onOf = 1;
				TSSDeviceTools.initDevice().then(function(data) {
					if(data) {
						TSSDeviceTools.idReaderRead(3, 1).then(function(ret) {

							subFrom.vcherNo = ret.idNumber;
							subFrom.name = ret.name;
							common_service.post(res.queryBlackList.url, subFrom).then(function(data) {
								console.log(data)
								if(data.retCode == "TNCMCT08104") { //black person
									alert(data.retMsg);
									return;
								}
								//请求服务流水号
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
									if(data.retCode == "PD0000") {
										serviceNoa = data.bsadata.serialNoList[0];
										var msg = JSON.parse(sessionStorage.getItem('msg'))
										var mock = msg.mock;
										var phoneIdCard = 5
										var i = $scope.onOf;

										if(mock) {
											phoneIdCardTimert = window.setInterval(function() {
												phoneIdCard--;
												console.log(phoneIdCard)
												if(phoneIdCard == 0) {

													window.clearInterval(phoneIdCardTimert);
													window.clearInterval(phoneBankIDCard);

													$scope.phoneBankPage = 4;
													$scope.phoneBankFunc = 4;

												}
											}, 1000)
										} else {

											window.clearInterval(phoneBankIDCard);

											$scope.phoneBankPage = 4;
											$scope.phoneBankFunc = 4;

										}
									} else {
										alert("获取流水服务号失败")
										return;
									}
								})

							})
						})
					}
				})
			} else {
				$scope.phoneBankPage = 5;
				$scope.phoneBankFunc = 6;
				window.clearInterval(phoneBankIDCard);
			}

		}

	}

	phoneBankObj.getIndex = function(i) {}

	phoneBankObj.resetPwd = function() {
		//第一次输入密码
		if(!pwdStyle.test($scope.tss.newPwd)) {
			$scope.newPwdAgain = true;
			$scope.phoneMsgTwo = "请输入六位数字密码"
			return;
		} else {
			$scope.newPwdAgain = false;
		}
		var subFrom = {};
		var COH = {};
		var CTL = {};
		COH.TRANSINSTNO = "900001";
		COH.TRANSTELLER = "900001001";
		CTL.serialNoCounts = "1"; //目前写死，都是报文里的 以后要取值
		subFrom.COH = COH;
		subFrom.CTL = CTL;
		common_service.post(res.TWScreateSerialNo.url, subFrom).then(function(data) {
			$scope.transSerialNob = data.bsadata.serialNoList;
			console.log($scope.transSerialNob)
		})
	}

	phoneBankObj.resetPwdAgain = function() {
		//第二次输入密码
		if($scope.tss.newPwdAgain != $scope.tss.newPwd) {
			$scope.newPwdAgain = true;
			$scope.phoneMsgTwo = "两次密码输入不一致"
			return;
		} else {
			$scope.newPwdAgain = false;
		}
		var subFrom = {};
		var COH = {};
		var CTL = {};
		COH.TRANSINSTNO = "900001";
		COH.TRANSTELLER = "900001001";
		CTL.serialNoCounts = "1"; //目前写死，都是报文里的 以后要取值
		subFrom.COH = COH;
		subFrom.CTL = CTL;
		common_service.post(res.TWScreateSerialNo.url, subFrom).then(function(data) {
			$scope.transSerialNob = data.bsadata.serialNoList;
			console.log($scope.transSerialNob)
		})
	}

	phoneBankObj.finishReset = function() {
		if($scope.newPwd) {
			return;
		}
		if($scope.newPwdAgain) {
			return;
		}

		if($scope.tss.newPwd == undefined) {
			$scope.newPwdAgain = true;
			$scope.phoneMsgTwo = "请输入六位数字密码";
			return;
		}

		if($scope.tss.newPwdAgain == undefined) {
			$scope.newPwdAgain = true;
			$scope.phoneMsgTwo = "两次密码输入不一致";
			return;
		}

		//reset the pwd
		var cardResetPwdObj = subFromObj;
		cardResetPwdObj.BDY = {};
		var now = new Date().Format("yyyy-MM-dd hh:mm:ss");
		cardResetPwdObj.COH.TRANSSTARTTIME = now;
		cardResetPwdObj.COH.TRANSDATE = now;
		cardResetPwdObj.COH.TRANSSERIALNO = $scope.transSerialNob.toString(); //交易流水号
		cardResetPwdObj.COH.SERVICESERIALNO = serviceNoa
		cardResetPwdObj.COH.TRANSTIME = now;
		cardResetPwdObj.COH.TRANSCODE = 'TX600108';
		cardResetPwdObj.BDY.cardNo = $scope.bankCardNum;
		cardResetPwdObj.BDY.newPassWord = $scope.tss.newPwdAgain;
		console.log(cardResetPwdObj)
		common_service.post(res.TX600108.url, cardResetPwdObj).then(function(data) {
			console.log(data)
			if(data.retCode == 000000) {
				$scope.phoneBankPage = 8;
			} else {
				alert(data.retMsg);
				return;
			}
		})

	}

	phoneBankObj.finishMsgChange = function() {
		var userChangePro = JSON.parse(sessionStorage.getItem("userSelectProcductOne"));
		for(var i = 0; i < userChangePro.length; i++) {
			for(var u = 0; u < userChangePro[i].option.length; u++) {
				if("pay" in userChangePro[i].option[u]) {
					for(var p = 0; p < userChangePro[i].option[u].pay.length; p++) {
						userChangePro[i].option[u].pay[p].count = $(".one_" + u + "_" + p).val();
					}
				}
			}
		}
		var getNum = {};
		var COH = {};
		var CTL = {};
		COH.TRANSINSTNO = "900001";
		COH.TRANSTELLER = "900001001";
		CTL.serialNoCounts = "1"; //目前写死，都是报文里的 以后要取值
		getNum.COH = COH;
		getNum.CTL = CTL;
		common_service.post(res.TWScreateSerialNo.url, getNum).then(function(data) {
			$scope.transSerialNop = data.bsadata.serialNoList;
			var changProObj = subFromPhone;
			var now = new Date().Format("yyyy-MM-dd hh:mm:ss");
			console.log(changProObj);
			changProObj.COH.TRANSSTARTTIME = now;
			changProObj.COH.TRANSDATE = now;
			changProObj.COH.TRANSSERIALNO = $scope.transSerialNop.toString(); //交易流水号
			changProObj.COH.SERVICESERIALNO = serviceNoa //获取服务流水号
			changProObj.COH.TRANSTIME = now;
			changProObj.COH.TRANSCODE = 'TX600107';
			changProObj.BDY = {};
			changProObj.BDY.selectProduct = userChangePro;
			changProObj.BDY.cardNo = $scope.bankCardNum;
			console.log(changProObj)
			common_service.post(res.TX600107.url, changProObj).then(function(ret) {
				console.log(ret)
				if(ret.retCode == 000000) { //修改成功
					$scope.phoneBankPage = 8;
				}
			})
		})

	}

	phoneBankObj.finishCountChange = function() {
		$scope.phoneBankPage = 9;
	}

	phoneBankObj.agreement = function() {
		$('.switchOne').css("display", "block");
		var objMsg = {};
		objMsg.BDY = {};
		common_service.post(res.PhoneBankSignMess.url, objMsg).then(function(data) {
			console.log(data);
			var product = JSON.parse(data.bsadata.RSD.selectProduct)
			console.log(product)
			swichOff = window.setInterval(function() {

				var displayCSS = $('.switchOne').css("display");
				console.log(displayCSS)
				if(displayCSS == 'block') {
					console.log("进来了")
					$('.switchOne input').bootstrapSwitch('state');
					window.clearInterval(swichOff)
				}
			}, 100)
			sessionStorage.setItem("productOne", data.bsadata.RSD.selectProduct)
			$scope.optionsOne = product[0].option;
			for(var i = 0; i < $scope.optionsOne.length; i++) {
				if($scope.optionsOne[i].hasOwnProperty("pay")) {
					$scope.paysOne = $scope.optionsOne[i].pay;
				}
			}

			$scope.phoneBankPage = 13;
		})

	}

	phoneBankObj.finishSetPwd = function() {

		if($scope.phoneBankPwd) {
			return;
		}

		if($scope.tss.phoneBankPwd == undefined || $scope.tss.phoneBankPwd == '') {
			$scope.phoneBankPwdAgain = true;
			$scope.phoneMsgTh = "请输入六位数字密码"
			return;
		} else {
			$scope.phoneBankPwd = false;
		}

		if(tss.phoneBankPwdAgain == undefined || tss.phoneBankPwdAgain == '') {
			$scope.phoneBankPwdAgain = true;
			$scope.phoneMsgTh = "两次密码输入不一致"
			return;
		} else {
			$scope.phoneBankPwdAgain = false;
		}
		//set the pwd
		var cardPwdObj = subFromObj;
		cardPwdObj.BDY = {};
		var now = new Date().Format("yyyy-MM-dd hh:mm:ss");
		cardPwdObj.COH.TRANSSTARTTIME = now;
		cardPwdObj.COH.TRANSDATE = now;
		cardPwdObj.COH.TRANSSERIALNO = $scope.transSerialNoa.toString(); //交易流水号
		cardPwdObj.COH.SERVICESERIALNO = serviceNoa
		cardPwdObj.COH.TRANSTIME = now;
		cardPwdObj.COH.TRANSCODE = 'TX600106';
		cardPwdObj.BDY.cardNo = $scope.bankCardNum;
		cardPwdObj.BDY.phonePassWord = $scope.tss.phoneBankPwdAgain;
		cardPwdObj.BDY.selectProduct = productFirstNed;
		console.log(cardPwdObj)
		common_service.post(res.TX600106.url, cardPwdObj).then(function(data) {
			console.log(data)
			if(data.retCode == 000000) {
				$scope.phoneBankPage = 8;
			} else {
				alert(data.retMsg);
				return;
			}
		})
	}

	phoneBankObj.telNumTest = function() {
		var phoneBankTelNum = tss.phoneBankTelNum;
		if(!telNum.test(phoneBankTelNum)) {
			$scope.isRightTelNum = true;
			console.log('11')
			$scope.isDisabledz = true;
		} else {
			$scope.isRightTelNum = false;
			$scope.isDisabledz = false;
		}
	}

	phoneBankObj.getMsgCodeTel = function() {
		$scope.isDisabledz = true;
		$scope.title1 = codeTime + '(s)';
		codeTimer = window.setInterval(function() {
			codeTime--;
			$scope.title1 = codeTime + '(s)';
			if(codeTime == 0) {
				window.clearInterval(codeTimer);
				$scope.title1 = '获取';
				$scope.isDisabledz = false;
			}
		}, 1000)

	}
	phoneBankObj.setPwdInput = function() {
		if(!pwdStyle.test(tss.phoneBankPwd)) {
			$scope.phoneBankPwdAgain = true;
			$scope.phoneMsgTh = "请输入六位数字密码"
			return;
		} else {
			$scope.phoneBankPwdAgain = false;
		}

		var subFrom = {};
		var COH = {};
		var CTL = {};
		COH.TRANSINSTNO = "900001";
		COH.TRANSTELLER = "900001001";
		CTL.serialNoCounts = "1"; //目前写死，都是报文里的 以后要取值
		subFrom.COH = COH;
		subFrom.CTL = CTL;
		common_service.post(res.TWScreateSerialNo.url, subFrom).then(function(data) {
			$scope.transSerialNoa = data.bsadata.serialNoList;
			console.log($scope.transSerialNoa)
		})
	}
	phoneBankObj.setPwdInputAgain = function() {
		if(tss.phoneBankPwdAgain != tss.phoneBankPwd) {
			$scope.phoneBankPwdAgain = true;
			$scope.phoneMsgTh = "两次密码输入不一致"
			return;
		} else {
			$scope.phoneBankPwdAgain = false;
		}

		var subFrom = {};
		var COH = {};
		var CTL = {};
		COH.TRANSINSTNO = "900001";
		COH.TRANSTELLER = "900001001";
		CTL.serialNoCounts = "1"; //目前写死，都是报文里的 以后要取值
		subFrom.COH = COH;
		subFrom.CTL = CTL;
		common_service.post(res.TWScreateSerialNo.url, subFrom).then(function(data) {
			$scope.transSerialNoa = data.bsadata.serialNoList;
			console.log($scope.transSerialNoa)
		})
	}

	phoneBankObj.setPwd = function() {
		if($scope.isRightTelNum == true) {
			return;
		}
		if(tss.MsgCode == undefined) {
			alert('请输入验证码！');
			return;
		}
		$scope.phoneBankPage = 9;
	}

	phoneBankObj.finishTest = function() {
		if(tss.memberCount == undefined || tss.memberPwd == undefined) {
			alert('账号密码不能为空！');
			return;
		}
		$scope.phoneBankPage = 10;

		signCanvas = window.setInterval(function() {
			var displayCSS = $('#domeId').css("display");
			console.log(displayCSS)
			if(displayCSS === 'block') {
				$('.js-signature').jqSignature();
				window.clearInterval(signCanvas);
			}
		}, 100);
	}

	phoneBankObj.cancelSign = function() {
		window.clearInterval(signCanvas);
		$('.js-signature').jqSignature('clearCanvas');
	}

	phoneBankObj.finishSign = function() {
		//		var isEmpty = $('.js-signature').getImageData();
		//		console.log(isEmpty)
		//		return;
		//		if(isEmpty) {
		//			alert('请签名！');
		//			return;
		//		}
		window.clearInterval(signCanvas);
		$('#signature').empty();
		signContainer = $('.js-signature').jqSignature('getDataURL');
		$scope.phoneBankPage = 11;
		
		var phoneBankEndTime = 30;
		$scope.timeStart = phoneBankEndTime;
		phoneBankEndTimer = window.setInterval(function() {
			phoneBankEndTime--;
			$scope.timeStart = phoneBankEndTime;
			console.log(phoneBankEndTime);
			if(phoneBankEndTime == 0) {
				window.clearInterval(phoneBankEndTimer);
				$state.go('dashboard');
			}
		}, 1000)
		
		
		
		
		
		
		if($scope.onOf == 1) {
			$scope.endTips = "您的手机银行已经开通";
		} else if($scope.onOf == 2) {
			$scope.endTips = "您的手机银行密码已经重置";
		} else if($scope.onOf == 3) {
			$scope.endTips = "您的签约信息已经修改成功";
		} else if($scope.onOf == 4) {
			$scope.endTips = "您的签约账户已经维护成功";
		}
	}

	phoneBankObj.finishAll = function() {
		$state.go('dashboard');
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