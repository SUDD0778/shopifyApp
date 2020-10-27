'use strict'

angular.module('angFullstackApp').service('Batches', ['$resource', function ($resource) {
    return $resource('/api/batches/:id/:controller', {
        id: '@_id'
    },
    {     
        // deleteSelectedCharges: {method: 'POST', params: {controller: 'deleteSelectedCharges'}, isArray: false}
        // updateMultiple : {method: 'PUT',params :{controller : updateMultiple}, isArray: false},
        updateMultiple : {method : 'PUT', params : {controller : 'updateMultiple'}},
        get: {method : 'GET', isArray: true},
        update: {method: 'PUT', isArray: false},
        create: {method: 'POST', isArray: false},
    });
}])