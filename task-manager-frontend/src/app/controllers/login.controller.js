/**
* Classe responsável pelo controle da página de login.view.html e
* o serviço de autênticação via API.
*
* @author Humberto Sena Santos
*/
window.app.controller( 'loginController' , LoginController );

function LoginController( $scope, $location, toaster, AuthService ) {
  'use strict';

  $scope.validLogin = validLogin;

  initialization();

  function initialization() {
    //TODO
  }

  function validLogin( usuario, senha ){
    AuthService.authenticate(usuario,senha,authenticateSuccess,authenticateError);
  }

  function authenticateSuccess( response ){
    if ( response.status != 200 ) {
      $scope.user.userName = '';
      $scope.user.password = '';

      toaster.error( 'O usuário ou senha infomado não corresponde a um usuário valido!', 'Erro ao efetuar login...' );
      return;
    } else {
      AuthService.setCredentials( response.data );
      $location.path('/tasks');
    }
  }

  function authenticateError( response ){
    if ( response.status == 401 ) {
      toaster.warning( 'ATENÇÃO', 'Usuário ou senha inválido.' );
    } else {
      toaster.error( 'Erro na tentativa de login.' +
                     'Tente mais tarde, se o problema persistir entre em contato com o suporte' );
    }
  }

}
