/**
* Classe responsável pelo controle da página de task.view.html e
* o serviço de gerenciamento de tarefas via API.
*/
window.app.controller( 'taskController', TaskController );

function TaskController( $scope, $rootScope, toaster, TaskService ) {
  'use strict';

  $scope.taskList = [];
  $scope.taskSelected = null;
  $scope.selectTask = selectTask;
  //$scope.newTask = newTask;
  $scope.unassignTask = unassignTask;
  $scope.assignMeTask = assignMeTask;
  $scope.salveTask = salveTask;
  $scope.completeTask = completeTask;
  $scope.showNewTaskModal = showNewTaskModal;
  $scope.cancelNewTask = cancelNewTask;
  $scope.salveNewTask = salveNewTask;

  initialization();

  function initialization() {
    getTasks();
  }

  function selectTask( task ) {
    $scope.taskSelected = task;
  }

  function getTasks() {
    TaskService.getTasks( getTaskSuccess, getTaskError );
  }

  function getTaskSuccess( response ) {
    $scope.taskList = response.data;
    $scope.taskSelected = searchTaskSelected();
  }

  function getTaskError() {
    toaster.error( 'Erro ao carregar as tarefas. ' +
                   'Tente mais tarde, se o problema persistir entre em contato com o suporte' );
  }

  function unassignTask() {
    TaskService.unassignTask(
        $scope.taskSelected.id,
        $scope.currentUser.username,
        unassignTaskSuccess,
        unassignTaskError
    );
  }

  function unassignTaskSuccess() {
    refreshTasks();
  }

  function unassignTaskError( response ) {
    if ( response.status == 403 ) {
      toaster.warning( 'ATENÇÃO', 'Você não tem autorização para liberar esta tarefa.' );
    } else {
      toaster.error( 'Erro na tentativa de liberar a tarefa.' +
                     'Tente mais tarde, se o problema persistir entre em contato com o suporte' );
    }
    refreshTasks();
  }

  function assignMeTask() {
    TaskService.assignTask(
        $scope.taskSelected.id,
        $scope.currentUser.username,
        assignMeTaskSuccess,
        assignMeTaskError
    );
  }

  function assignMeTaskSuccess() {
    refreshTasks();
  }

  function assignMeTaskError( response ) {
    if ( response.status == 403 ) {
      toaster.warning( 'ATENÇÃO', 'Você não tem autorização para pegar esta tarefa.' );
    } else {
      toaster.error( 'Erro na tentativa de salvar a tarefa.' +
                     'Tente mais tarde, se o problema persistir entre em contato com o suporte' );
    }
    refreshTasks();
  }

  function salveTask() {
    TaskService.salveTask(
      $scope.taskSelected.id,
      $scope.taskSelected,
      salveTaskSuccess,
      salveTaskError
    );
  }

  function salveTaskSuccess() {
    refreshTasks();
    toaster.success( 'Task salva com sucesso.' );
  }

  function salveTaskError( response ) {
    if ( response.status == 403 ) {
      toaster.warning( 'ATENÇÃO', 'Você não tem autorização para salvar esta tarefa.' );
    } else {
      toaster.error( 'Erro na tentativa de salvar a tarefa.' +
                     'Tente mais tarde, se o problema persistir entre em contato com o suporte' );
    }
  }

  function completeTask() {
    TaskService.completeTask(
      $scope.taskSelected.id,
      $scope.currentUser.username,
      completeTaskSuccess,
      completeTaskError
    );
  }

  function completeTaskSuccess() {
    refreshTasks();
  }

  function completeTaskError( response ) {
    if ( response.status == 403 ) {
      toaster.warning( 'ATENÇÃO', 'Você não tem autorização para completar esta tarefa.' );
    } else {
      toaster.error( 'Erro na tentativa de completar a tarefa.' +
                     'Tente mais tarde, se o problema persistir entre em contato com o suporte' );
    }
    refreshTasks();
  }

  function showNewTaskModal( element ) {
    window.angular.element( element ).modal( 'show' );
  }

  function cancelNewTask() {
    $scope.newDescription = '';
  }

  function salveNewTask() {
    var obj = { 'description' : $scope.newDescription };
    TaskService.createTask(
      obj,
      salveNewTaskSuccess,
      salveNewTaskError
    );
  }

  function salveNewTaskSuccess() {
    refreshTasks();
    $scope.newDescription = '';
    toaster.success( 'Task criada com sucesso.' );
  }

  function salveNewTaskError( response ) {
    if ( response.status == 403 ) {
      toaster.warning( 'ATENÇÃO', 'Você não tem autorização para criar uma tarefa.' );
    } else {
      toaster.error( 'Erro na tentativa de criar uma tarefa.' +
                     'Tente mais tarde, se o problema persistir entre em contato com o suporte' );
    }
  }

  function refreshTasks() {
    getTasks();
    $scope.taskSelected = searchTaskSelected();
  }

  function searchTaskSelected() {
    var result = [];
    if ( $scope.taskSelected != null && $scope.taskList.content != null ) {
      result = $scope.taskList.content.filter(function(task) {
        return task.id == $scope.taskSelected.id;
      });
    }

    return result[0];
  }

}
