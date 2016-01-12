var regApp = angular.module('regApp', 
    ['ngRoute', 'firebase']).
    constant('FIREBASE_URL', 'https://ngregister.firebaseio.com/');
    
 regApp.run(['$rootScope', '$location',
  function($rootScope, $location) {
    $rootScope.$on('$routeChangeError',
      function(event, next, previous, error) {
        if (error=='AUTH_REQUIRED') {
          $rootScope.message = 'Sorry, you must log in to access that page';
          $location.path('/login');
        } // AUTH REQUIRED
      }); //event info
  }]); //run

//pass along dependencies for application routes
regApp.config(['$routeProvider', function($routeProvider){
    $routeProvider.
        when('/login', {
            templateUrl: 'views/login.html',
            controller: 'RegistrationController'
        }).
        when ('/register', {
            templateUrl: 'views/register.html',
            controller: 'RegistrationController'
        }).
        when ('/success', {
            templateUrl: 'views/success.html',
            controller: 'SuccessController',
            resolve: {
                currentAuth: function(FirebaseAuthentication){
                    return FirebaseAuthentication.requireAuth();
                }
            }
        }).
        //if somebody types in anything else, redirect to login
        otherwise({
            redirectTo: '/login'
        });
}])
