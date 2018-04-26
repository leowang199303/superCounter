angular.module('myApp').controller('actcard_controller', function($scope, $interval, actcard_service, $rootScope, common_service, $state) {
	var enterCount = false;
	$scope.enterCount = enterCount;
	var checkPass = false;
	$scope.checkPass = checkPass;
	var pwdStyle = /^[0-9]{6}$/;
	var btnDiss = true;
	$scope.btnDiss = btnDiss;
	var bankCardIdTimer;
	var card = {};
	$scope.card = card;
	var serviceNoa;
	//所有信息对象
	var canvas;
	$scope.timeStart = 30;
	var subFrom = {};
	$scope.subFrom = subFrom;
	//页签控制
	var pageflag = 0;
	$scope.pageflag = pageflag;
	//卡片信息
	var cardtype = [];
	$scope.cardtype = cardtype;
	//产品签约信息
	var productList = [];
	$scope.productList = productList;
	var productListLength;
	//身份证图片
	var idcardphoto = "";
	$scope.idcardphoto = idcardphoto;
	//全局流水号
	var transSerialNo = "";
	$scope.transSerialNo = transSerialNo;
	//查询所有个性化配置
	var res = $rootScope.res.actcard_service; //页面所需调用的服务
	//保存签名 
	var imgUrl;
	var tssOpenCard = {};
	$scope.tssOpenCard = tssOpenCard;
	//授权请求状态码
	$scope.retCode = 0;
	$scope.pwd = false;
	//返回首页
	$scope.openCard = 0;
	var swichOff;
	var subFromOpen = res.DealObj

	$scope.oneCount = false;
	$scope.dayCount = false;
	var reg = /^[1-9]\d*$/;

	var list;
	//步骤一
	card.cardOne = function() {
		$scope.openCard = 1;
		$scope.bar[0].img = "./images/select.png";
		//请求卡片数据
		var subFrom = {};
		subFrom.tellerNo = "900001005";
		subFrom.branchId = "90091";
		common_service.post(res.queryCard.url, subFrom).then(function(data) {
				var a = {};
				a.code = "测试"
				console.log(data.bsadata)
				data.bsadata[0].product.push(a);
				$scope.cardtype = data.bsadata; //后台返回样式			
			})
			//获取流水号,交易流请求的时候都要包COH  CTL  BDY
		subFrom = {};
		var COH = {};
		var CTL = {};
		COH.TRANSINSTNO = "900001";
		COH.TRANSTELLER = "900001001";
		CTL.serialNoCounts = "1"; //目前写死，都是报文里的 以后要取值
		subFrom.COH = COH;
		subFrom.CTL = CTL;
		common_service.post(res.TWScreateSerialNo.url, subFrom).then(function(data) {
			$scope.transSerialNo = data.bsadata.serialNoList;
			console.log($scope.transSerialNo)
		})
	}

	//卡片种类页面的上一步
	card.backCardK = function() {
			$scope.openCard = 0;
		}
		//卡片详细信息的上一步
	card.backCardI = function() {
		$scope.openCard = 1;
	}
	card.backCardPhoto = function() {
		$scope.bar[2].img = "./images/noselect.png";
		$scope.openCard = 4;
	}

	//选择卡片跳转
	card.details = function(card) {
			$scope.bar[0].img = "./images/select.png";
			$scope.openCard = 2;
			$scope.subFrom.carditem = card;
		}
		//the name of timer open card
	var openCardIdCheck;
	var timeStart = 30;
	card.choseCard = function() {
		timeStart = 30;
		$scope.timeStart = timeStart;
		//开始身份审核
		$scope.openCard = 3;
		$scope.bar[1].img = "./images/select.png";
		//开始读取身份证信息
		//set Timer
		openCardIdCheck = window.setInterval(function() {
			timeStart--;
			$scope.timeStart = timeStart
			if(timeStart == 0) {
				$state.go('dashboard');
				window.clearInterval(openCardIdCheck);
			}
		}, 1000)
		TSSDeviceTools.initDevice().then(function(data) {
			if(data) {
				TSSDeviceTools.idReaderRead(3, 1).then(function(ret) {

					var msg = JSON.parse(sessionStorage.getItem('msg'))
					var mock = msg.mock;
					var bankCardIdTime = 3;
					if(mock) { //模拟数据
						bankCardIdTimer = window.setInterval(function() {
							bankCardIdTime--;
							console.log(bankCardIdTime)
							if(bankCardIdTime == 0) {
								window.clearInterval(openCardIdCheck);
								window.clearInterval(bankCardIdTimer);
								$scope.openCard = 4;
							}
						}, 1000)

					} else {
						window.clearInterval(openCardIdCheck);
						window.clearInterval(bankCardIdTimer);
						$scope.openCard = 4;
					}
					console.log(ret)
					$scope.name = ret.name;
					$scope.sex = ret.sex;
					$scope.authority = ret.authority;
					$scope.expiryDate = ret.expiryDate;
					//外设获取到信息以后联网核查
					var subFrom = {};
					subFrom.vcherType = "101"; //超哥定义的 不知道为什么
					subFrom.vcherNo = ret.idNumber; //idc.vcherNo 页面输入的身份证内容
					subFrom.name = ret.name; //页面输入的名称
					subFrom.phFlag = "1";
					subFrom.tellerNo = "900001005";
					subFrom.branchId = "900001"; //这三个写死
					common_service.post(res.singleCheck.url, subFrom).then(function(data) {
						console.log(data)
						if(data.retCode == "TDCMCT08006") { //如果审核失败，不执行任何方法
							console.log(data.retMsg);
							return;
						} else {
							$scope.idcardphoto = data.bsadata.photo; //拿到后台返回的数据
							var idcard = {};
							idcard.vcherType = "101";
							idcard.vcherNo = ret.idNumber;
							idcard.name = ret.name;
							idcard.visBrno = data.bsadata.visBrno;
							$scope.subFrom.idcard = idcard;
							$scope.iddetails = true;
							console.log(data.bsadata);

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
									console.log(serviceNoa)
								} else {
									alert("获取流水服务号失败")
									return;
								}
							})

						}
					})

					common_service.post(res.queryBlackList.url, subFrom).then(function(data) {
						console.log(data)
						if(data.retCode == "TDCMCT08006") {
							alert(data.retMsg);
						} else {
							$scope.bar[1].img = "./images/select.png";
							//window.clearInterval(openCardIdCheck);
							console.log(data.retMsg)
						}
					})
				})
			}
		})
	}
	card.backCardID = function() {

		window.clearInterval(openCardIdCheck);
		$scope.openCard = 2;
		$scope.bar[1].img = "./images/noselect.png";
	}
	card.backCardIDMsg = function() {
		$scope.openCard = 3;
	}

	//联网核查成功后,进入拍照界面
	card.successnext = function() {

		$scope.openCard = 5;
		$scope.bar[2].img = "./images/select.png";
	}

	//拍照之后录入信息
	card.getMsg = function() {
			$scope.openCard = 6;
		}
		//点击发送验证码
	var titlerTimer
	card.validateph = function() {
			//倒计时
			var titleTimerT = 30;
			$scope.isDisabled = true;
			$scope.title1 = titleTimerT + 's';
			titlerTimer = window.setInterval(function() {
				titleTimerT--;
				console.log(titleTimerT)
				$scope.title1 = titleTimerT + 's';
				if(titleTimerT == 0) {
					$scope.isDisabled = false;
					window.clearInterval(titlerTimer);
					$scope.title1 = '重新获取';
				}
			}, 1000)
		}
		//信息录入
	card.msgOver = function() {
		var phone = $scope.subFrom.personDetails.phone;
		if(phone == undefined) {
			alert('请输入手机号');
			return;
		}
		var testNum = $scope.subFrom.vCode;
		if(testNum == undefined) {
			alert('请输入验证码！');
			return;
		}

		var subFrom = {};
		subFrom.BDY = {};
		common_service.post(res.QuerySignProduct.url, subFrom).then(function(data) {
			console.log(data)
			sessionStorage.setItem("list", data.bsadata.RSD.selectProduct)
			list = JSON.parse(data.bsadata.RSD.selectProduct);
			$scope.productList = list;
			productListLength = list.length;

		})

		$scope.openCard = 7;
		$scope.bar[3].img = "./images/select.png";

		swichOff = window.setInterval(function() {
			var displayCSS = $('.myswitch').css("display");
			console.log(displayCSS)
			if(displayCSS == 'block') {
				$('.myswitch input').bootstrapSwitch('state');
				window.clearInterval(swichOff)
			}
		}, 100);
		window.clearInterval(titlerTimer);
	}

	var productChosen = []; //最外层得数组

	card.sign = function(outerIndex) {
		var listCheck = JSON.parse(sessionStorage.getItem("listCheck"));
		console.log(listCheck)
		for(var i = 0; i < listCheck.length; i++) {
			for(var j = 0; j < listCheck[i].option.length; j++) {
				if("pay" in listCheck[i].option[j]) {
					if(listCheck[i].option[j].isOpen) {
						listCheck[i].option[j].pay[0].count = $('.one_' + i + '_2').val();
						listCheck[i].option[j].pay[1].count = $('.day_' + i + '_2').val();
					}
				}
			}
		}

		var optionsIndetail = {}; //每个业务的对象
		var options = []; //每个业务的options 		
		for(var i = 0; i < $scope.productList.length; i++) {
			var state = $('.chec_' + i + '_0').bootstrapSwitch('state');
			if(state) {
				//每个业务的对象
				var oneProduct = {};
				oneProduct.productName = $('.chec_' + i + '_0').attr('productName');
			}
			var productOptions = [];
			for(var j = 0; j < $scope.productList[i].option.length; j++) {
				var state1 = $('.chec_' + i + '_' + j).bootstrapSwitch('state');
				var oneCount = $('.one_' + i + '_' + j).val();
				var dayCount = $('.day_' + i + '_' + j).val();
				if(state1) {
					var oneProductOption = {};
					oneProductOption.optionName = $('.chec_' + i + '_' + j).attr('value');
					oneProductOption.optionValue = $('.chec_' + i + '_' + j).attr('optionValue');

					if(oneCount != undefined && oneCount != '') {
						if(reg.test(oneCount)) {
							$('.oneShow_' + i + '_' + j).css('display', 'none');
						} else {
							$('.oneShow_' + i + '_' + j).css('display', 'block');
							return;
						}
						oneProductOption.oneCount = oneCount;
					}
					if(dayCount != undefined && dayCount != '') {
						if(reg.test(dayCount)) {
							$('.dayShow_' + i + '_' + j).css('display', 'none');
						} else {
							$('.dayShow_' + i + '_' + j).css('display', 'block');
							return;

						}
						oneProductOption.dayCount = dayCount;

					}
					productOptions.push(oneProductOption);
				}
			}

			if(state) {
				oneProduct.productOptions = productOptions;
				options.push(oneProduct);
			}

		}
		console.log(options)
		$scope.options = options;
		$scope.subFrom.selectProduct = JSON.stringify(listCheck);
		$scope.bar[4].img = "./images/select.png";
		$scope.openCard = 8;

		canvas = window.setInterval(function() {
			var displayCSS = $('#domeId').css("display");
			console.log(displayCSS)
			if(displayCSS === 'block') {
				if(options.length == 0) {
					$scope.showTips = false;
				} else {
					$scope.showTips = true;
				}

				for(var c = 0; c < options.length; c++) {
					for(var p = 0; p < options[c].productOptions.length; p++) {
						if(options[c].productOptions[p].hasOwnProperty("oneCount")) {
							$('.oneCount_' + c + '_' + p).css('display', 'block');
						} else {
							$('.oneCount_' + c + '_' + p).css('display', 'none');
						}
						if(options[c].productOptions[p].hasOwnProperty("dayCount")) {
							$('.dayCount_' + c + '_' + p).css('display', 'block');
						} else {
							$('.dayCount_' + c + '_' + p).css('display', 'none');
						}
					}

				}
				$('.js-signature').jqSignature();
				window.clearInterval(canvas)
			}
		}, 100);
	}
	card.clearCanvas = function() {
		$('.js-signature').jqSignature('clearCanvas');
		$('#saveBtn').attr('disabled', true);
	}

	//设置密码
	card.rightMsg = function() {
		window.clearInterval(canvas);
		$('#signature').empty();
		imgUrl = $('.js-signature').jqSignature('getDataURL');
		console.log(imgUrl);
		$scope.openCard = 9;
		//遮罩层出现
		$("#mask").css("height", $(document).height());
		$("#mask").css("width", $(document).width());
		$("#mask").show();
		$(".passwordsucc").show();
		$scope.bar[5].img = "./images/select.png";
		var tss = {};
		$scope.tss = tss;
		
		var getSignLinkObj = {};
		
		getSignLinkObj.FILE_NAME = ".jpg";
		getSignLinkObj.FILE_DATA = imgUrl.split(",")[1];
		common_service.post(res.signatureImg.url, getSignLinkObj).then(function(data) {
			console.log(data)

		})
	}

	card.showB = function() {
		var onePassword = $scope.tssOpenCard.setPassword;
		var twoPassword = $scope.tssOpenCard.repassWord;
		if(onePassword == undefined || twoPassword == undefined) {
			return;
		}
		if($scope.checkPass) {
			return;
		}
		if(onePassword != twoPassword) {
			$scope.checkPass = true;
			$scope.openMsgOne = "两次密码输入不一致"
			return;
		} else {
			$scope.checkPass = false;
		}
		if($scope.retCode == "002001") { //提交交易成功
			$scope.openCard = 10;
		}
		//开始交易提交
		var cardChangeObj = subFromOpen;
		//修改BDY格式   BDY  COH  CTL分别包在subFrom下面，传值给后台，看接口文档定义  只要牵扯到交易，必须传 COH  CTL 业务数据放在BDY中
		//除了BDY是把前端的值给后台的，目前COH和CTL全写死
		cardChangeObj.BDY = {};
		cardChangeObj.BDY.cardName = $scope.subFrom.carditem.cardName;
		cardChangeObj.BDY.imgUrl = imgUrl;
		cardChangeObj.BDY.vcherNo = $scope.subFrom.idcard.vcherNo;
		cardChangeObj.BDY.vcherType = $scope.subFrom.idcard.vcherType;
		cardChangeObj.BDY.visBrno = $scope.subFrom.idcard.visBrno;
		cardChangeObj.BDY.passWord = $scope.tssOpenCard.repassWord;
		cardChangeObj.BDY.address = $scope.subFrom.personDetails.address;
		cardChangeObj.BDY.companyName = $scope.subFrom.personDetails.companyName;
		cardChangeObj.BDY.job = $scope.subFrom.personDetails.job;
		cardChangeObj.BDY.personGender = $scope.subFrom.personDetails.personGender;
		cardChangeObj.BDY.personName = $scope.subFrom.personDetails.personName;
		cardChangeObj.BDY.phone = $scope.subFrom.personDetails.phone;
		cardChangeObj.BDY.selectProduct = JSON.parse($scope.subFrom.selectProduct);
		var now = new Date().Format("yyyy-MM-dd hh:mm:ss");
		cardChangeObj.COH.TRANSDATE = now;
		cardChangeObj.COH.TRANSSTARTTIME = now;
		cardChangeObj.COH.TRANSCODE = "TX600101"; //交易码
		cardChangeObj.COH.orgName = "0000";
		cardChangeObj.COH.TRANSSERIALNO = $scope.transSerialNo.toString(); //交易流水号
		cardChangeObj.COH.SERVICESERIALNO = serviceNoa;
		cardChangeObj.COH.TRANSTIME = now;
		console.log(cardChangeObj)
		common_service.post(res.TranServer.url, cardChangeObj).then(function(data) {
			//提交交易
			console.log(data);
			if(data.retCode == '002001') {
				//需要授权
				$scope.retCode = data.retCode;
				$scope.data = data;
				$(".passwordsucc").hide();
				$(".get-right-open-card").show();
				$scope.openCard = 10;

			} else {
				$(".passwordsucc").hide();
				$("#mask").hide();
				$scope.openCard = 11;
				var endTimew = 30;
				$scope.timeStart = endTimew;
				cardOpenEndTimer = window.setInterval(function() {
					endTimew--;
					console.log(endTimew)
					$scope.timeStart = endTimew;
					if(endTimew == 0) {
						$state.go('dashboard');
						window.clearInterval(cardOpenEndTimer);
					}
				}, 1000)
			}

		})

	}
	$scope.cardCancle = function() {
		$scope.openCard = 9;

	}
	card.backCardInMsg = function() {
		$scope.openCard = 5;
	}
	var time = false
	var endTimew = 30;
	var cardOpenEndTimer
		//$scope.timeStart = endTimew;
	card.sureCard = function() {
		if(time == false) { //开始账号验证
			//交易提交成功，开始申请授权	
			console.log($scope.data)
			var dataObj = subFromOpen;
			dataObj.BDY = $scope.data.RSD;
			dataObj.COH = $scope.data.RSH;
			dataObj.CTL = $scope.data.CTL
			var memCount = $scope.tss.count;
			dataObj.COH.AUTHTELLER = memCount // 900001002 可以验证通过的账户
			console.log(dataObj)
			if(dataObj.COH.AUTHTELLER == undefined) {
				$scope.sucessMsg = '请输入账户';
				return;
			}
			dataObj.CTL.TEVENTACTION = $scope.data.tevenData;
			dataObj.CTL.OPERATEMODEL = '14';
			var now = new Date().Format("yyyy-MM-dd hh:mm:ss");
			dataObj.COH.TRANSSTARTTIME = now;
			console.log(dataObj)
			common_service.post(res.TranServer.url, dataObj).then(function(ret) {
				console.log(ret);
				if(ret.retCode == '002102') {
					//申请授权成功
					time = true;
					$scope.pwd = true;
					$scope.ret = ret;
					$scope.sucessMsg = '授权申请成功，请输入密码'
				} else if(ret.retCode == '002103') {
					time = false;
					$scope.sucessMsg = '申请授权异常'
				}
			})
		} else { //开始密码验证
			var memObj = subFromOpen;
			memObj.BDY = $scope.ret.RSD;
			memObj.COH = $scope.ret.RSH;
			memObj.CTL = $scope.ret.CTL
			var memPwd = $scope.tss.pwd;
			memObj.COH.AUTHTELLERPWD = memPwd //密码 dc483e80a7a0bd9ef71d8cf973673924
			memObj.CTL.TEVENTACTION = $scope.ret.tevenData;
			memObj.CTL.OPERATEMODEL = '18';
			var now = new Date().Format("yyyy-MM-dd hh:mm:ss");
			memObj.COH.TRANSSTARTTIME = now;
			console.log(memObj);
			common_service.post(res.TranServer.url, memObj).then(function(rest) {
				console.log(rest)
				$scope.rest = rest;
				if(rest.retCode == '002111') {
					//授权员密码通过验证	
					//柜员授权成功，开始柜员提交
					$scope.sucessMsg = '授权员密码校验通过'
					var signObj = subFrom;
					signObj.BDY = $scope.rest.RSD;
					signObj.COH = $scope.rest.RSH;
					signObj.CTL = $scope.rest.CTL;
					signObj.CTL.TEVENTACTION = $scope.ret.tevenData;
					signObj.CTL.OPERATEMODEL = '17';
					var now = new Date().Format("yyyy-MM-dd hh:mm:ss");
					signObj.COH.TRANSSTARTTIME = now;
					console.log(signObj)
					common_service.post(res.TranServer.url, signObj).then(function(r) {
						console.log(r)
						var bsadata = JSON.parse(r.bsadata)
						$scope.cardNum = bsadata.cardNo;
						$scope.openCard = 11;
						$scope.bar[6].img = "./images/select.png";

						$(".get-right-open-card").hide();
						$("#mask").hide();
						var endTimew = 30;
						$scope.timeStart = endTimew;
						cardOpenEndTimer = window.setInterval(function() {
							endTimew--;
							console.log(endTimew)
							$scope.timeStart = endTimew;
							if(endTimew == 0) {
								$state.go('dashboard');
								window.clearInterval(cardOpenEndTimer);
							}
						}, 1000)
					})
				} else if(rest.retCode == '002112') {
					$scope.sucessMsg = '授权柜员密码错误！'
				}
			})
		}

	}

	//返回首页
	$scope.backhome = function() {
		$state.go('dashboard');
	}
	card.cancel = function() {
		$scope.openCard = 1;
	}
	card.backM = function() {
		$scope.openCard = 5;
	}
	card.exitYW = function() {
			$state.go('dashboard');
			
			window.clearInterval(cardOpenEndTimer);
		}
		//测试循环体组件
	var bar = [];
	$scope.bar = bar;
	//单体对象
	var obar1 = {};
	obar1.class = "finished";
	obar1.num = "1";
	obar1.text = "选择卡片";
	obar1.last = false;
	obar1.img = './images/noselect.png'
	bar.push(obar1);

	var obar2 = {};
	obar2.class = "finished";
	obar2.num = "2";
	obar2.text = "身份审核";
	obar2.last = false;
	obar2.img = './images/noselect.png'
	bar.push(obar2);

	var obar3 = {};
	obar3.class = "finished";
	obar3.num = "3";
	obar3.text = "信息录入";
	obar3.last = false;
	obar3.img = './images/noselect.png'
	bar.push(obar3);

	var obar4 = {};
	obar4.class = "finished";
	obar4.num = "4";
	obar4.text = "产品签约";
	obar4.last = false;
	obar4.img = './images/noselect.png'
	bar.push(obar4);

	var obar5 = {};
	obar5.class = "finished";
	obar5.num = "5";
	obar5.text = "信息确认";
	obar5.last = false;
	obar5.img = './images/noselect.png'
	bar.push(obar5);

	var obar6 = {};
	obar6.class = "finished";
	obar6.num = "6";
	obar6.text = "设置密码";
	obar6.last = false;
	obar6.img = './images/noselect.png'
	bar.push(obar6);

	var obar7 = {};
	obar7.class = "finished";
	obar7.num = "7";
	obar7.text = "开户成功";
	obar7.last = true;
	obar7.img = './images/noselect.png'
	bar.push(obar7);

	//btn样式初始化
	$scope.isActive = false;
	$scope.telStyle = false;
	$scope.isDisabled = true;
	$scope.isDisabledz = true;
	card.telNum = function() {
		var telNum = $scope.subFrom.personDetails.phone;
		if(!(/^1[34578]\d{9}$/.test(telNum))) {
			$scope.telStyle = true;
			$scope.isActive = true;
			$scope.isDisabled = true;
			$scope.isDisabledz = true;
		} else {
			$scope.telStyle = false;
			$scope.isActive = false;
			$scope.isDisabled = false;
			$scope.isDisabledz = false;
		}
	}

	var personDetails = {};
	$scope.subFrom.personDetails = personDetails;
	$scope.title1 = "获取";

	card.cardBackPWD = function() {
		$scope.openCard = 8;
	}
	card.clean = function() {
		
		window.clearInterval(cardOpenEndTimer); //结束业务计时器
		window.clearInterval(openCardIdCheck); //身份验证计时器
		window.clearInterval(bankCardIdTimer);
		window.clearInterval(titlerTimer); //清楚验证码计时器
		$state.go('dashboard');
	}
	$scope.setPassword = function() {
		//设置张海密码
		var setpassword = $scope.tssOpenCard.setPassword;
		var againPassword = $scope.tssOpenCard.repassWord;
		if(againPassword != undefined) {
			if(setpassword != againPassword) {
				$scope.checkPass = true;
				$scope.openMsgOne = "两次密码输入不一致"
			} else {
				$scope.checkPass = false;
			}
		}
		if(pwdStyle.test(setpassword)) {
			$scope.checkPass = false;
		} else {
			$scope.openMsgOne = "请输入六位数字"
			$scope.checkPass = true;
			return;
		}
	}
	$scope.checkAgain = function() {
		//第二次输入密码
		if($scope.tssOpenCard.repassWord != $scope.tssOpenCard.setPassword) {
			$scope.checkPass = true;
			$scope.openMsgOne = "两次密码输入不一致"
			$scope.btnDiss = true;
			return;
		} else {
			$scope.btnDiss = false;
			$scope.checkPass = false;
		}
	}

	//时间格式化
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

	card.inputGet = function() {
		var msg = JSON.parse(sessionStorage.getItem('msg'))
		var mock = msg.mock;
		TSSDeviceTools.initDevice().then(function(data) {
			if(data) {
				if(!mock) {
					TSSDeviceTools.inputServiceOpen(2);
				}
			}
		})

	}

	$(".passwordsucc").hide();
	$(".get-right-open-card").hide();

	card.showMask = function() {
		$("#mask").css("height", $(document).height());
		$("#mask").css("width", $(document).width());
		$("#mask").show();
		$(".get-right-open-card").show();
	}

})