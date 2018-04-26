myApp.factory('common_service',['$http', '$q', function ($http,$q) {
    var service={};
    service.post = function (url, subFrom) {
        var res = $http.post('http://'+ipAdre+url,subFrom).then(function (response) {
            return response.data;
        });
        return res;
    };
    return service;
}]);