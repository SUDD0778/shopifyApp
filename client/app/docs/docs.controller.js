'use strict';

angular.module('angFullstackApp').controller('DocCtrl', function ($scope, $http, $state, Auth, Shopify, Batches, $q, $interval, $uibModal) {
	$scope.loaded = true;
	console.log("docs", Batches);
	$scope.tabs = {'batches' : true};
	
	$scope.clearMongooseError = function(form, fieldName) {
      delete form[fieldName].$error.mongoose;
	};
	
	$scope.batchesForm = {
		batches : {
			batchName : '',
			startDate : new Date(),
			endDate : new Date(),
			status : '',
			note : '',
		},
		disabled : false,
		isEdit : false,
		format: 'dd-MMMM-yyyy',
	}
	
	$scope.batchStatus = [
		{
			id : 1,
			type : 'open'},
		{
			id : 2,
			type : 'fulfilled'
		}
	];
	$scope.allData = {};
	$scope.allData.batches = [], $scope.allData.orders = [];
	var user = localStorage.getItem('user') ? localStorage.getItem('user') : {};
	user = JSON.parse(user);
	user = user.user ? user.user : {};

	$q.all([
		Shopify.fetchOrdersfromDb().$promise,
		Batches.get().$promise,
	])
	.then(function(values) {
		$scope.allData.orders = values[0];
		$scope.allData.batches = values[1];
		$scope.allData.availableBatches = angular.copy($scope.allData.batches);
		console.log("$scope.allData.batches", $scope.allData.batches.length, $scope.allData.availableBatches);
	})
	.catch(function(err) {
		if(err) console.log("err", err);
	});
	
	console.log(user);
	
	$scope.submitBatch = function (form_batch, batchesForm) {
		console.log("batchesForm", batchesForm);
		if(form_batch.$valid) {
			form_batch.$submitted = true;
			batchesForm.disabled = true;
			batchesForm.batches.user = {
				username: user.username,
				_id: user._id,
				username: user.username,
				name: user.name,
				note : ''
			};
			batchesForm.batches.startDate.setHours(0,0,0,0);
			batchesForm.batches.endDate.setHours(0,0,0,0);
			batchesForm.batches.endDate.setDate(batchesForm.batches.endDate.getDate() +1);
			console.log("batch", batchesForm.batches);
			console.log("$scope.allData.orders", $scope.allData.orders);
			if(!batchesForm.isEdit) {
				var endDate = new Date(batchesForm.batches.endDate);
				$scope.allData.orders.forEach(function(order) {
					if(new Date(order.created_at).getTime() < endDate.getTime() && new Date(order.created_at).getTime() > batchesForm.batches.startDate.getTime()) {
						if(!batchesForm.batches.orderIds) batchesForm.batches.orderIds = [];
						batchesForm.batches.orderIds.push({id: order.id.toString()});
					}
				});
				Batches.save(batchesForm.batches, function (batch) {
					$scope.allData.availableBatches.push(batch);
					form_batch.$submitted = false;
					batchesForm.disabled = false;					
					setPristine(form_batch);
					batchesForm.batches = {};
				}, function (err) {
					console.log("err", err);
					handleError(err, form_batch);
					batchesForm.batches = {};
					batchesForm.disabled = false;
				});
			} else {
				Batches.update(batchesForm.batches, function (batch) {
					if(batchesForm.paginationIndex)
						$scope.allData.availableBatches[batchesForm.paginationIndex] = batch;
					if(batchesForm.editIndex)
						$scope.allData.batches[batchesForm.editIndex] = batch;
					batchesForm.batches = {};
					batchesForm.batches.startDate = new Date();
					batchesForm.batches.endDate = new Date();
					batchesForm.isEdit = false;
					form_batch.$submitted = false;
					setPristine(form_batch);
					batchesForm.disabled = false;
				}, function (err) {
					console.log("err", err);
					handleError(err, form_batch);
					batchesForm.batches = {};
					batchesForm.disabled = false;
				});
			}
		}
	}

	$scope.edit = function (entityName, entity, entityForm, index) {
		if(entityName == 'batch') {
			entityForm.paginationIndex = index;
			entityForm.batches = $scope.allData.availableBatches[index];
			entityForm.batches.startDate = new Date($scope.allData.availableBatches[index].startDate);
			entityForm.batches.endDate = new Date($scope.allData.availableBatches[index].endDate);
			entityForm.editIndex = _.findIndex($scope.allData.batches, {_id: entity._id});
			entityForm.isEdit = true;
		}		
	}	
	
	$scope.cancelUpdate = function (entityName, form) {
		if(entityName == 'batch') {
		  setPristine(form);
		  $scope.batchesForm.batches = {}
		  $scope.batchesForm.batches.startDate = new Date();
	      $scope.batchesForm.batches.endDate = new Date();
	      $scope.batchesForm.isEdit = false;
		}
	  };

	$scope.getSearchResults = function (entity, searchField, firstFilter, secondFilter) {
		if (entity == 'batch') {
            $scope.allData.availableBatches = [];
            if (searchField) {
                _.forEach($scope.allData.batches, function (item, itemIndex) {
                    if(item.batchName && item.batchName.toLowerCase().includes(searchField.toLowerCase()))
						$scope.allData.availableBatches.push(item);
                });
            }
            else {
                $scope.allData.availableBatches = $scope.allData.batches;
            }
        }
	}
	
	console.log("Syncing orders");
	$interval(syncOrders, 30000);
	function syncOrders () {
		var updateBatches = [];
		Shopify.fetchOrders(function(msg) {
			console.log(msg.msg);
			Shopify.fetchOrdersfromDb(function(orders) {
				console.log("orders", orders);
				$scope.allData.orders = orders;
				console.log("$scope.allData.orders", $scope.allData.orders.length);
				$scope.allData.orders.forEach(function(order) {
					console.log("order", order);
					$scope.allData.batches.forEach(function(batch) {
						if(new Date(order.created_at).getTime() < new Date(batch.endDate).getTime() && new Date(order.created_at).getTime() > new Date(batch.startDate).getTime()) {
							if(!_.find(batch.orderIds, {id : order.id.toString()})) {
								batch.orderIds.push({id: order.id.toString()});
								updateBatches.push(batch);
							}
						}
					});
				});
				if(updateBatches.length > 0) {
					Batches.updateMultiple(updateBatches, function (batch) {
						$scope.allData.availableBatches = angular.copy($scope.allData.batches);					
						alert(batch.msg);
					}, function (err) {
						console.log("err", err);
						handleError(err);
					});
				}
			},function(err) {
				if(err) 
					handleError(err);
			});
		},function(err){
			console.log('err',err);
		});
	}

	var setPristine = function(form){
		if(form.$setPristine){
		  form.$setPristine();
		}else{
		  _.each(form, function (input)
		  {
			if (input.$dirty) {
			  input.$dirty = false;
			}
		  });
		}
	};
	
	function handleError(err, form) {
        if(err.data.error) {
          if(err.data.error.errors){
             return alert(err.data.message);
          }
          else if(typeof err.data.error == 'string')
            return alert(err.data.message);
          else return alert("Some error occured");
        } else return alert("Some error occured");
	}
	  
	$scope.viewOrders = function (batch) {

		$uibModal.open({
			templateUrl: 'orderModal.html',
			scope: $scope,
			scope: $scope,
			controller: 'orderListCtrl',
			resolve:{
				batch: function(){return batch;}
			}
		});
	}
})
.controller('orderListCtrl', function($uibModalInstance,$scope,$http,Shopify, batch, $q){

	console.log($scope.allData.orders);
	console.log("batch", batch);
	$scope.batchOrders = [];
	batch.orderIds.forEach(function(order) {
		var _order = _.find($scope.allData.orders, {id : order.id.toString()});
		if(_order) $scope.batchOrders.push(_order);
	});
	$scope.closeOrder = function(order) {
		console.log("order", order);
		$q.all([
			Shopify.closeOrder({id : order.id, fulfillment_status : order.fulfillment_status}).$promise,
		])
		.then(function(values) {
			console.log("values", values);
			var order = values[0] ? (values[0].order? values[0].order : {} ) : {};
			console.log("order", order);
			var _order = _.findIndex($scope.allData.orders, {id : order.id.toString()});
			if(_order != -1)
				$scope.allData.orders[_order] = order;
		}, function (err) {
			console.log("err", err);
		});
	}

	$scope.cancel = function(){
	  $uibModalInstance.dismiss();
	};
  });
