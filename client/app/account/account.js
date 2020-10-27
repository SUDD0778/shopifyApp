'use strict';

angular.module('angFullstackApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      }).state('forgot', {
        url: '/forgot',
        templateUrl: 'app/account/forgot/forgot.html',
        controller: 'ForgotCtrl'
      }).state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true,
        abstract: true
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: 'app/account/settings/password.html',
        controller: 'SettingsCtrl',
        authenticate: true
      }).state('settings.module', {
        url: '/module',
        templateUrl: 'app/account/settings/create-module.html',
        controller: 'CreateModuleCtrl',
        authenticate: true
      }).state('settings.resource', {
        url: '/resource',
        templateUrl: 'app/account/settings/create-apis.html',
        controller: 'CreateModuleCtrl',
        authenticate: true
      }).state('settings.webhook', {
        url: '/webhook',
        templateUrl: 'app/account/settings/create-webhook.html',
        controller: 'CreateWebHookCtrl',
        authenticate: true
      });
  });