function id(opts, cb) {
  var re = /^[^-][a-zA-Z0-9-]+$/;
  if(!re.test(this.value)) {
    this.raise(this.rule, '%s is not a valid identifier', this.rule.field);
  }
  cb(this.errors);
}

module.exports = function() {
  // add static `id` type method
  this.main.id = id;
}