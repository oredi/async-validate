// validate a field length
var Schema = require('../..')
  , descriptor = {
      func: {type: 'function', required: true, len: 1}
    }
  , source = {func: function noop(){}}
  , schema;

require('../../plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
