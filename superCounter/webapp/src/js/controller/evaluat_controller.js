angular.module('myApp').controller('evaluat_controller', function($rootScope, $scope, actcard_service, $interval, $state, common_service) {
	var timeStart = 30;
	$scope.timeStart = timeStart;
	var test = {};
	$scope.test = test;
	var bankCardIdTimer;
	var isDid = false;
	//控制流程
	$scope.num = 3;
	//开始做题评测
	$scope.one = 1;
	//选择答案以后才能跳转
	$scope.btnShow = false;
	//用户答案数组
	var answerChosen = [];
	$scope.answerChosen = answerChosen;
	var res = $rootScope.res.actcard_service;
	var timerfinish;
	var timefinish = 30;

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
				$scope.idNum = ret.idNumber;
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

						//check if this guy dis the test
						var userMsgFind = {};
						userMsgFind.idType = "02" //checked
						userMsgFind.idNo = ret.idNumber;
						
						common_service.post(res.judgeIsResult.url, userMsgFind).then(function(data) {
							if(data.retCode == 000000) { //did
								isDid = true;
								$scope.type = data.bsadata.riskType;
								$scope.typeVal = data.bsadata.riskTypeMsg;

							} else { // never do this test
								isDid = false;
							}
							var msg = JSON.parse(sessionStorage.getItem('msg'))
							var mock = msg.mock;
							var bankCardIdTime = 5;
							if(mock) {
								bankCardIdTimer = window.setInterval(function() {
									bankCardIdTime--;
									if(bankCardIdTime == 0) {
										if(isDid) {
											timefinish = 30;
											$scope.timeStart = timefinish;
											timerfinish = window.setInterval(function() {
												timefinish--;
												console.log(timefinish)
												$scope.timeStart = timefinish;
												if(timefinish == 0) {
													window.clearInterval(timerfinish);
													$state.go('dashboard');
												}
											}, 1000)
											$scope.num = 2;
										} else {
											$scope.num = 0;
										}
										window.clearInterval(bankCardIdTimer);
										window.clearInterval(timerStart);
									}
								}, 1000)
							} else {
								if(isDid) {
									timefinish = 30;
									$scope.timeStart = timefinish;
									timerfinish = window.setInterval(function() {
										timefinish--;
										console.log(timefinish)
										$scope.timeStart = timefinish;
										if(timefinish == 0) {
											window.clearInterval(timerfinish);
											$state.go('dashboard');
										}
									}, 1000)
									$scope.num = 2;
								} else {
									$scope.num = 0;
								}
								window.clearInterval(timerStart);
							}
						})

					}

				})

			});
		}
	})

	test.startTest = function() {
		common_service.post(res.queryTopic.url).then(function(data) {
				$scope.questions = data.bsadata.papers;
				console.log($scope.questions)
				$scope.allQuestion = data.bsadata.papers.length;
			})
			//	 $scope.allQuestion =  $scope.questions.length;	

		$scope.num = 1;
	}

	//选择答案时
	test.answer = function(o, i) {
			$('.inpu_' + o + '_' + i).prop("checked", true);
			$('.inpu_' + o + '_' + i).parent().siblings().children().removeAttr("checked");
			$scope.btnShow = true;

			var index = $scope.ques - 1;
			answerChosen[index] = {};
			var value = $('input:radio[name="as_' + index + '"]:checked').attr('value');
			var qsId = $('input:radio[name="as_' + index + '"]:checked').attr('idV');
			answerChosen[index].qsA = value;
			answerChosen[index].qsId = qsId;
			console.log(answerChosen)
		}
		//下一题
	$scope.ques = 1;
	test.nextQues = function() {
		if(answerChosen.length < $scope.ques) {
			$scope.noChioce = true;
			return;
		} else {
			$scope.noChioce = false;
			//			$scope.btnShow = false;
			$scope.ques++;
		}

		//		$scope.btnShow = false;
	}
	test.preQues = function() {
			$scope.ques--;
			$scope.noChioce = false;
			for(var i = 0; i < answerChosen.length; i++) {
				for(var j = 0; j < $scope.questions.length; j++) {
					if(answerChosen[i].qsId == $scope.questions[j].qsId) {
						for(var o = 0; o < $scope.questions[j].qsOptions.length; o++) {
							if(answerChosen[i].qsA == $scope.questions[j].qsOptions[o].qsKey) {

							}
						}
					}
				}

			}
		}
		//提交
	test.submit = function() {
		timefinish = 30;
		if(answerChosen.length != $scope.ques) {
			$scope.noChioce = true;
			return;
		} else {
			$scope.noChioce = false;
		}

		var ansObj = {};
		ansObj.grade = {};
		ansObj.grade = answerChosen;
		ansObj.idType = "02";
		ansObj.idNo = $scope.idNum;
		console.log(ansObj)
		common_service.post(res.resultGrade.url, ansObj).then(function(data) {
			console.log(data)
			$scope.type = data.bsadata.type;
			$scope.typeVal = data.bsadata.typeVal;
			
			timerfinish = window.setInterval(function() {
				timefinish--;
				console.log(timeStart)
				$scope.timeStart = timefinish;
				if(timefinish == 0) {
					$state.go('dashboard');
					window.clearInterval(timerfinish);
				}
			}, 1000)
			$scope.num = 2;
			
		})
	}

	//重测
	test.doAgain = function() {
		window.clearInterval(timerfinish);
		answerChosen = [];
		$scope.num = 0;
		$scope.ques = 1;
	}
	test.back = function() {
		if($scope.num != 0) {
			alert("此时离开将会失去评测进度")
		}
	}
	test.testBack = function() {
		window.clearInterval(bankCardIdTimer);
		window.clearInterval(timerStart);
		window.clearInterval(timerfinish);
		$state.go('dashboard');
	}
})