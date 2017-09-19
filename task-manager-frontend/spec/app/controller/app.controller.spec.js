describe('Application Suite', function() {

  beforeEach(function () {
    angular.mock.module('TaskManeger_App', function($provide) {
      $provide.constant('ENVIRONMENT', {
          'UrlBase': '',
          'Auth': '/api/v1/auth',
          'UrlBaseTask': '',
          'API_Task': '/api/v1/tasks'
      });
    });

    angular.mock.inject( function ($controller, $rootScope, $location, AuthService) {
      $scope = $rootScope.$new();
      $location = $location;

      $controller('appController', {
        $scope : $scope,
        $location : $location,
        AuthService : AuthService
      });

      AuthService.setCredentials({'user':[ { 'username':'desafio', 'name':'FullStack 01'} ]});
    });

  });

  it ( 'Realiza logout', function () {
    $scope.logout();

    expect($scope.isAuthenticated).toBe(false);
    expect($scope.currentUser).toBe(null);

  });

});
