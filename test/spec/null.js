var expect = require('chai').expect
  , schema = require('../../index');

describe("async-validate:", function() {
  var descriptor = {
    value: {
      type: 'null'
    }
  }

  it("should error on non-null value", function(done) {
    var validator = new schema(descriptor);
    validator.validate({value: true}, function(err, res) {
      expect(res.errors.length).to.eql(1);
      expect(res.errors[0].message).to.eql('value is not null');
      done();
    });
  });

  it("should validate on type null", function(done) {
    var validator = new schema(descriptor);
    validator.validate({value: null}, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

  it("should validate on type null with no value", function(done) {
    var validator = new schema(descriptor);
    validator.validate({}, function(err, res) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      done();
    });
  });

});
