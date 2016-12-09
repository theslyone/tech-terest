'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Picture = mongoose.model('Picture'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  picture;

/**
 * Picture routes tests
 */
describe('Picture CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Picture
    user.save(function () {
      picture = {
        name: 'Picture name'
      };

      done();
    });
  });

  it('should be able to save a Picture if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Picture
        agent.post('/api/pictures')
          .send(picture)
          .expect(200)
          .end(function (pictureSaveErr, pictureSaveRes) {
            // Handle Picture save error
            if (pictureSaveErr) {
              return done(pictureSaveErr);
            }

            // Get a list of Pictures
            agent.get('/api/pictures')
              .end(function (picturesGetErr, picturesGetRes) {
                // Handle Pictures save error
                if (picturesGetErr) {
                  return done(picturesGetErr);
                }

                // Get Pictures list
                var pictures = picturesGetRes.body;

                // Set assertions
                (pictures[0].user._id).should.equal(userId);
                (pictures[0].name).should.match('Picture name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Picture if not logged in', function (done) {
    agent.post('/api/pictures')
      .send(picture)
      .expect(403)
      .end(function (pictureSaveErr, pictureSaveRes) {
        // Call the assertion callback
        done(pictureSaveErr);
      });
  });

  it('should not be able to save an Picture if no name is provided', function (done) {
    // Invalidate name field
    picture.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Picture
        agent.post('/api/pictures')
          .send(picture)
          .expect(400)
          .end(function (pictureSaveErr, pictureSaveRes) {
            // Set message assertion
            (pictureSaveRes.body.message).should.match('Please fill Picture name');

            // Handle Picture save error
            done(pictureSaveErr);
          });
      });
  });

  it('should be able to update an Picture if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Picture
        agent.post('/api/pictures')
          .send(picture)
          .expect(200)
          .end(function (pictureSaveErr, pictureSaveRes) {
            // Handle Picture save error
            if (pictureSaveErr) {
              return done(pictureSaveErr);
            }

            // Update Picture name
            picture.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Picture
            agent.put('/api/pictures/' + pictureSaveRes.body._id)
              .send(picture)
              .expect(200)
              .end(function (pictureUpdateErr, pictureUpdateRes) {
                // Handle Picture update error
                if (pictureUpdateErr) {
                  return done(pictureUpdateErr);
                }

                // Set assertions
                (pictureUpdateRes.body._id).should.equal(pictureSaveRes.body._id);
                (pictureUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Pictures if not signed in', function (done) {
    // Create new Picture model instance
    var pictureObj = new Picture(picture);

    // Save the picture
    pictureObj.save(function () {
      // Request Pictures
      request(app).get('/api/pictures')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Picture if not signed in', function (done) {
    // Create new Picture model instance
    var pictureObj = new Picture(picture);

    // Save the Picture
    pictureObj.save(function () {
      request(app).get('/api/pictures/' + pictureObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', picture.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Picture with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/pictures/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Picture is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Picture which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Picture
    request(app).get('/api/pictures/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Picture with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Picture if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Picture
        agent.post('/api/pictures')
          .send(picture)
          .expect(200)
          .end(function (pictureSaveErr, pictureSaveRes) {
            // Handle Picture save error
            if (pictureSaveErr) {
              return done(pictureSaveErr);
            }

            // Delete an existing Picture
            agent.delete('/api/pictures/' + pictureSaveRes.body._id)
              .send(picture)
              .expect(200)
              .end(function (pictureDeleteErr, pictureDeleteRes) {
                // Handle picture error error
                if (pictureDeleteErr) {
                  return done(pictureDeleteErr);
                }

                // Set assertions
                (pictureDeleteRes.body._id).should.equal(pictureSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Picture if not signed in', function (done) {
    // Set Picture user
    picture.user = user;

    // Create new Picture model instance
    var pictureObj = new Picture(picture);

    // Save the Picture
    pictureObj.save(function () {
      // Try deleting Picture
      request(app).delete('/api/pictures/' + pictureObj._id)
        .expect(403)
        .end(function (pictureDeleteErr, pictureDeleteRes) {
          // Set message assertion
          (pictureDeleteRes.body.message).should.match('User is not authorized');

          // Handle Picture error error
          done(pictureDeleteErr);
        });

    });
  });

  it('should be able to get a single Picture that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Picture
          agent.post('/api/pictures')
            .send(picture)
            .expect(200)
            .end(function (pictureSaveErr, pictureSaveRes) {
              // Handle Picture save error
              if (pictureSaveErr) {
                return done(pictureSaveErr);
              }

              // Set assertions on new Picture
              (pictureSaveRes.body.name).should.equal(picture.name);
              should.exist(pictureSaveRes.body.user);
              should.equal(pictureSaveRes.body.user._id, orphanId);

              // force the Picture to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Picture
                    agent.get('/api/pictures/' + pictureSaveRes.body._id)
                      .expect(200)
                      .end(function (pictureInfoErr, pictureInfoRes) {
                        // Handle Picture error
                        if (pictureInfoErr) {
                          return done(pictureInfoErr);
                        }

                        // Set assertions
                        (pictureInfoRes.body._id).should.equal(pictureSaveRes.body._id);
                        (pictureInfoRes.body.name).should.equal(picture.name);
                        should.equal(pictureInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Picture.remove().exec(done);
    });
  });
});
