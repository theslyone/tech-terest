'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Picture = mongoose.model('Picture'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Picture
 */
exports.create = function(req, res) {
  var picture = new Picture(req.body);
  picture.user = req.user;

  picture.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(picture);
    }
  });
};

/**
 * Show the current Picture
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var picture = req.picture ? req.picture.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  picture.isCurrentUserOwner = req.user && picture.user && picture.user._id.toString() === req.user._id.toString();

  res.jsonp(picture);
};

/**
 * Update a Picture
 */
exports.update = function(req, res) {
  var picture = req.picture;

  picture = _.extend(picture, req.body);

  picture.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(picture);
    }
  });
};

/**
 * Delete an Picture
 */
exports.delete = function(req, res) {
  var picture = req.picture;

  picture.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(picture);
    }
  });
};

/**
 * List of Pictures
 */
exports.list = function(req, res) {
  var pictureQuery = Picture.find();
  if(req.query.user){
    pictureQuery.where('user').equals(req.query.user);
  }
  pictureQuery.sort('-created')
  .populate('user', 'displayName profileImageURL')
  .exec(function(err, pictures) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pictures);
    }
  });
};

/**
 * Picture middleware
 */
exports.pictureByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Picture is invalid'
    });
  }

  Picture.findById(id).populate('user', 'displayName').exec(function (err, picture) {
    if (err) {
      return next(err);
    } else if (!picture) {
      return res.status(404).send({
        message: 'No Picture with that identifier has been found'
      });
    }
    req.picture = picture;
    next();
  });
};
