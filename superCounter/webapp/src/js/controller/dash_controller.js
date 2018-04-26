angular.module('myApp').controller('dash_controller', function($rootScope,$scope, actcard_service, $interval, $state, common_service) {
	$scope.loading = true;
	$(document).ready(function() {
	//获取轮播图
	var res = $rootScope.res.actcard_service;
	//轮播图	
	var imgUrlObj = {};
	imgUrlObj.BDY = {};
	var openCardIdCheck;
	common_service.post(res.HomeCarouselPicture.url, imgUrlObj).then(function(data) {
		console.log(data)
		if(data.bsadata.RSD.retCode == 000000) {
			$scope.carousell = JSON.parse(data.bsadata.RSD.carousel);
			console.log($scope.carousell)				
		}		
	})
		
    //获取功能模块
    var funcObj = {};
	funcObj.BDY = {};
	common_service.post(res.HomeServiceFunc.url, funcObj).then(function(data) {
		console.log(data)
		if(data.bsadata.RSD.retCode == 000000) {
		   	$scope.func =JSON.parse(data.bsadata.RSD.func);
		   	console.log($scope.func)
		}		
	})

	 
	
	
	
	
	
	
	
	var funcObj = {};
		funcObj.BDY = {};
		common_service.post(res.HomeServiceFunc.url, funcObj).then(function(result) {
			console.log(result)
		})

	$scope.card3repeat = [{
		src: './images/ka.png',
		'text': '我要开卡'
	}, {
		src: './images/qian.png',
		'text': '个人账户管理'
	}, {
		src: './images/li.png',
		'text': '个人信息管理'
	}, {
		src: './images/cx.png',
		'text': '转账'
	}, {
		src: './images/func.png',
		'text': '测试功能'
	}, {
		src: './images/dayin.png',
		'text': '测试打印'
	}, {
		src: './images/ka.png',
		'text': '测试大图标'
	}]

	//页面跳转路由
	$scope.cardtop = function(i) {
		$scope.fabricIsSelected = i;
		$scope.fabricIs2Selected = 1000;

		switch(i) {
			case 0:
				$state.go("actcard");
				break;
			case 1:
				$state.go("countOwn");
				break;
			case 2:
				$state.go('userMsg');
				break;
			case 3:
				$state.go('saveMoney');
				break;
			case 4:
				$state.go("evaluating");
				break;
			case 5:
				$state.go("phoneBank");
				break;	
			case 6:
				$state.go("manageMoney");
				break;	
			case 10:
				$state.go("func");
				break;
			default:
				$state.go("dashboard");
		}

	}

	//底部第一屏内容循环
	$scope.cardbuttonrepeat = [{
		src: './images/func.png',
		'text': '功能'
	}, {
		src: './images/cx.png',
		'text': '风险评测'
	}, {
		src: './images/webapp.png',
		'text': '手机银行'
	}, {
		src: './images/dayin.png',
		'text': '理财产品'
	}, {
		src: './images/li.png',
		'text': '测试理财'
	}, {
		src: './images/ka.png',
		'text': '测试开卡'
	}, {
		src: './images/qian.png',
		'text': '测试签约'
	}, {
		src: './images/dayin.png',
		'text': '打印流水'
	}]

	//底部内容点击事件
	$scope.cardbutton = function(i) {
		$scope.fabricIs2Selected = i;
		$scope.fabricIsSelected = 1000;
		// alert(i)
		console.log(i)
			// cad --底部导航功能--
		switch(i) {
			
			
			
			
			default:
				$state.go("dashboard");
		}

	}

	var options = {
		year: "numeric",
		month: "short",
		day: "numeric",
		weekday: "long"
	};
	//初始化时间
	$scope.theTime = new Date().toLocaleTimeString("kh-MR", options);

	$interval(function() {
		$scope.theTime = new Date().toLocaleTimeString("kh-MR", options); //类似js中的setInterval()函数，每1秒重新调用当前时间
	}, 1000);

	//判断获取模拟数据还是外设读取卡片数据
	var res = $rootScope.res.actcard_service;
	var mockT = res.mock.tang;
	var idCardT = res.idCard;
	var bankcardT = res.cardNumber;
	var msg = {
		mock: mockT,
		idCard: idCardT,
		bankcard: bankcardT
	}
	sessionStorage.setItem("msg", JSON.stringify(msg));
	TSSDeviceTools.initDevice(); //接口调用初始化
	})
	
	


})