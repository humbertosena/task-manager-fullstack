/**
* Classe responsável pelas troca de informação com o back-end
* para realização de operações via API.
*
* Operações:
* - createTask: Cria uma nova tarefa;
* - salveTask: Salva um alteração em uma tarefa;
* - getTasks: Solicita as tarefas disponíveis;
* - unassignTask: Libera uma tarefa;
* - assgnTask: Bloqueia uma tarefa para um usuário;
* - completeTask: Marca como competada uma tarefa.
*
* @author Humberto Sena Santos
*/
window.app.service( 'TaskService', TaskService );

function TaskService( $http, ENVIRONMENT ) {
  'use strict';

  var service = {};

  service.createTask = createTask;
  service.salveTask = salveTask;
  service.getTasks = getTasks;
  service.unassignTask = unassignTask;
  service.assignTask = assignTask;
  service.completeTask = completeTask;

  return service;

  function createTask( task, success, error ) {
    var json_task = JSON.stringify( task );

    $http.post( ENVIRONMENT.UrlBaseTask + ENVIRONMENT.API_Task, json_task ).then( success, error );
  }

  function salveTask( id, task, success, error ) {
    var json_task = JSON.stringify( task );

    $http.put( ENVIRONMENT.UrlBaseTask + ENVIRONMENT.API_Task + '/' + id, json_task ).then( success, error );
  }

  function getTasks( success, error ) {
    $http.get( ENVIRONMENT.UrlBaseTask + ENVIRONMENT.API_Task + '/not-completed?page=0&size=100' ).then( success, error );
  }

  function unassignTask( id, username, success, error ) {
    //  /{id}/unassigned/{user}
    $http.put( ENVIRONMENT.UrlBaseTask + ENVIRONMENT.API_Task + '/' + id + '/unassigned/' + username ).then( success, error );
  }

  function assignTask( id, username, success, error ) {
    //  /{id}/assigned/{user}
    $http.put( ENVIRONMENT.UrlBaseTask + ENVIRONMENT.API_Task + '/' + id + '/assigned/' + username ).then( success, error );
  }

  function completeTask( id, username, success, error ) {
    // /{id}/completed/{user}
    $http.put(ENVIRONMENT.UrlBaseTask + ENVIRONMENT.API_Task + '/' + id + '/completed/' + username ).then( success, error );
  }

}
