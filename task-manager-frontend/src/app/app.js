/**
* SPA (Single Page Application)
* Este é o principal arquivo da aplicação TaskManager
*
* @author Humberto Sena Santos
*
**/
(function(window) {
  'use strict';

  window.app = window.angular.module('TaskManeger_App', [ 'ngRoute', 'toaster' ] );

  app.config(RouteConfig);

  RouteConfig.$inject = [ '$routeProvider', '$locationProvider', '$httpProvider' ];

  function RouteConfig(  $routeProvider, $locationProvider, $httpProvider, $location ) {

  $locationProvider.html5Mode( {
    enabled     : true,
    requireBase : false,
    hashPrefix  : ''
  });

  $routeProvider.caseInsensitiveMatch = true;

  $routeProvider
      .when( '/'         , {
        templateUrl : 'app/views/welcome.html'
      }).when( '/login'  , {
        templateUrl : 'app/views/login.view.html',
        controller  : 'loginController'
      }).when( '/tasks'  , {
        templateUrl : 'app/views/tasks.view.html',
        controller  : 'taskController'
      }).otherwise( { redirectTo: '/' } );
  }

})(window);
