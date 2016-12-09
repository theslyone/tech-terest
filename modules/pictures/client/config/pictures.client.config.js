(function () {
  'use strict';

  angular
    .module('pictures')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Pictures',
      state: 'pictures',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'pictures', {
      title: 'All',
      state: 'pictures.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'pictures', {
      title: 'Add New',
      state: 'pictures.create',
      roles: ['user']
    });
  }
}());
