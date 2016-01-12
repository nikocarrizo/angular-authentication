regApp.factory('MongoAuthentication', ['$rootScope', 'AUTH_URL', '$location', '$http', '$localStorage', 'JwtAuth',
    function ($rootScope, AUTH_URL, $location, $http, $localStorage, JwtAuth) {
        var authObject = {
            login: function (user) {
                var data = {
                    email: user.email,
                    password: user.password
                };
                $http.post(AUTH_URL + '/authenticate', data).
                    success(function (res) {
                        if (res.type == false) {
                            alert(res.data)
                        } else {
                            if (res.token !== undefined){
                                JwtAuth.saveToken(res.token);
                                $rootScope.currentUser = user;
                                $location.path('/success');
                            }
                            else{
                                $rootScope.message = res.message;
                            }
                        }
                    }).
                    error(function (error) {
                        $rootScope.error = "Failed to Login";
                    });
                $rootScope.message = "Welcome " + user.email;
            },
            logout: function () {
                JwtAuth.logout();
                $rootScope.currentUser = null;
                $rootScope.message = "Successfully logged out.";
                $location.path('/login');
            },
            register: function (user) {
                var data = {
                    email: user.email,
                    password: user.password
                };
                $http.post(AUTH_URL + '/register', data).
                    success(function (res) {
                        if (res.type == false) {
                            alert(res.data)
                        } else {
                            authObject.login();
                        }
                    }).
                    error(function (error) {
                        $rootScope.error = "Failed to Register";
                    });

            } //register
        }
        return authObject;
    }
])


