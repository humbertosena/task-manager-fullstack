describe('Login Suite', function() {

  var _httpBackend_,
      _authRequestHandler_,
      _toaster_;

  var respondLogin = {
      'user':[ { 'username':'desafio', 'name':'FullStack 01'} ],
      'token':'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI0MWQ5NDIwMy1kNzMyLTQwMGItYTkzYy1kOTE1NjRlYWUyZDIiLCJzdWIiOiJkZXNhZmlvIiwidXNlcm5hbWUiOiJkZXNhZmlvIiwiaWF0IjoxNTA1NTg0MzIwLCJleHAiOjE1MDU2NzA3MjB9.o6nRLwDSzMvFlbjQXqw1jJQUAMtnRhQV13zQt6HvEIf7EURBtEMSQFdwcFyM-K2VjTpkIfPGk1weQKiQ2SYFrA' };

  beforeEach(function () {
    angular.mock.module('TaskManeger_App', function( $provide ) {
      $provide.constant('ENVIRONMENT', {
          'UrlBase': '',
          'Auth': '/api/v1/auth',
          'UrlBaseTask': '',
          'API_Task': '/api/v1/tasks'
      });
    });
    
    angular.mock.module('toaster');

    angular.mock.inject( function ($httpBackend, $controller, $rootScope, $location, toaster, AuthService) {
      $scope = $rootScope.$new();
      $location = $location;
      _httpBackend_ = $httpBackend;
      _toaster_ = toaster;

      spyOn( _toaster_, 'warning' );
      spyOn( _toaster_, 'error' );

      _authRequestHandler_ = _httpBackend_.when( 'POST', '/api/v1/auth' ).respond( 200, respondLogin );

      $controller( 'loginController', {
        $scope : $scope,
        $location : $location,
        toaster : toaster,
        AuthService : AuthService
      });

    });

  });

  afterEach( function() {
    _httpBackend_.verifyNoOutstandingExpectation();
    _httpBackend_.verifyNoOutstandingRequest();
  });

  it ( 'Busca a credencial do usuário', function() {
    _httpBackend_.expectPOST( '/api/v1/auth' );
    $scope.validLogin( 'desafio', '123' );
    _httpBackend_.flush();

    expect($scope.isAuthenticated).toBe(true);
    expect($scope.currentUser).toEqual({ 'username':'desafio', 'name':'FullStack 01'});

  });

  it ( 'Informa que o usuário não tem autorização', function () {
    _authRequestHandler_.respond(401, '');

    _httpBackend_.expectPOST( '/api/v1/auth' );
    $scope.validLogin( 'desafio', '1234' );
    _httpBackend_.flush();

    expect(_toaster_.warning).toHaveBeenCalledWith('ATENÇÃO', 'Usuário ou senha inválido.');

  });

  it ( 'Informa que erro de comunicação com o servidor ou recusa de comunicação', function () {
    _authRequestHandler_.respond(415, '');

    _httpBackend_.expectPOST( '/api/v1/auth' );
    $scope.validLogin( 'desafio', '123' );
    _httpBackend_.flush();

    expect(_toaster_.error).toHaveBeenCalledWith('Erro na tentativa de login.' +
                   'Tente mais tarde, se o problema persistir entre em contato com o suporte');

  });

});
