describe('Task Suite', function() {

  var _toaster_,
    _taskGetRequestHandler_,
    _taskPutRequestHandler_,
    _httpBackend_;

  var taskList = {
    content:[
      { id:1,description:'Primeira task criada',answer:null,assigned:null,createDate:1505068926115,completed:false },
      { id:2,description:'Segunda task criada',answer:null,assigned:'desafio',createDate:1505068926115,completed:false },
      { id:3,description:'Terceira task criada',answer:null,assigned:null,createDate:1505068926115,completed:false },
      { id:4,description:'Quarta task criada',answer:null,assigned:'desafio',createDate:1505068926115,completed:false },
      { id:5,description:'Quinta task criada',answer:null,assigned:null,createDate:1505068926115,completed:false },
      { id:6,description:'Sexta task criada',answer:null,assigned:'fullstack',createDate:1505068926115,completed:false },
      { id:7,description:'Sétima task criada',answer:null,assigned:null,createDate:1505068926115,completed:false },
      { id:8,description:'Oitava task criada',answer:null,assigned:null,createDate:1505068926115,completed:false },
      { id:9,description:'Nona task criada',answer:null,assigned:null,createDate:1505068926115,completed:false },
      { id:10,description:'Décima task criada',answer:null,assigned:null,createDate:1505068926115,completed:false },
      { id:11,description:'Décima-primeira task criada',answer:null,assigned:null,createDate:1505068926115,completed:false },
      { id:12,description:'Décima-segunda task criada',answer:null,assigned:null,createDate:1505068926115,completed:false }
    ],
    last:true,
    totalPages:1,
    totalElements:12,
    size:100,
    number:0,
    sort:null,
    first:true,
    numberOfElements:5
  };

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

    angular.mock.inject( function ( $httpBackend, $controller, $rootScope, toaster, TaskService, ENVIRONMENT ) {
      $scope = $rootScope.$new();
      _httpBackend_ = $httpBackend;
      _toaster_ = toaster;

      spyOn( toaster, 'warning' );
      spyOn( toaster, 'error' );

      _taskGetRequestHandler_ = _httpBackend_.when( 'GET', ENVIRONMENT.API_Task + '/not-completed?page=0&size=100' ).respond( 200, taskList );

      //   '/api/v1/tasks/{id}/{action}/{username}'
      _taskPutRequestHandler_ = _httpBackend_.whenPUT( /\/api\/v1\/tasks\/(.+)\/(.+)\/(.+)/, undefined, undefined, ['id','action','username'] );

      $scope.currentUser = { 'username':'desafio', 'name':'FullStack 01'};

      $controller( 'taskController', {
        $scope : $scope,
        $rootScope : $rootScope,
        toaster : _toaster_,
        TaskService : TaskService
      });

    });


  });

  afterEach( function() {
    _httpBackend_.verifyNoOutstandingExpectation();
    _httpBackend_.verifyNoOutstandingRequest();
  });

  it ( 'Carrega lista de tarefas disponíveis', function () {
    _httpBackend_.expectGET('/api/v1/tasks/not-completed?page=0&size=100');
    _httpBackend_.flush();

    expect(taskList).toEqual($scope.taskList);

  });

  it ( 'Informa erro ao tentar carregar lista de tarefas disponíveis', function () {
    _taskGetRequestHandler_.respond(401, '');
    _httpBackend_.expectGET('/api/v1/tasks/not-completed?page=0&size=100');
    _httpBackend_.flush();

    expect(_toaster_.error).toHaveBeenCalledWith( 'Erro ao carregar as tarefas. ' +
                                                  'Tente mais tarde, se o problema persistir entre em contato com o suporte' );
  });

  it ( 'Libera tarefa associada ao usuário autenticado', function () {
    // Em taskList id:2 e id:4 tem assigned:"desafio" (Meu Usuário)
    // Em taskList id:6 tem assigned:"fullstack"
    // '/4/unassigned/desafio'
    _taskPutRequestHandler_.respond( function(method, url, data, headers, params) {
      return putResponse( false, url, data, params );
    });
    $scope.selectTask(taskList.content[3]);
    $scope.unassignTask();
    _httpBackend_.expectPUT('/api/v1/tasks/' + $scope.taskSelected.id + '/unassigned/' + $scope.currentUser.username);
    expect(_httpBackend_.flush).not.toThrow();

    expect($scope.taskSelected.assigned).toBe(null);

  });

  it ( 'Informa negação ao tentar liberar tarefa de outro usuário', function () {
    // Em taskList id:2 e id:4 tem assigned:"desafio" (Meu Usuário)
    // Em taskList id:6 tem assigned:"fullstack"
    // '/6/unassigned/desafio'
    _taskPutRequestHandler_.respond( function(method, url, data, headers, params) {
      return putResponse( false, url, data, params );
    });

    $scope.selectTask(taskList.content[5]);
    $scope.unassignTask();


    _httpBackend_.expectPUT('/api/v1/tasks/' + $scope.taskSelected.id + '/unassigned/' + $scope.currentUser.username);
    _httpBackend_.flush();

    expect(_toaster_.warning).toHaveBeenCalledWith( 'ATENÇÃO', 'Você não tem autorização para liberar esta tarefa.' );
  });

  it ( 'Informa erro ao tentar liberar tarefa', function () {
    // Em taskList id:2 e id:4 tem assigned:"desafio" (Meu Usuário)
    // Em taskList id:6 tem assigned:"fullstack"
    // '/4/unassigned/desafio'
    _taskPutRequestHandler_.respond( function(method, url, data, headers, params) {
      return putResponse( true, url, data, params );
    });

    $scope.selectTask(taskList.content[3]);
    $scope.unassignTask();

    _httpBackend_.expectPUT('/api/v1/tasks/' + $scope.taskSelected.id + '/unassigned/' + $scope.currentUser.username);
    _httpBackend_.flush();

    expect(_toaster_.error).toHaveBeenCalledWith( 'Erro na tentativa de liberar a tarefa.' +
                   'Tente mais tarde, se o problema persistir entre em contato com o suporte' );
  });

  it ( 'Associa a tarefa disponível ao usuário autenticado', function () {
    // Em taskList id:2 e id:4 tem assigned:"desafio" (Meu Usuário)
    // Em taskList id:6 tem assigned:"fullstack"
    // '/1/assigned/desafio'
    _taskPutRequestHandler_.respond( function(method, url, data, headers, params) {
      return putResponse( false, url, data, params );
    });
    $scope.selectTask(taskList.content[0]);
    $scope.assignMeTask();
    _httpBackend_.expectPUT('/api/v1/tasks/' + $scope.taskSelected.id + '/assigned/' + $scope.currentUser.username);
    expect(_httpBackend_.flush).not.toThrow();

    expect($scope.taskSelected.assigned).toBe($scope.currentUser.username);
  });

  it ( 'Informa negação ao tentar associar a tarefa de outro usuário', function () {
    // Em taskList id:2 e id:4 tem assigned:"desafio" (Meu Usuário)
    // Em taskList id:6 tem assigned:"fullstack"
    // '/6/assigned/desafio'
    _taskPutRequestHandler_.respond( function(method, url, data, headers, params) {
      return putResponse( false, url, data, params );
    });

    $scope.selectTask(taskList.content[5]);
    $scope.assignMeTask();


    _httpBackend_.expectPUT('/api/v1/tasks/' + $scope.taskSelected.id + '/assigned/' + $scope.currentUser.username);
    _httpBackend_.flush();

    expect(_toaster_.warning).toHaveBeenCalledWith( 'ATENÇÃO', 'Você não tem autorização para pegar esta tarefa.' );
  });

  it ( 'Informa erro ao tentar associar a tarefa', function () {
    // Em taskList id:2 e id:4 tem assigned:"desafio" (Meu Usuário)
    // Em taskList id:6 tem assigned:"fullstack"
    // '/4/assigned/desafio'
    _taskPutRequestHandler_.respond( function(method, url, data, headers, params) {
      return putResponse( true, url, data, params );
    });

    $scope.selectTask(taskList.content[3]);
    $scope.assignMeTask();

    _httpBackend_.expectPUT('/api/v1/tasks/' + $scope.taskSelected.id + '/assigned/' + $scope.currentUser.username);
    _httpBackend_.flush();

    expect(_toaster_.error).toHaveBeenCalledWith( 'Erro na tentativa de salvar a tarefa.' +
                   'Tente mais tarde, se o problema persistir entre em contato com o suporte' );
  });

  // completed
  it ( 'Marca como completa a tarefa associada ao usuário autenticado', function () {
    // Em taskList id:2 e id:4 tem assigned:"desafio" (Meu Usuário)
    // Em taskList id:6 tem assigned:"fullstack"
    // '/1/assigned/desafio'
    _taskPutRequestHandler_.respond( function(method, url, data, headers, params) {
      return putResponse( false, url, data, params );
    });
    $scope.selectTask(taskList.content[1]);
    $scope.completeTask();
    _httpBackend_.expectPUT('/api/v1/tasks/' + $scope.taskSelected.id + '/completed/' + $scope.currentUser.username);
    expect(_httpBackend_.flush).not.toThrow();

    expect($scope.taskSelected.completed).toBe(true);
  });

  it ( 'Informa negação ao tentar completar a tarefa de outro usuário', function () {
    // Em taskList id:2 e id:4 tem assigned:"desafio" (Meu Usuário)
    // Em taskList id:6 tem assigned:"fullstack"
    // '/6/assigned/desafio'
    _taskPutRequestHandler_.respond( function(method, url, data, headers, params) {
      return putResponse( false, url, data, params );
    });

    $scope.selectTask(taskList.content[5]);
    $scope.completeTask();

    _httpBackend_.expectPUT('/api/v1/tasks/' + $scope.taskSelected.id + '/completed/' + $scope.currentUser.username);
    _httpBackend_.flush();

    expect(_toaster_.warning).toHaveBeenCalledWith( 'ATENÇÃO', 'Você não tem autorização para completar esta tarefa.' );
  });

  it ( 'Informa erro ao tentar marcar como completa', function () {
    // Em taskList id:2 e id:4 tem assigned:"desafio" (Meu Usuário)
    // Em taskList id:6 tem assigned:"fullstack"
    // '/4/assigned/desafio'
    _taskPutRequestHandler_.respond( function(method, url, data, headers, params) {
      return putResponse( true, url, data, params );
    });

    $scope.selectTask(taskList.content[1]);
    $scope.completeTask();

    _httpBackend_.expectPUT('/api/v1/tasks/' + $scope.taskSelected.id + '/completed/' + $scope.currentUser.username);
    _httpBackend_.flush();

    expect(_toaster_.error).toHaveBeenCalledWith( 'Erro na tentativa de completar a tarefa.' +
                 'Tente mais tarde, se o problema persistir entre em contato com o suporte' );
  });

  it ( 'Salva definição da tarefa associada ao usuário autenticado', function () {
    // Em taskList id:4 tem assigned:"desafio" (Meu Usuário)
    // Em taskList id:6 tem assigned:"fullstack"
    // '/1/assigned/desafio'
    _taskPutRequestHandler_ = _httpBackend_.whenPUT( /\/api\/v1\/tasks\/(.+)/, undefined, undefined, ['id'] );
    _taskPutRequestHandler_.respond( function(method, url, data, headers, params) {
      params.action = 'salve';
      return putResponse( false, url, data, params );
    });
    //$scope.selectTask(taskList.content[0]);
    // TODO Rever a ateração da resposta, alteração realizada sobre o mesmo objeto do backend.
    $scope.taskSelected = { id:1,answer:'Tarefa respondida.',assigned:'desafio' };

    $scope.salveTask();
    _httpBackend_.expectPUT('/api/v1/tasks/' + $scope.taskSelected.id, JSON.stringify( $scope.taskSelected ));
    expect(_httpBackend_.flush).not.toThrow();

    expect($scope.taskSelected.answer).toBe('Tarefa respondida.');
  });

  it ( 'Informa negação ao tentar salvar definição da tarefa associada a outro usuário', function () {
    // Em taskList id:4 tem assigned:"desafio" (Meu Usuário)
    // Em taskList id:6 tem assigned:"fullstack"
    // '/1/assigned/desafio'
    _taskPutRequestHandler_ = _httpBackend_.whenPUT( /\/api\/v1\/tasks\/(.+)/, undefined, undefined, ['id'] );
    _taskPutRequestHandler_.respond( function(method, url, data, headers, params) {
      params.action = 'salve';
      return putResponse( false, url, data, params );
    });
    //$scope.selectTask(taskList.content[0]);
    // TODO Rever a ateração da resposta, alteração realizada sobre o mesmo objeto do backend.
    $scope.taskSelected = { id:6,answer:'Tarefa respondida.',assigned:'desafio' };

    $scope.salveTask();
    _httpBackend_.expectPUT('/api/v1/tasks/' + $scope.taskSelected.id, JSON.stringify( $scope.taskSelected ));
    expect(_httpBackend_.flush).not.toThrow();

    expect(_toaster_.warning).toHaveBeenCalledWith( 'ATENÇÃO', 'Você não tem autorização para salvar esta tarefa.' );
  });

  it ( 'Informa erro ao salvar definição da tarefa', function () {
    // Em taskList id:4 tem assigned:"desafio" (Meu Usuário)
    // Em taskList id:6 tem assigned:"fullstack"
    // '/1/assigned/desafio'
    _taskPutRequestHandler_ = _httpBackend_.whenPUT( /\/api\/v1\/tasks\/(.+)/, undefined, undefined, ['id'] );
    _taskPutRequestHandler_.respond( function(method, url, data, headers, params) {
      params.action = 'salve';
      return putResponse( true, url, data, params );
    });
    //$scope.selectTask(taskList.content[0]);
    // TODO Rever a ateração da resposta, alteração realizada sobre o mesmo objeto do backend.
    $scope.taskSelected = { id:1,answer:'Tarefa respondida.',assigned:'desafio' };

    $scope.salveTask();
    _httpBackend_.expectPUT('/api/v1/tasks/' + $scope.taskSelected.id, JSON.stringify( $scope.taskSelected ));
    expect(_httpBackend_.flush).not.toThrow();

    expect(_toaster_.error).toHaveBeenCalledWith( 'Erro na tentativa de salvar a tarefa.' +
                   'Tente mais tarde, se o problema persistir entre em contato com o suporte' );
  });

  // ***************************************************************************
  // Funções privadas
  function putResponse(urlError, url, data, params) {
    // ['id','action','username']
    if (urlError == true) {
      return [ 401, '' ];
    } else {
      var __task__ = searchTask(params.id);
      if ( __task__ == null ) { return null; }

      switch (params.action) {
      case 'unassigned':
        if ( __task__.assigned === params.username ) {
          unassignTask( params.id );
          return [ 200, '' ];
        } else {
          return [ 403, '' ];
        }
      case 'assigned':
        if ( __task__.assigned === null || __task__.assigned === params.username ) {
          __task__.assigned = params.username;
          return [ 200, '' ];
        } else {
          return [ 403, '' ];
        }
      case 'salve':
        var __data__ = JSON.parse( data );
        if ( data !== null && __task__.id == params.id ) {
          if ( __task__.assigned == __data__.assigned ) {
            __task__.answer = __data__.answer;
            return [ '200', '' ];
          } else {
            return [ '403', '' ];
          }
        } else {
          return [ '401', '' ];
        }
      case 'completed':
        if ( __task__.assigned === params.username ) {
          __task__.completed = true;
          return [ 200, '' ];
        } else {
          return [ 403, '' ];
        }
      default:
        return [ '401', '' ];
      }
    }
  }

  function searchTask( id ) {
    for ( var i = 0; i < taskList.content.length; i++ ) {
      if ( taskList.content[i].id == id  )
        return taskList.content[i];
    }
    return null;
  }

  function unassignTask( id ) {
    for ( var i = 0; i < taskList.content.length; i++ ) {
      if ( taskList.content[i].id == id ) {
        taskList.content[i].assigned = null;
      }
    }
  }

});
