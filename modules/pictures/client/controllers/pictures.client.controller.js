(function () {
  'use strict';

  // Pictures controller
  angular
    .module('pictures')
    .controller('PicturesController', PicturesController);

  PicturesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'pictureResolve'];

  function PicturesController ($scope, $state, $window, Authentication, picture) {
    var vm = this;

    vm.authentication = Authentication;
    vm.picture = picture;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Picture
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.picture.$remove($state.go('pictures.list'));
      }
    }

    // Save Picture
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.pictureForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.picture._id) {
        vm.picture.$update(successCallback, errorCallback);
      } else {
        vm.picture.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('pictures.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }


  }
}());
