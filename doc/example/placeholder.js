// use a placeholder to set a default value
var Schema = require('../..')
  , descriptor = {
      list: {
        type: 'array',
        values: {type: 'integer'},
        placeholder: function() {
          return []; 
        }
      }
    }
  , source = {}
  , schema;

require('../../plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(source);
});
