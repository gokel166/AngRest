var myApp = angular.module('myApp', ['ngRoute']);

//config routing
myApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            redirectTo : '/home'
        })
        .when('/home', {
            templateUrl: '/template/home/html',
            controller: 'homeController'
        })
        .when('/authenticated', {
            templateUrl: '/template/authenticate.html',
            controller: 'authenticateController'
        })
        .when('/authorized', {
            templateUrl: '/template/authorize.html',
            controller: 'authorizeController'
        })
        .when('/login', {
            templateUrl: '/template/login.html',
            controller: 'loginController'
        })
        .when('/unauthorized', {
            templateUrl: '/template/unauthorize.html',
            controller: 'unauthorizeController'
        })
}])
//global variable for store service base path
myApp.constant('serviceBasePath', 'http://localhost:60010/');
//controllers
myApp.controller('homeController', ['$scope', 'dataService', function ($scope, dataService) {
    //Fetch
    $scope.data = '';
    dataService.GetAnonymousData().then(function (data) {
        $scope.data = data;
    })
}])

myApp.controller('authenticateController', ['$scope', 'dataService', function ($scope, dataService) {
    //Fetch
    $scope.data = "";
    dataService.GetAuthenticateData().then(function ($scope, dataService) {
        $scope.data = data;
    })
}])

myApp.controller('loginController', ['$scope', 'dataService', function ($scope, dataService) {
    //Fetch
}])

myApp.controller('unauthorizeController', ['$scope', 'dataService', function ($scope, dataService) {
    //Fetch
}])
//services
myApp.factory('dataService', ['$http', 'serviceBasePath', function ($http, serviceBasePath) {
    var fac = {};
    fac.GetAnonymousData = function () {
        return $http.get(serviceBasePath + '/api/data/forall').then(function (response) {
            return response.data;
        })
    }

    fac.GetAuthenticateData = function () {
        return $http.get(serviceBasePath + '/api/data/authenticate').then(function (response) {
            return response.data;
        })
    }

    fac.GetAuthorizeData = function () {
        return $http.get(serviceBasePath + '/api/data/authorize').then(function (response) {
            return response.data;
        })
    }
    return fac;
}])

myApp.factory('userSeervice', function () {
    var fac = {};
    fac.CurrentUser = null;
    fac.SetCurrentUser = function (user) {
        fac.CurrentUser = user;
        sessionStorage.user = angular.toJson(user);
    }
    fac.GetCurrentUser = function () {
        fac.CurrentUser = angular.fromJson(sessionStorage.user);
        return fac.CurrentUser;
    }
    return fac;
})

myApp.factory('accountService', ['$http', '$q', 'serviceBasePath', function ($http, $q, serviceBasePath) {
    var fac = {};
    fac.login = function (user) {
        var obj = { 'username': user.username, 'password': user.password, 'grant-type': 'password' };
        Object.toparams = function ObjectToParams(obj) {
            var p = [];
            for (var key in obj) {
                p.push(key + '=' + encodeURIComponent(obj[key]));
            }
            return p.join('&');
        }

        var defer = $q.defer();
        $http({
            method: 'post',
            url: serviceBasePath + "/token",
            data: ObjectToParams(obj),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            defer.resolve(response.data);
            }, function (error) {
                defer.reject(error.data);
            })

        return defer.promise;
    }
}])
//http interceptor