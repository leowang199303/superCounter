angular.module('myApp').controller('manageMoney_controller', function($rootScope,$scope, actcard_service, $interval, $state, common_service) {
	$(document).ready(function() {
		//page controll
		var productAll = [];
		$scope.mangePage = 0;
		$scope.bankCardNum = false;
		$scope.buyMoey = false;
		$scope.isTrue = false;
		$scope.isDisabled = true;
		//isDid the test 
		var isDid = false;
		$scope.isSelectedOne = true;
		$scope.productMsgTips = false;
		//the obj of function
		mangePageObj = {};
		$scope.mangePageObj = mangePageObj;

		//the service of some msg that must be need
		var res = $rootScope.res.actcard_service;
		console.log(res)
			// read the ID card Timer(mock)
		var readIdCardMockTimer;
		var findTimer;

		// read the ID card Timer
		var readIdCardTime = 30;
		$scope.timeStart = readIdCardTime;
		var readIdCardTimer = window.setInterval(function() {
			readIdCardTime--;
			$scope.timeStart = readIdCardTime;
			console.log(readIdCardTime)
			if(readIdCardTime == 0) {
				window.clearInterval(readIdCardTimer);
				$state.go('dashboard');
			}
		}, 1000)

		// the function taht can back to the dashboard.html
		// and clean the timer
		mangePageObj.clean = function() {
			window.clearInterval(readIdCardMockTimer)
			window.clearInterval(readIdCardTimer);
			window.clearInterval(readBankCardTimer);
			window.clearInterval(bankCardIdTimer);
			window.clearInterval( manageMoneyEndTimer);
			$state.go('dashboard');
		}

		// read The ID card
		TSSDeviceTools.initDevice().then(function(data) {
			if(data) {
				TSSDeviceTools.idReaderRead(3, 1).then(function(ret) {
					$scope.IDNO = ret.idNumber;
					// check this guy isBlack on the net 
					var subFrom = {};
					subFrom.vcherType = "101"; //超哥定义的 不知道为什么
					subFrom.vcherNo = ret.idNumber; //idc.vcherNo 页面输入的身份证内容
					subFrom.name = ret.name; //页面输入的名称
					subFrom.phFlag = "1";
					subFrom.tellerNo = "900001005";
					subFrom.branchId = "900001"; //这三个写死
					common_service.post(res.singleCheck.url, subFrom).then(function(data) {
						console.log(data)
						if(data.retCode == "TDCMCT08006") { //black
							alert(data.retMsg);
							console.log(data.retMsg);
							return;
						} else { //no black
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
										//check this guy isdid the test
									var userMsgFind = {};
									userMsgFind.idType = "02" //checked
									userMsgFind.idNo = ret.idNumber;
									common_service.post(res.judgeIsResult.url, userMsgFind).then(function(d) {
										console.log(d)
										if(d.retCode == 000000) { //did
											isDid = true;
											$scope.type = d.bsadata.riskType;
											$scope.typeVal = d.bsadata.riskTypeMsg;
										} else { // never do this test
											isDid = false;
										}

										//check the mock
										var msg = JSON.parse(sessionStorage.getItem('msg'))
										var mock = msg.mock;
										var readIdCardMockTime = 3;
										if(mock) {
											//this soft runs on own cumputor
											readIdCardMockTimer = window.setInterval(function() {
												readIdCardMockTime--;
												console.log(readIdCardMockTime)
												if(readIdCardMockTime == 0) {
													if(isDid) {
														$scope.mangePage = 1;
													} else {
														$scope.mangePage = 2;
													}

													window.clearInterval(readIdCardMockTimer);
													window.clearInterval(readIdCardTimer);
												}
											}, 1000)

										} else {
											// runs on the real enverniment
											if(isDid) {
												$scope.mangePage = 1;
											} else {
												$scope.mangePage = 2;
											}
											window.clearInterval(readIdCardTimer);
										}
									})

								} else {
									alert("获取流水服务号失败")
									return;
								}
							})

						}
					})

				})
			}
		})

		//the function that start test
		mangePageObj.startDoTest = function() {
			$state.go("evaluating")
		}

		//the function of product list
		mangePageObj.starProduct = function() {
			var manageMoneyProListObj = {};
			manageMoneyProListObj.BDY = {};
			manageMoneyProListObj.BDY.idNo = $scope.IDNO;
			manageMoneyProListObj.BDY.idType = "02"
			common_service.post(res.RecommendMatProduct.url, manageMoneyProListObj).then(function(data) {
				console.log(data);
				if(data.bsadata.RSD.retCode == 000000) {
					$scope.productFirst = JSON.parse(data.bsadata.RSD.product);
					console.log($scope.productFirst)
					swichOff = window.setInterval(function() {
						var displayCSS = $('.manage-product-list-all').css("display");
						console.log(displayCSS)
						if(displayCSS == 'block') {
							$('#myCarousel').carousel({
								wrap: true,
								interval: 5000
							});
							window.clearInterval(swichOff)
						}
					}, 100);
					
					var emptyObj = {};
					emptyObj.BDY = {};
					common_service.post(res.QueryFinanceProductAll.url, emptyObj).then(function(result){
						console.log(result)
						$scope.allProduct = JSON.parse(result.bsadata.RSD.product);
						console.log($scope.allProduct)
						var findObj = {};
					    findObj.BDY = {};
					    common_service.post(res.FiltrateConditionShow.url, findObj).then(function(data){
					    	console.log(data)
					    	if(data.bsadata.RSD.retCode == 000000){
					    		
					    		$scope.selectType  = JSON.parse(data.bsadata.RSD.selectFinance)
					    		console.log($scope.selectType);
		
					    		$scope.mangePage = 3;
					    	}else{
					    		alert("获取筛选条件失败");
					    		return
					    	}
					    })
						
					})					

				}

			})

		}
        
        //reset conditions
        mangePageObj.reset = function(){
        	if($("select[class^='select_']").find("option:first").attr("selected")){
        		$("select[class^='select_']").find("option:first").attr("selected",false);
        		$("select[class^='select_']").find("option:first").attr("selected",true);
        	}else{
        		$("select[class^='select_']").find("option:first").attr("selected",true);
        	}
        	
        	$scope.forShow = [];
        	productAll = [];
        	$scope.productMsgTips = false;
        	var emptyObj = {};
				emptyObj.BDY = {};
				common_service.post(res.QueryFinanceProductAll.url, emptyObj).then(function(result){
					console.log(result)
					$scope.allProduct = JSON.parse(result.bsadata.RSD.product);
				})
        }
        
        
        //chose condition
        //productAll
        
        mangePageObj.chosecondition = function(a){
        	var forShow = [];
        	$scope.forShow = forShow;        	        	
        	var selectedVal = $(a).val();
        	var selectedName = $(a).find("option:first").val();
        	
        	var optionId = $(a).find("option:selected").attr("optionid");
        	 
        
		        	
        	if(productAll.length != 0){
        		var selectedObj = {};
        		for (var i = 0; i < productAll.length; i++) {
        			 
        			if( selectedName == productAll[i].selectName){
        				
        				if(optionId == "no"){
        					productAll.splice(i,1);
        					
        				}else{        					        					
        					productAll[i].selectOption.optionValue =  selectedVal;
        					productAll[i].selectOption.optionId = optionId;
        					console.log(productAll)
        				}
        				       				
        			}else{
        			 
        				if(i ==  productAll.length-1){
        					 
           					selectedObj.selectName = selectedName;
           					selectedObj.selectOption = {};
           					selectedObj.selectOption.optionId = optionId;
           					selectedObj.selectOption.optionValue = selectedVal;
          					productAll.push(selectedObj);
          			    	console.log(productAll)
          			    	
        				}
        				
          			    
        			}
        		}
        	}else{
        		var selectedObj = {};
           		selectedObj.selectName = selectedName;
				selectedObj.selectOption = {};
				selectedObj.selectOption.optionId = optionId;
				selectedObj.selectOption.optionValue = selectedVal;
				if(optionId != "no"){
					productAll.push(selectedObj);
				};
          		
        	}
           	
          
            console.log(productAll)
  			for (var i = 0; i < productAll.length; i++) {     
  				if(forShow.length == 0){
  					forShow.push(productAll[i].selectOption.optionValue)
  				}else{
  					if(forShow.indexOf(productAll[i].selectOption.optionValue)<0){
  						forShow.push(productAll[i].selectOption.optionValue)
  					}
  				}
   				 						   				
  			}
  			
   		    console.log(forShow)

           var getProductObj = {};
			getProductObj.BDY = {};
			getProductObj.BDY.selectFinance =  productAll;
			common_service.post(res.QueryFiltrateFinanceProduct.url, getProductObj).then(function(data){
				console.log(data)

				if(data.bsadata.RSD.retCode == 000000){
					console.log("进来了")
					$scope.allProduct =JSON.parse( data.bsadata.RSD.products);
					
					if( $scope.allProduct.length == 0){
						$scope.productMsg = "没有符合条件的产品";
						$scope.productMsgTips = true;
					}else{
						$scope.productMsgTips = false;
					}
				}
			})
        }
        
        //get the product that we want
        mangePageObj.productWant = function(){
        	
        	var getProductObj = {};
			getProductObj.BDY = {};
			getProductObj.BDY.selectFinance =  productAll;
			common_service.post(res.QueryFiltrateFinanceProduct.url, getProductObj).then(function(data){
				console.log(data)
				if(data.bsadata.RSD.retCode == 000000){
					$scope.allProduct =JSON.parse( data.bsadata.RSD.products);
					if( $scope.allProduct.length == 0){
						$scope.productMsg = "没有符合条件的产品";
						$scope.productMsgTips = true;
					}else{
						$scope.productMsgTips = false;
					}
				}
			})
        }
        
		mangePageObj.detail = function(productDetail) {
			console.log(productDetail);
			$scope.product = productDetail.p;
			console.log($scope.product)
			$scope.attention = $scope.product.attention;
			$scope.productDetailName = $scope.product.productName;
			$scope.productCode = $scope.product.productCode;
			$scope.detailEarnings = $scope.product.earnings;
			$scope.detailBeginSellMoney = $scope.product.beginSellMoney;
			$scope.detailProductDate = $scope.product.productDate;
			$scope.detailProRaiseBeginDate = $scope.product.proRaiseBeginDate;
			$scope.detailProRaiseEndDate = $scope.product.proRaiseEndDate;
			$scope.detailIsBreakEven = $scope.product.isBreakEven;
			$scope.detailIsRansom = $scope.product.isRansom;
			$scope.detailCurrency = $scope.product.currency;
			$scope.detailRiskLevel = $scope.product.riskLevel;
			$scope.detailIssueArea = $scope.product.issueArea;
			$scope.detailproRaiseBeginDate  = $scope.product.proRaiseBeginDate
			$scope.detailproRaiseEndDate  = $scope.product.proRaiseEndDate
			$scope.detailproSetupDate  = $scope.product.proSetupDate;
			$scope.detailproExpireDate  = $scope.product.proExpireDate;
			$scope.mangePage = 4;
		}

		mangePageObj.backCardK = function() {
			$scope.mangePage = 3;
		}

		mangePageObj.threeList = function(a) {
			if(a == 1) {
				$scope.isSelectedOne = true;
			} else {
				$scope.isSelectedOne = false;
			}

			if(a == 2) {
				$scope.isSelectedTwo = true;
			} else {
				$scope.isSelectedTwo = false;
			}

			if(a == 3) {
				$scope.isSelectedThree = true;
			} else {
				$scope.isSelectedThree = false;
			}
		}

		mangePageObj.productBuy = function() {
			$scope.mangePage = 5;
		}
		mangePageObj.backCardF = function() {
				$scope.mangePage = 4;
			}
			//agree the tips of bank
		mangePageObj.agreeXie = function(w) {
			if($scope.mangePageObj.checkValu) { //checked
				$scope.isTrue = true;
				$scope.isDisabled = false;
			} else {
				$scope.isTrue = false;
				$scope.isDisabled = true;
			}
		}
		mangePageObj.backCardM = function() {
			$scope.mangePage = 5;
		}

		mangePageObj.finishMsg = function() {

			if($scope.mangePageObj.bankCardNum == undefined) {
				$scope.bankCardNum = true;
				$scope.bankCardNumText = "银行卡号不能为空"
				return;
			} else {
				$scope.bankCardNum = false;
			}

			if($scope.mangePageObj.buyMoey == undefined) {
				$scope.buyMoey = true;
				$scope.buyMoeyText = "请输入购买金额";
				return;
			} else {
				$scope.buyMoey = false;
			}

			if($scope.mangePageObj.buyMoey * 1 < parseInt($scope.detailBeginSellMoney)) {
				$scope.buyMoey = true;
				$scope.buyMoeyText = "不能低于" + $scope.detailBeginSellMoney;
				return;
			} else {
				$scope.buyMoey = false;
			}

			$scope.mangePage = 6;

		}

		var bankCardIdTimer;
		var readBankCardTimer
		mangePageObj.makeSureBuy = function() {
			//开始读取银行卡
			$scope.mangePage = 7;
			//银行卡计时器
			var readBankCardTime = 30;
			$scope.timeStart = readBankCardTime;
			readBankCardTimer = window.setInterval(function() {
					readBankCardTime--;
					$scope.timeStart = readBankCardTime;
					console.log(readBankCardTime)
					if(readBankCardTime == 0) {
						window.clearInterval(readBankCardTimer);
						$scope.mangePage = 5;
					}
				}, 1000)
				//开始查询银行卡      	
			TSSDeviceTools.initDevice().then(function(data) {
				if(data) {
					TSSDeviceTools.icReaderRead(2, 1).then(function(ret) { //银行卡读取信息					
						$scope.cardBankNum = ret.cardNo
							// find the msg of bank card
						var bankCardObj = {};
						bankCardObj.BDY = {};
						bankCardObj.BDY.cardNo = ret.cardNo;

						common_service.post(res.QueryCardInfo.url, bankCardObj).then(function(data) {
							console.log(data)
							if(data.bsadata.RSD.retCode != 000000) {
								alert(data.bsadata.RSD.retMsg);
								return;
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
								console.log(data)
								$scope.transSerialNo = data.bsadata.serialNoList;
								console.log($scope.transSerialNo)
							})

							var jsString = data.bsadata.RSD;
							$scope.trcmCardInstCode = jsString.openOrg;
							$scope.count = jsString.balance;
							var msg = JSON.parse(sessionStorage.getItem('msg'))
							var mock = msg.mock;
							var bankCardIdTime = 5;
							if(mock) { //模拟数据
								bankCardIdTimer = window.setInterval(function() {
									bankCardIdTime--;
									console.log(bankCardIdTime)
									if(bankCardIdTime == 0) {
										window.clearInterval(bankCardIdTimer);
										window.clearInterval(readBankCardTimer);
										$scope.mangePage = 8;
									}
								}, 1000)
								$scope.bankCardNum = ret.cardNo;
							} else {
								$scope.bankCardNum = ret.cardNo;
								window.clearInterval(readBankCardTimer);
								$scope.mangePage = 8;

							}
						})
					})
				}
			})

		}

		mangePageObj.checkPwdIsright = function() {
			if($scope.mangePageObj.cardPwd == undefined) {
				$scope.isPwd = true;
				$scope.errorMsg = "请输入密码";
				return;
			} else {
				$scope.isPwd = false;
				var passwordCheck = {};
				passwordCheck.BDY = {};
				passwordCheck.BDY.cardNo = $scope.bankCardNum;;
				passwordCheck.BDY.passWord = $scope.mangePageObj.cardPwd;
				common_service.post(res.CardPassWordVerify.url, passwordCheck).then(function(result) {
					if(result.bsadata.RSD.retCode == 000000) {
						var subFrom = res.DealObj;
						var productBuyObj = subFrom;
						productBuyObj.BDY = {};
						var now = new Date().Format("yyyy-MM-dd hh:mm:ss");
						subFrom.BDY.idNo = $scope.IDNO;
						subFrom.BDY.idType = "02";
						subFrom.BDY.productNo = $scope.productCode;
						subFrom.BDY.buyMoney = $scope.mangePageObj.buyMoey;
						subFrom.BDY.cardNo = $scope.cardBankNum

						productBuyObj.COH.TRANSSTARTTIME = now;
						productBuyObj.COH.TRANSDATE = now;
						productBuyObj.COH.TRANSSERIALNO = $scope.transSerialNo.toString(); //交易流水号
						productBuyObj.COH.SERVICESERIALNO = serviceNoa;
						productBuyObj.COH.TRANSTIME = now;
						productBuyObj.COH.TRANSCODE = 'TX600116';
						common_service.post(res.TX600116.url, productBuyObj).then(function(data) {
							console.log(data)
							if(data.retCode == 000000){
								$scope.finishMsg = data.retMsg;
								$scope.mangePage = 9;
								
								var manageMoneyEndTime = 30;
								$scope.timeStart =  manageMoneyEndTime;
								 manageMoneyEndTimer = window.setInterval(function() {
									 manageMoneyEndTime--;
									$scope.timeStart =  manageMoneyEndTime;
									console.log( manageMoneyEndTime);
									if( manageMoneyEndTime == 0) {
										window.clearInterval( manageMoneyEndTimer);
										$state.go('dashboard');
									}
								}, 1000)
								
								
								
								
								
								
							}else{
								alert(data.retMsg);
								return;
							}
						})
                      
						
					} else {
						$scope.isPwd = true;
						$scope.errorMsg = "密码错误";
						return;
					}
				})
			}
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
	});

})