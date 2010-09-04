var crypto = require('crypto');

var snippets = {};

var createKey = function(input) {
  var md5 = crypto.createHash('md5');
  md5.update(input);
  return md5.digest('hex');
};

module.exports = {
  add: function(snippet, callback) {
    process.nextTick(function() {
      var key = createKey(snippet);
      if (snippets[key]) {
        callback();
      }           
      else {
        snippets[key] = snippet;
        callback(key);
      }
    });
  },
  remove: function(key, callback) {
    process.nextTick(function() {
      delete snippets[key];
      callback();
    });
  },
  get: function(key, callback) {
    process.nextTick(function() {
      var snippet = snippets[key];
      callback(snippet);
    });
  }
};