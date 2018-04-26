angular.module('myApp').controller('userMsg_controller', function($scope, $rootScope, actcard_service, $rootScope, common_service, $state, $interval) {
	//leo  个人信息管理板块 控制器
	//流程组件
	//页面所需服务
	var res = $rootScope.res.actcard_service;
	var steps = [];
	var all = {};
	var personMsg = {};
	var phoneNum = /^1[34578]\d{9}$/;
	var subFromObj = res.DealObj;
	var msgD = [];
	var objAdre = {};
	var objJob = {};
	var objCompany = {};
	var objTel = {};

	//步骤二
	var steps2 = {};
	steps2.class = 'started';
	steps2.num = '1';
	steps2.text = '身份审核';
	steps2.last = false;
	steps2.img = './images/noselect.png';
	steps.push(steps2);

	//步骤三
	var steps3 = {};
	steps3.class = 'started';
	steps3.num = '2';
	steps3.text = '修改信息';
	steps3.img = './images/noselect.png';
	steps3.last = false;
	steps.push(steps3);

	//步骤四
	var steps4 = {};
	steps4.class = 'stared';
	steps4.num = '3';
	steps4.text = '确认信息';
	steps4.last = false;
	steps4.img = './images/noselect.png';
	steps.push(steps4);

	//步骤五
	var steps5 = {};
	steps5.class = 'stared';
	steps5.num = '4';
	steps5.text = '完成交易';
	steps5.last = true;
	steps5.img = './images/noselect.png';
	steps.push(steps5);

	$scope.steps = steps;

	//定义页面计时器
	//定义页面计时器
	var timeStart = 30;
	$scope.timeStart = timeStart;
	var timerEnd;
	var timerStart = window.setInterval(function() {
		timeStart--;
		console.log(timeStart)
		$scope.timeStart = timeStart;
		if(timeStart == 0) {
			window.clearInterval(timerStart);
			$state.go('dashboard');

		}
	}, 1000)

	//开始读取身份证信息
	TSSDeviceTools.initDevice().then(function(data) {
		if(data) {
			TSSDeviceTools.idReaderRead(3, 1).then(function(ret) { //身份证外设接口
				// black person list check
				var subFrom = {};
				subFrom.vcherType = "101"; //超哥定义的 不知道为什么
				subFrom.vcherNo = ret.idNumber;
				subFrom.name = ret.name; //页面输入的名称
				subFrom.phFlag = "1";
				subFrom.tellerNo = "900001005";
				subFrom.branchId = "900001"; //这三个写死
				console.log(ret)
				common_service.post(res.queryBlackList.url, subFrom).then(function(data) {
					if(data.retCode == "TNCMCT08104") {
						//black person
						console.log(data.retMsg);
						return;
					} else {
						var userMsgFind = {};
						userMsgFind.BDY = {};
						userMsgFind.BDY.idType = "02" //checked
						userMsgFind.BDY.idNo = ret.idNumber;
						$scope.idNoHoutai =  ret.idNumber;
						common_service.post(res.GainCustmerMessageShow.url, userMsgFind).then(function(data) {
							console.log(data);
							if(data.bsadata.RSD.retCode == 000000) {
								$scope.personMsg = data.bsadata.RSD;
								//获取服务流水号
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
										//mock柜台和本地
										var msg = JSON.parse(sessionStorage.getItem('msg'))
										var mock = msg.mock;
										var bankCardIdTime = 5;
										if(mock) {
											bankCardIdTimer = window.setInterval(function() {
												bankCardIdTime--;
												if(bankCardIdTime == 0) {
													window.clearInterval(bankCardIdTimer);
													window.clearInterval(timerStart);
													$scope.stepsPage = 2;
													$scope.steps[1].img = "./images/select.png";
												}
											}, 1000)
										} else {
											window.clearInterval(timerStart);
											$scope.stepsPage = 2;
											$scope.steps[1].img = "./images/select.png";
										}
									}else{
										alert("获取服务服务号失败")
										return;
									}
								})
							} else {
								alert(data.bsadata.RSD.retMsg);
								return;
							}

						})
					}

				})

			});
		}
	})
	$scope.steps[0].img = "./images/select.png";
	//	}

	all.makeSureMsg = function() {
		if($scope.isRightStyle) {
			return;
		}

		if($scope.personMsg.phone == undefined) {
			$scope.isRightStyle = true;
			return
		} else {
			$scope.isRightStyle = false;
		}

		if(objAdre.hasOwnProperty('name')) {
			msgD.push(objAdre);
		}
		if(objTel.hasOwnProperty('name')) {
			msgD.push(objTel);
		}
		if(objCompany.hasOwnProperty('name')) {
			msgD.push(objCompany);
		}
		if(objJob.hasOwnProperty('name')) {
			msgD.push(objJob);
		}

		//获取流水号,交易流请求的时候都要包COH  CTL  BDY
		var subFrom = {};
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

		$scope.stepsPage = 3;
		$scope.steps[2].img = "./images/select.png";
		$scope.msgD = msgD;
	}

	all.makeSureAll = function() {
			subFromObj.BDY = {};
			var now = new Date().Format("yyyy-MM-dd hh:mm:ss");
			subFromObj.BDY.idNo = $scope.idNoHoutai;
			subFromObj.BDY.idType = '02';
			subFromObj.BDY.address = $scope.personMsg.address;
			subFromObj.BDY.profession = $scope.personMsg.profession;
			subFromObj.BDY.firmName = $scope.personMsg.firmName;
			subFromObj.BDY.phone = $scope.personMsg.phone;
            
			subFromObj.COH.TRANSSTARTTIME = now;
			subFromObj.COH.TRANSDATE = now;
			subFromObj.COH.TRANSSERIALNO = $scope.transSerialNo.toString(); //交易流水号
			subFromObj.COH.SERVICESERIALNO = serviceNoa //获取服务流水号
			subFromObj.COH.TRANSTIME = now;
			subFromObj.COH.TRANSCODE = 'TX600103';
           
			common_service.post(res.TX600103.url, subFromObj).then(function(data) {
				console.log(data)
				if(data.retCode == 000000) {
					var timeEnd = 30;
					$scope.timeStart = timeEnd;
					$scope.stepsPage = 4;
					$scope.steps[3].img = "./images/select.png";

					timerEnd = window.setInterval(function() {
						timeEnd--;
						console.log(timeEnd);
						$scope.timeStart = timeEnd;
						if(timeEnd == 0) {
							window.clearInterval(timerEnd)
							$state.go('dashboard');
						}
					}, 1000)

				}

			})
		}
		//页面流程控制
	var stepsPage = 0;
	var timeEnd = 30;
	$scope.stepsPage = stepsPage;

	all.next = function(stepsPage) {
		if(stepsPage == 3) {}
		stepsPage++;
		$scope.stepsPage = stepsPage;
	}

	//点击“推出业务”时应清除计时器
	all.clearTimer = function() {
		$state.go('dashboard');
		window.clearInterval(timerEnd);
	}

	all.address = function() {
		var address = document.getElementById('address').value;
		objAdre.name = "地址";
		objAdre.value = address

	}

	all.job = function() {
		var job = document.getElementById('job').value;
		objJob.name = '职业';
		objJob.value = job;

	}

	all.company = function() {
		var company = document.getElementById('company').value;
		objCompany.name = "公司";
		objCompany.value = company;

	}

	all.tel = function() {

		var tel = document.getElementById('tel').value;
		if(!phoneNum.test(tel)) {
			$scope.isRightStyle = true;
			return;
		} else {
			$scope.isRightStyle = false;
		}
		console.log(objTel)
		objTel.name = "电话";
		objTel.value = tel;

	}
	all.userMsgBack = function() {
		$scope.stepsPage = 2;
		$scope.steps[2].img = "./images/noselect.png";
	}
	$scope.all = all;
	all.msgBack = function() {
		window.clearInterval(timerEnd);
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