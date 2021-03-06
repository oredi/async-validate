var expect = require('chai').expect
  , schema = require('../../index')
  , msg = require('../../messages');

describe('async-validate:', function() {

  // clone of the default messages
  var clone = schema.clone(msg);
  // change a message
  clone.required = '%s is a required field';

  it('should validate using a custom error message', function(done) {
    var descriptor = {
      name: {type: 'string', required: true, message: 'Name is required'},
    }
    var validator = new schema(descriptor);
    validator.validate({}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql('Name is required');
      done();
    });
  });

  it('should validate using a custom error message function', function(done) {
    var descriptor = {
      name: {
        type: 'string',
        required: true,
        message: function(message, parameters) {
          expect(message).to.be.a('string');
          expect(parameters).to.be.an('array');
          return 'Name is required';
        }
      },
    }
    var validator = new schema(descriptor);
    validator.validate({}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql('Name is required');
      done();
    });
  });

  it('should validate using an message function (returns Error)',
    function(done) {
      var descriptor = {
        name: {
          type: 'string',
          required: true,
          message: function(message, parameters) {
            expect(message).to.be.a('string');
            expect(parameters).to.be.an('array');
            return new Error('Name is required');
          }
        },
      }
      var validator = new schema(descriptor);
      validator.validate({}, function(err, res) {
        expect(res.errors.length).to.eql(1);
        expect(res.errors[0].message).to.eql('Name is required');
        done();
      });
    }
  );

  it('should validate using custom messages', function(done) {
    var descriptor = {
      name: {type: 'string', required: true},
    }
    var validator = new schema(descriptor);

    // assign updated messages to the schema
    validator.messages(clone);

    validator.validate({}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql('name is a required field');
      done();
    });
  });

  it('should use raise() helper method', function(done) {
    var descriptor = {
      name: function(cb) {
        this.raise('%s is a required field', this.field);
        cb();
      }
    }
    var validator = new schema(descriptor);
    validator.validate({}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql('name is a required field');
      done();
    });
  });

});
