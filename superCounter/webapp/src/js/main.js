/* Metronic App */

var ipAdre = '139.196.145.67';   //公司使用ip
//var ipAdre = '192.168.43.30';   //调试产品图片ip

var myApp = angular.module("myApp", [
	"ui.router",
	'oc.lazyLoad',
	'ngAnimate',
	'ngTouch'
]);

//返回上一层
myApp.run(['$rootScope', '$http', function($rootScope, $http) {
	
	$rootScope.goBack = function() {
		history.back();
	};
	
	var res = $http.get('./json/service.json').then(function(response) {
		console.log(response)
		$rootScope.res = response.data; //绑定到rootscope中，在其他页面可以直接调用
		return response;
	})
	
}]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
myApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
	$ocLazyLoadProvider.config({
		// global configs go here
	});
}]);

/* 底部控制器 */
myApp.controller('FooterController', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {
	$scope.$on('$includeContentLoaded', function() {
		Layout.initFooter(); // init footer
	});
}]);

/* 页面路由 */
myApp.config(['$stateProvider', '$httpProvider', '$urlRouterProvider', function($stateProvider, $httpProvider, $urlRouterProvider) {
	// 无法找到的时候，默认跳转首页
	$urlRouterProvider.otherwise("/dashboard.html");
	$stateProvider
	// Dashboard
		.state('dashboard', {
			url: "/dashboard.html",
			templateUrl: "views/dashboard.html",
			data: {
				pageTitle: '控制台'
			},
			controller: "dash_controller"
		})
		.state('actcard', {
			url: "/actcard.html",
			templateUrl: "views/actcard/actcard.html",
			data: {
				pageTitle: '开卡流程'
			},
			controller: "actcard_controller",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
						files: [
							'./css/index.css',
						]
					});
				}]
			}
		})
		// cad -- 个人账户管理模块 --
		.state('countOwn', {
			url: "/countOwn.html",
			templateUrl: "views/countOwn/countOwn.html",
			data: {
				pageTitle: '个人账户管理'
			},
			controller: "countOwn_controller",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
						files: [
							'./css/countOwn.css',
						]
					});
				}]
			}
		})
		// cad -- 个人账户管理模块 --

	// cad -- 忘记密码 --
	.state('forgetPass', {
			url: "/forgetPass.html",
			templateUrl: "views/countOwn/forgetPass.html",
			data: {
				pageTitle: '忘记密码'
			},
			controller: "countOwn_controller",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before',
						files: [
							'./css/countOwn.css',
						]
					});
				}]
			}
		})
		// cad -- 忘记密码 --

	// cad -- 终端交互 --
	.state('func', {
			url: "/func.html",
			templateUrl: "views/func/func.html",
			data: {
				pageTitle: '功能'
			},
			controller: "func_controller",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'MetronicApp',
						insertBefore: '#ng_load_plugins_before',
						files: [
							'./css/func.css',
						]
					});
				}]
			}
		})
		// cad -- 终端交互 --

	// leo    -- 个人信息管理模块 --
	.state('userMsg', {
			url: "/usermsg.html",
			templateUrl: "views/userMsg/usermsg.html",
			data: {
				pageTitle: '个人信息管理'
			},
			controller: 'userMsg_controller',
			resolve: {}
		})
		// leo    -- 个人信息管理模块 --

	//  -- 风险评测 --
	.state('evaluating', {
		url: "/evaluat.html",
		templateUrl: "views/evaluat/evaluat.html",
		data: {
			pageTitle: '风险评估'
		},
		controller: 'evaluat_controller',
		resolve: {
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load({
					name: 'MetronicApp',
					insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
					files: [
						'./css/evaluat.css',
					]
				});
			}]

		}
	})
    
    // -- 手机银行 --
	.state('phoneBank', {
		url: "/phoneBank.html",
		templateUrl: "views/phoneBank/phoneBank.html",
		data: {
			pageTitle: '手机银行'
		},
		controller: 'phonebank_controller',
		resolve: {
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load({
					name: 'MetronicApp',
					insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
					files: [
						'./css/phoneBank.css',
					]
				});
			}]

		}
	})
	
	// leo -- 理财产品 -- 
	.state('manageMoney', {
		url: "/manageMoney.html",
		templateUrl: "views/manageMoney/manageMoney.html",
		data: {
			pageTitle: '理财产品'
		},
		controller: 'manageMoney_controller',
		resolve: {
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load({
					name: 'MetronicApp',
					insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
					files: [
						'./css/manageMoney.css',
					]
				});
			}]

		}
	})
	
	// leo -- 转账 -- 
	.state('saveMoney', {
		url: "/saveMoney.html",
		templateUrl: "views/saveMoney/saveMoney.html",
		data: {
			pageTitle: '转账'
		},
		controller: 'saveMoney_controller',
		resolve: {
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load({
					name: 'MetronicApp',
					insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
					files: [
						'./css/saveMoney.css',
					]
				});
			}]

		}
	})
}]);

myApp.directive('loading', function(){  
        return {  
            restrict: 'E',  
            transclude: true,  
           template: '<div ng-show="loading" class="loading" id="allDiv"  style="position:fixed; top:0px; left:0px; width:100%; height:100%; display:none; background-color:#000; opacity: 0.5; z-index:99999;">'  
            +'<img alt="" src="./images/111.svg" />'  
            +'</div>',  
            
            link: function (scope, element, attr) {  
                scope.$watch('loading', function (val) {  
                    if (val){  
                        document.getElementById("allDiv").style.display = "block";  
                    }else{  
                        document.getElementById("allDiv").style.display = 'none';  
  
                    }  
                });  
            }  
        }  
    }) 