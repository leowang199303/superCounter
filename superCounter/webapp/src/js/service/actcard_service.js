myApp.factory('actcard_service',['$http',  function ($http) {
    var service={};

    service.queryCard = function (subFrom) {
        var res = $http.post("http://139.196.145.67:9001/padServer/OnlineCheckServer/queryCard",subFrom).then(function (response) {
            return response.data;
        });
        return res;
    }
    service.singleCheck = function (subFrom) {
        var res = $http.post("http://139.196.145.67:9001/padServer/OnlineCheckServer/singleCheck",subFrom).then(function (response) {
            return response.data;
        });
        return res;
    }
    service.queryProduct = function (subFrom) {
        var res = $http.post("http://139.196.145.67:9001/padServer/OnlineCheckServer/queryProduct",subFrom).then(function (response) {
            return response.data;
        });
        return res;
    }
    
    return service;
}]);