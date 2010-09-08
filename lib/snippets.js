var crypto = require('crypto');

var snippets = {};

var createKey = function(input) {
  var md5 = crypto.createHash('md5');
  md5.update(input);
  return md5.digest('hex');
};

module.exports = {
  add: function(code, name, callback) {
    process.nextTick(function() {
      var key = createKey(code + name);
      if (snippets[key]) {
        callback();
      }           
      else {
        var snippet = {
          key: key,
          date : new Date().getTime(),
          code: code,
          name: name
        };
        snippets[key] = snippet;
        callback(snippet);
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
  },
  each: function(callback) {
    process.nextTick(function() {
      for (var key in snippets) {
        process.nextTick(function(key) {
          return function() {
            var snippet = snippets[key];
            callback(snippet);
          };
        }(key));
      }    
    });
  },
  removeAll: function() {
    snippets = {};
  }
};