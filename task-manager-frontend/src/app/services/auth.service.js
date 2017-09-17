/**
* Classe responsável pelas troca de informação com o back-end
* para realização de operações de autênticação via API.
*
* Operações:
* - authenticate: Solicita autênticação ao servidor back-end;
* - setCredentials: Registra as credenciais de autenticação;
* - clearCredentials: Remove as credenciais de autenticação.
*
* @author Humberto Sena Santos
*/
window.app.service( 'AuthService', AuthService );

function AuthService( $http, $rootScope, ENVIRONMENT ){
  'use strict';

  var service = {};

  service.authenticate = authenticate;
  service.setCredentials = setCredentials;
  service.clearCredentials = clearCredentials;

  return service;

  function authenticate( username, password, success, error ) {
    var login = { username: username, password: password  };
    $http.post( ENVIRONMENT.UrlBase + ENVIRONMENT.Auth, login ).then( success, error );
  }

  function setCredentials( currentUser ) {
    $rootScope.isAuthenticated = true;
    $rootScope.currentUser = currentUser.user[0];
  }

  function clearCredentials() {
    $rootScope.isAuthenticated = false;
    $rootScope.currentUser = null;
  }

}
