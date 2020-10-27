'use strict';

angular.module('angFullstackApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('docs', {
        url: '/docs',
        templateUrl: 'app/docs/docs.html',
        authenticate: true,
        abstract:true,
        controller: 'DocCtrl'
      }).state('docs.getting_started', {
        url: '/getting_started',
        templateUrl: 'app/docs/getting_started.doc.html',
        authenticate: true
      }).state('docs.stock', {
        url: '/stock',
        templateUrl: 'app/docs/stock.doc.html',
        authenticate: true
      }).state('docs.order', {
        url: '/online_order',
        templateUrl: 'app/docs/onlineOrder.doc.html',
        authenticate: true
      }).state('docs.delivery', {
        url: '/delivery',
        templateUrl: 'app/docs/delivery.doc.html',
        authenticate: true
      }).state('docs.telephony', {
        url: '/telephony',
        templateUrl: 'app/docs/telephony.doc.html',
        authenticate: true
      }).state('docs.api_errors', {
        url: '/errors',
        templateUrl: 'app/docs/api_errors.doc.html',
        authenticate: true
      }).state('docs.best_practices', {
        url: '/best_practices',
        templateUrl: 'app/docs/best_practices.doc.html',
        authenticate: true
      }).state('docs.table', {
        url: '/table_order',
        templateUrl: 'app/docs/tableOrder.doc.html',
        authenticate: true
      }).state('docs.pos_configuration', {
        url: '/pos_configuration',
        templateUrl: 'app/docs/pos.doc.html',
        authenticate: true
      });
  });