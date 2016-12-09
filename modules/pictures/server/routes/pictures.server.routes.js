'use strict';

/**
 * Module dependencies
 */
var picturesPolicy = require('../policies/pictures.server.policy'),
  pictures = require('../controllers/pictures.server.controller');

module.exports = function(app) {
  // Pictures Routes
  app.route('/api/pictures').all(picturesPolicy.isAllowed)
    .get(pictures.list)
    .post(pictures.create);

  app.route('/api/pictures/:pictureId').all(picturesPolicy.isAllowed)
    .get(pictures.read)
    .put(pictures.update)
    .delete(pictures.delete);

  // Finish by binding the Picture middleware
  app.param('pictureId', pictures.pictureByID);
};
