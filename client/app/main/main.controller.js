'use strict';

angular.module('angFullstackApp').controller('MainCtrl', function ($scope, $location, Shopify, $interval) {
	
	
})
.controller('HomeCtrl', function ($scope, $http, $state, $uibModal, Shopify, $interval) {
	$scope.loading = true;
	syncOrders();
	console.log("Main Ctrl");
	// console.log("Shopify", Shopify);
	$interval(syncOrders, 60000);
	function syncOrders () {
		Shopify.fetchOrders(function(orders) {
			$scope.orders = orders? orders.orders : [];
			$scope.loading = false;
		},function(err){
			console.log('err',err);
		});
	}
})