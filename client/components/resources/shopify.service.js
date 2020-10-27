'use strict'

angular.module('angFullstackApp').service('Shopify', ['$resource', function ($resource) {
    return $resource('/api/shopify/:id/:controller', {
        id: '@_id'
    },
    {     
        fetchOrders : {method : 'GET', params : {controller : 'fetchOrders'}},
        fetchProduct : {method : 'GET', params : {controller : 'fetchProduct'}},
        createProduct : {method : 'POST', params : {controller : 'createProduct'}},
        closeOrder : {method : 'POST', params : {controller : 'closeOrder'}},
        fetchOrdersfromDb :  {method : 'GET', params : {controller : 'fetchOrdersfromDb'}, isArray : true},
    });
}])