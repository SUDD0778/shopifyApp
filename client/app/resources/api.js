'use strict';

angular.module('angFullstackApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('resources', {
        url: '/resources',
        templateUrl: 'app/resources/apis.html',
        authenticate:true
      });
  });