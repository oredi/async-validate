Table of Contents
=================

* [Async Validate](#async-validate)
    * [Examples](#examples)
      * [additional](#additional)
      * [assigned-rule](#assigned-rule)
      * [bail](#bail)
      * [deep](#deep)
      * [inline-rule](#inline-rule)
      * [instanceof](#instanceof)
      * [len](#len)
      * [max](#max)
      * [message-clone](#message-clone)
      * [message-function](#message-function)
      * [message-override](#message-override)
      * [message](#message)
      * [min](#min)
      * [multiple-types](#multiple-types)
      * [multiple](#multiple)
      * [pattern](#pattern)
      * [placeholder](#placeholder)
      * [plugin-rule](#plugin-rule)
      * [range](#range)
      * [required](#required)
      * [source-type](#source-type)
      * [state](#state)
      * [type](#type)
      * [whitespace](#whitespace)

Async Validate
==============

### Examples

#### additional

* [doc/example/additional](https://github.com/freeformsystems/async-validate/blob/master/doc/example/additional.js).

```javascript
// generate errors when additional fields are present
var Schema = require('async-validate')
  , opts = {field: 'root'}
  , descriptor = {
      type: 'object',
      additional: false,
      fields: {
        address: {
          type: 'object',
          required: true,
          additional: false,
          fields: {
            street: {type: 'string', required: true},
            city: {type: 'string', required: true},
            zip: {type: 'string', required: true, len: 8, message: 'Invalid zip'}
          }
        }
      }
    }
  , source = {
      id: 'unknown-field',
      name: 'unknown-field',
      address: {
        name: 'unknown-field',
        street: 'Mock St',
        city: 'Mock City',
        zip: '12345678',
      }
    }
  , schema;

require('async-validate/plugin/all');

schema = new Schema(descriptor);
schema.validate(source, opts, function(err, res) {
  console.dir(res.errors);
});
```

```
[ { [Error: extraneous fields (id, name) found in root] field: 'root', reason: { id: 'additional' } },
  { [Error: extraneous fields (name) found in address] field: 'address', reason: { id: 'additional' } } ]
```

#### assigned-rule

* [doc/example/assigned-rule](https://github.com/freeformsystems/async-validate/blob/master/doc/example/assigned-rule.js).

```javascript
// assign a function to a rule
var Schema = require('async-validate')
  , descriptor = {
      id: {
        expected: 'foo',
        test: function(cb) {
          if(this.value !== this.expected) {
            this.raise(
              this.reason('unexpected-id'),
              'id expects %s, got %s',
              this.expected,
              this.value
            ) 
          }
          cb();
        }
      }
    }
  , source = {id: 'qux'}
  , schema;

require('async-validate/plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
```

```
[ { [Error: id expects foo, got qux] field: 'id', reason: { id: 'unexpected-id' } } ]
```

#### bail

* [doc/example/bail](https://github.com/freeformsystems/async-validate/blob/master/doc/example/bail.js).

```javascript
// bail on first error encountered
var Schema = require('async-validate')
  , opts = {bail: true}
  , descriptor = {
      address: {
        type: 'object',
        fields: {
          name: {type: 'string', required: true},
          street: {type: 'string', required: true},
          city: {type: 'string', required: true},
          zip: {type: 'string', required: true}
        }
      }
    }
  , source = {address: {name: '1024c'}}
  , schema;

require('async-validate/plugin/all');

schema = new Schema(descriptor);
schema.validate(source, opts, function(err, res) {
  console.dir(res.errors);
});
```

```
[ { [Error: street is required] field: 'street', reason: { id: 'required' } } ]
```

#### deep

* [doc/example/deep](https://github.com/freeformsystems/async-validate/blob/master/doc/example/deep.js).

```javascript
// validate properties of a nested object
var Schema = require('async-validate')
  , descriptor = {
      address: {
        type: 'object',
        fields: {
          name: {type: 'string', required: true},
          street: {type: 'string', required: true},
          city: {type: 'string', required: true},
          zip: {type: 'string', required: true}
        }
      }
    }
  , source = {address: {name: '1024c', street: 'Mock St', city: 'Mock City'}}
  , schema;

require('async-validate/plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
```

```
[ { [Error: zip is required] field: 'zip', reason: { id: 'required' } } ]
```

#### inline-rule

* [doc/example/inline-rule](https://github.com/freeformsystems/async-validate/blob/master/doc/example/inline-rule.js).

```javascript
// assign a function as a rule
var Schema = require('async-validate')
  , reserved = ['foo']
  , descriptor = {
      id: function(cb) {
        if(~reserved.indexOf(this.value)) {
          this.raise('%s is a reserved id', this.value); 
        }
        cb();
      }
    }
  , source = {id: 'foo'}
  , schema;

require('async-validate/plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
```

```
[ { [Error: foo is a reserved id] field: 'id' } ]
```

#### instanceof

* [doc/example/instanceof](https://github.com/freeformsystems/async-validate/blob/master/doc/example/instanceof.js).

```javascript
// validate a field is an instanceof a function
var Schema = require('async-validate')
  , Component = function Component(){}
  , descriptor = {
      comp: {type: Component, required: true}
    }
  , source = {comp: {}}
  , schema;

require('async-validate/plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
```

```
[ { [Error: comp is not an instance of Component] field: 'comp', reason: { id: 'instanceof' } } ]
```

#### len

* [doc/example/len](https://github.com/freeformsystems/async-validate/blob/master/doc/example/len.js).

```javascript
// validate a field length
var Schema = require('async-validate')
  , descriptor = {
      func: {type: 'function', required: true, len: 1}
    }
  , source = {func: function noop(){}}
  , schema;

require('async-validate/plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
```

```
[ { [Error: func must have exactly 1 arguments] field: 'func', reason: { id: 'length' } } ]
```

#### max

* [doc/example/max](https://github.com/freeformsystems/async-validate/blob/master/doc/example/max.js).

```javascript
// validate a field has a maximum length
var Schema = require('async-validate')
  , descriptor = {
      func: {type: 'function', required: true, max: 1}
    }
  , source = {func: function noop(foo, bar){}}
  , schema;

require('async-validate/plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
```

```
[ { [Error: func cannot have more than 1 arguments] field: 'func', reason: { id: 'max' } } ]
```

#### message-clone

* [doc/example/message-clone](https://github.com/freeformsystems/async-validate/blob/master/doc/example/message-clone.js).

```javascript
// clone default messages
var Schema = require('async-validate')
  , messages = Schema.clone(require('async-validate/messages'))
  , descriptor = {
      name: {
        type: 'string',
        required: true
      }
    }
  , source = {}
  , schema;

require('async-validate/plugin/all');

// change message in place
messages.required = '%s is a required field';

// pass messages as constructor option
schema = new Schema(descriptor, {messages: messages});
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
```

```
[ { [Error: name is a required field] field: 'name', reason: { id: 'required' } } ]
```

#### message-function

* [doc/example/message-function](https://github.com/freeformsystems/async-validate/blob/master/doc/example/message-function.js).

```javascript
// override error message with function
var Schema = require('async-validate')
  , descriptor = {
      name: {
        type: 'string',
        required: true,
        message: function(msg, parameters) {
          return this.format(
            'name must be specified (field: %s)', this.field);
        }
      }
    }
  , source = {}
  , schema;

require('async-validate/plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
```

```
[ { [Error: name must be specified (field: name)] field: 'name', reason: { id: 'required' } } ]
```

#### message-override

* [doc/example/message-override](https://github.com/freeformsystems/async-validate/blob/master/doc/example/message-override.js).

```javascript
// override default error message
var Schema = require('async-validate')
  , messages = require('async-validate/messages')
  , descriptor = {
      name: {
        type: 'string',
        required: true
      }
    }
  , source = {}
  , schema;

require('async-validate/plugin/all');

// change default message in place
messages.required = '%s is a required field';

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
```

```
[ { [Error: name is a required field] field: 'name', reason: { id: 'required' } } ]
```

#### message

* [doc/example/message](https://github.com/freeformsystems/async-validate/blob/master/doc/example/message.js).

```javascript
// override error message
var Schema = require('async-validate')
  , descriptor = {
      name: {
        type: 'string',
        required: true,
        message: 'name must be specified'
      }
    }
  , source = {}
  , schema;

require('async-validate/plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
```

```
[ { [Error: name must be specified] field: 'name', reason: { id: 'required' } } ]
```

#### min

* [doc/example/min](https://github.com/freeformsystems/async-validate/blob/master/doc/example/min.js).

```javascript
// validate a field has a minimum length
var Schema = require('async-validate')
  , descriptor = {
      func: {type: 'function', required: true, min: 1}
    }
  , source = {func: function noop(){}}
  , schema;

require('async-validate/plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
```

```
[ { [Error: func must have at least 1 arguments] field: 'func', reason: { id: 'min' } } ]
```

#### multiple-types

* [doc/example/multiple-types](https://github.com/freeformsystems/async-validate/blob/master/doc/example/multiple-types.js).

```javascript
// validate a field as one of multiple types
var Schema = require('async-validate')
  , descriptor = {
      flag: {type: ['boolean', Boolean], required: true}
    }
  , source = {flag: 'foo'}
  , schema;

require('async-validate/plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
```

```
[ { [Error: flag is not one of the allowed types boolean, Boolean] field: 'flag', reason: { id: 'type' } } ]
```

#### multiple

* [doc/example/multiple](https://github.com/freeformsystems/async-validate/blob/master/doc/example/multiple.js).

```javascript
// validate a field with multiple rules
var Schema = require('async-validate')
  , data = {bar: 'qux'}
  , descriptor = {
      id: [
        {type: 'string', required: true},
        function exists(cb) {
          if(!data[this.value]) {
            this.raise(
              this.reason('missing-id'),
              'id %s does not exist', this.value);
          }
          cb();
        }
      ]
    }
  , source = {id: 'foo'}
  , schema;

require('async-validate/plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
```

```
[ { [Error: id foo does not exist] field: 'id', reason: { id: 'missing-id' } } ]
```

#### pattern

* [doc/example/pattern](https://github.com/freeformsystems/async-validate/blob/master/doc/example/pattern.js).

```javascript
// validate a field as matching a pattern
var Schema = require('async-validate')
  , descriptor = {
      name: {type: 'string', required: true, pattern: /^[a-z0-9]+$/i}
    }
  , source = {name: '-name'}
  , schema;

require('async-validate/plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
```

```
[ { [Error: name value -name does not match pattern /^[a-z0-9]+$/i] field: 'name', reason: { id: 'pattern' } } ]
```

#### placeholder

* [doc/example/placeholder](https://github.com/freeformsystems/async-validate/blob/master/doc/example/placeholder.js).

```javascript
// use a placeholder to set a default value
var Schema = require('async-validate')
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

require('async-validate/plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(source);
});
```

```
{ list: [] }
```

#### plugin-rule

* [doc/example/plugin-rule](https://github.com/freeformsystems/async-validate/blob/master/doc/example/plugin-rule.js).

```javascript
// validate a field with a plugin rule
var Schema = require('async-validate')
  , descriptor = {
      id: {type: 'id', required: true}
    }
  , source = {id: '-foo'}
  , schema;

require('async-validate/plugin/all');

// create plugin function
function plugin() {
  var pattern = /^[a-z0-9-]$/i;
  // create static rule function
  this.main.id = function id(cb) {
    if(!pattern.test(this.value)) {
      this.raise(this.reason('id'), 'invalid id %s', this.value);
    }
    cb();
  }
}

// use plugin
Schema.plugin([plugin]);

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
```

```
[ { [Error: invalid id -foo] field: 'id', reason: { id: 'id' } } ]
```

#### range

* [doc/example/range](https://github.com/freeformsystems/async-validate/blob/master/doc/example/range.js).

```javascript
// validate a field has a length within a range
var Schema = require('async-validate')
  , descriptor = {
      func: {type: 'function', required: true, min: 1, max: 2}
    }
  , source = {func: function noop(foo, bar, qux){}}
  , schema;

require('async-validate/plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
```

```
[ { [Error: func must have arguments length between 1 and 2] field: 'func', reason: { id: 'max' } } ]
```

#### required

* [doc/example/required](https://github.com/freeformsystems/async-validate/blob/master/doc/example/required.js).

```javascript
// validate a field as required
var Schema = require('async-validate')
  , descriptor = {
      name: {type: 'string', required: true}
    }
  , source = {}
  , schema;

require('async-validate/plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
```

```
[ { [Error: name is required] field: 'name', reason: { id: 'required' } } ]
```

#### source-type

* [doc/example/source-type](https://github.com/freeformsystems/async-validate/blob/master/doc/example/source-type.js).

```javascript
// validate the type of the source object
var Schema = require('async-validate')
  , descriptor = {type: 'object'}
  , source = 'foo'
  , schema;

require('async-validate/plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
```

```
[ { [Error: source is not an object] field: 'source', reason: { id: 'type' } } ]
```

#### state

* [doc/example/state](https://github.com/freeformsystems/async-validate/blob/master/doc/example/state.js).

```javascript
// pass state information between rule test functions
var Schema = require('async-validate')
  , url = require('url')
  , dns = require('dns')
  , state = {}
  , opts = {state: state}
  , descriptor = {
      email: [
        {type: 'string', required: true, pattern: /^.+@.+\..+/},
        function parse(cb) {
          var at = this.value.indexOf('@')
            , user = this.value.substr(0, at)
            , domain = this.value.substr(at + 1);
          // assign to validation state
          this.state.email = {user: user, domain: domain};
          cb(); 
        },
        function lookup(cb) {
          function resolve(err, addr) {
            if(err && err.code === 'ENOTFOUND') {
              this.raise(
                '%s: could not resolve dns for domain %s',
                this.field,
                this.state.email.domain);
            }else if(err) {
              return cb(err); 
            }
            this.state.addr = addr;
            cb(); 
          }
          dns.resolve(this.state.email.domain, resolve.bind(this));
        }
      ]
    }
  // force dns failure with random domain
  , source = {email: 'foo@' + Date.now() + '.com'}
  , schema;

require('async-validate/plugin/all');

schema = new Schema(descriptor);
schema.validate(source, opts, function(err, res) {
  console.dir(res.errors);
});
```

```
[ { [Error: email: could not resolve dns for domain 1442469859410.com] field: 'email' } ]
```

#### type

* [doc/example/type](https://github.com/freeformsystems/async-validate/blob/master/doc/example/type.js).

```javascript
// validate a field type
var Schema = require('async-validate')
  , descriptor = {
      flag: {type: 'boolean', required: true}
    }
  , source = {flag: 'foo'}
  , schema;

require('async-validate/plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
```

```
[ { [Error: flag is not a boolean] field: 'flag', reason: { id: 'type' } } ]
```

#### whitespace

* [doc/example/whitespace](https://github.com/freeformsystems/async-validate/blob/master/doc/example/whitespace.js).

```javascript
// validate a field as whitespace
var Schema = require('async-validate')
  , descriptor = {
      name: {type: 'string', required: true, whitespace: true}
    }
  , source = {name: '  '}
  , schema;

require('async-validate/plugin/all');

schema = new Schema(descriptor);
schema.validate(source, function(err, res) {
  console.dir(res.errors);
});
```

```
[ { [Error: name cannot be empty] field: 'name', reason: { id: 'whitespace' } } ]
```

Generated by [mdp(1)](https://github.com/freeformsystems/mdp).

[node]: http://nodejs.org
[npm]: http://www.npmjs.org
[mdp]: https://github.com/freeformsystems/mdp
[browserify]: http://browserify.org/
[jshint]: http://jshint.com/
[jscs]: http://jscs.info/
[zephyr]: https://github.com/socialally/zephyr
