// Pictures service used to communicate Pictures REST endpoints
(function () {
  'use strict';

  angular
    .module('pictures')
    .factory('PicturesService', PicturesService);

  PicturesService.$inject = ['$resource'];

  function PicturesService($resource) {
    return $resource('api/pictures/:pictureId', {
      pictureId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
