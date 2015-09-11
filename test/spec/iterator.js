var expect = require('chai').expect
  , iterator = require('../../lib/iterator');

describe("async-validate:", function() {

  it("should call complete on empty iterator list", function(done) {
    iterator.mapSeries([], function noop(){}, done);
  });

  it("should map multipe items", function(done) {
    iterator.map([1,2,3],
      function multiply(num, cb) {
        cb(null, num * 10); 
      }, 
      function complete(err, results) {
        expect(err).to.eql(null);
        expect(results).to.eql([10,20,30]);
        done();
      });
  });

});
