'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    $scope.today = new Date();
    $scope.mainCaption = 'What\'s Going on Tonight!';
    $scope.authentication = Authentication;

  }
]);
