'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Picture Schema
 */
var PictureSchema = new Schema({
  url: {
    type: String,
    default: '',
    required: 'Please fill picture url',
    trim: true
  },
  caption: {
    type: String,
    default: '',
    required: 'Please fill picture caption',
    trim: true
  },
  likes: [{
    created: {
      type: Date,
      default: Date.now
    },
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    }
  }],
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Picture', PictureSchema);
