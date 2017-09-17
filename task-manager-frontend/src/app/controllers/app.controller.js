/**
* Classe responsável pelo controle da página principal index.html.
*
* @author Humberto Sena Santos
*/
window.app.controller( 'appController', AppController );

window.AppController.$inject = ['$rootScope','$location','AuthService'];

function AppController( $scope, $location, AuthService ) {
  'use strict';

  $scope.logout = logout;

  function logout(){
    AuthService.clearCredentials();
    $location.path('/');
  }

}
