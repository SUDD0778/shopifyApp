'use strict';

angular.module('angFullstackApp')
  .controller('ResourceCtrl', function ($scope, $http, $state, $uibModal, Auth, Shopify) {
      $scope.isMaster = Auth.isMaster();
      $scope.loader = true;    
      
      Shopify.fetchProduct().$promise.then(function(data){
        console.log("data", data);
        $scope.products = data.products ? data.products : [];
        $scope.loader = false;
      },function(err){
        console.log('err',err);
      });
      
  });