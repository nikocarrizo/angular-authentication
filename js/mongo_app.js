var regApp = angular.module('regApp',
    ['ngRoute', 'ngStorage', 'angular-jwt']).
    constant('AUTH_URL', 'http://localhost:3001/auth');

regApp.run(['$rootScope', '$location',
    function ($rootScope, $location) {
        $rootScope.$on('$routeChangeError',
            function (event, next, previous, error) {
                if (error == 'AUTH_REQUIRED') {
                    $rootScope.message = 'Sorry, you must log in to access that page';
                    $location.path('/login');
                } // AUTH REQUIRED
            }); //event info
    }]); //run
    
regApp.factory('JwtAuth', ['$window', '$localStorage',
    function ($window, $localStorage) {
        var refreshing = false;
        
        var jwtObject = {
            parseJwt: function (token) {
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace('-', '+').replace('_', '/');
                return JSON.parse($window.atob(base64));
            },
            saveToken: function (token) {
                $localStorage.jwtToken = token;
            },
            getToken: function () {
                return $localStorage.jwtToken;
            },
            isAuthed: function () {
                var token = self.getToken();
                if (token) {
                    var params = self.parseJwt(token);
                    return Math.round(new Date().getTime() / 1000) <= params.exp;
                } else {
                    return false;
                }
            },
            logout: function () {
                delete $localStorage.jwtToken;
            },
            isTokenExpired: function(token) {
                var date = jwtHelper.getTokenExpirationDate(token);
            }
        }
        return jwtObject;
    }
]);
        
//pass along dependencies for application routes
regApp.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $routeProvider.
        when('/login', {
            templateUrl: 'views/login.html',
            controller: 'RegistrationController'
        }).
        when('/register', {
            templateUrl: 'views/register.html',
            controller: 'RegistrationController'
        }).
        when('/success', {
            templateUrl: 'views/success.html',
            controller: 'SuccessController',
        }).
    //if somebody types in anything else, redirect to login
        otherwise({
            redirectTo: '/login'
        });
        
    //intercepts every http request made to the server and adds in the authenticion token from local storage
    $httpProvider.interceptors.push(['$q', '$location', 'JwtAuth', function ($q, $location, JwtAuth) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                if (JwtAuth.getToken() && !JwtAuth.refreshing){
                    //TO-DO: check if token is required and re-call authenticate to get a new token, set refreshing to true
                    //create with a promise and continue this call after. 
                    config.headers.Authorization = 'Bearer ' + JwtAuth.getToken();
                }
                return config;
            },
            'responseError': function (response) {
                if (response.status === 401 || response.status === 403) {
                    $location.path('/authenticate');
                }
                return $q.reject(response);
            }
        };
    }]);
}])
