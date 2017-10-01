'use strict';

// Karma configuration
module.exports = function( config ) {
  config.set({

    frameworks: ['jasmine'],

    files : [
      'src/js/jquery.min.js',
      'src/js/angular.min.js',
      'src/js/angular-route.min.js',
      'src/js/angular-toastr.min.js',
      'lib/angular/angular-mocks.js',

      'src/app/app.js',
      'src/app/app.filter.js',
      'src/app/app.environment.js',

      'src/app/controllers/app.controller.js',
      'src/app/controllers/login.controller.js',
      'src/app/controllers/task.controller.js',

      'src/app/services/auth.service.js',
      'src/app/services/task.service.js',

      'spec/app/controller/app.controller.spec.js',
      'spec/app/controller/login.controller.spec.js',
      'spec/app/controller/task.controller.spec.js'
    ],

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['Chrome'],

    captureTimeout: 60000,

    singleRun: true
  });
};
