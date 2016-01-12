regApp.controller('SuccessController', ['$scope', 'JwtAuth', function ($scope, JwtAuth) {
    $scope.message = "Success! The token from local storage reads: " + JwtAuth.getToken();
}])