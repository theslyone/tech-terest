(function () {
  'use strict';

  angular
    .module('pictures')
    .controller('PicturesListController', PicturesListController);

  PicturesListController.$inject = ['PicturesService', '$state', 'Authentication', '_'];

  function PicturesListController(PicturesService, $state, Authentication, _) {
    var vm = this;
    vm.pictures = PicturesService.query();
    vm.authentication = Authentication;

    vm.like = like;
    vm.unlike = unlike;
    vm.isLiked = isLiked;
    vm.filter = filter;

    function like(picture){
      if(vm.authentication.user){
        picture.likes.push({ user: vm.authentication.user });
        picture.$update(successCallback, errorCallback);
      }
      else{
        $state.go('authentication.signin');
      }

      function successCallback(res) {

      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function unlike(picture){
      if(vm.authentication.user){
        picture.likes = picture.likes.filter(function(like){
          return like.user !== vm.authentication.user._id;
        });
        picture.$update(successCallback, errorCallback);
      }
      else{
        $state.go('authentication.signin');
      }

      function successCallback(res) {

      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function isLiked(picture){
      return _.find(picture.likes, { 'user': vm.authentication.user._id });
    }

    function filter(user){
      PicturesService.query({ user: user._id })
      .$promise.then(function(pictures){
        vm.pictures = pictures;
        var $container = $('.card-grid');
        $container.imagesLoaded(function() {
          $container.masonry('reloadItems');
        });              
      });
    }
  }
}());
