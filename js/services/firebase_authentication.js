regApp.factory('FirebaseAuthentication', ['$rootScope', '$firebaseAuth', 'FIREBASE_URL', '$location', '$firebaseObject',
    function ($rootScope, $firebaseAuth, FIREBASE_URL, $location, $firebaseObject) {
        var ref = new Firebase(FIREBASE_URL);
        var auth = new $firebaseAuth(ref);

        auth.$onAuth(function (authUser) {
            if (authUser) {
                var userRef = new Firebase(FIREBASE_URL + 'users/' + authUser.uid);
                var userObj = $firebaseObject(userRef);
                $rootScope.currentUser = userObj;
            } else {
                $rootScope.currentUser = '';
            }
        });

        var authObject =  {
            login: function (user) {
                auth.$authWithPassword({
                    email: user.email,
                    password: user.password
                }).then(function () {
                    $location.path('/success');
                }).catch(function (error) {
                    $rootScope.message = error.message;
                });
                $rootScope.message = "Welcome " + user.email;
            },
            logout: function(){
              return auth.$unauth();  
            },
            requireAuth: function(){
                return auth.$requireAuth();
            },
            register: function (user) {
                auth.$createUser({
                    email: user.email,
                    password: user.password
                }).then(function (regUser) {
                    var regRef = new Firebase(FIREBASE_URL + 'users')
                        .child(regUser.uid).set({
                            date: Firebase.ServerValue.TIMESTAMP,
                            regUser: regUser.uid,
                            firstname: user.firstName,
                            lastname: user.lastName,
                            email: user.email
                        });//
                    authObject.login(user);
                }).catch(function (e) {
                    $rootScope.message = e.message;
                });//create user
            } //register
        }
        return authObject;
    }
])


