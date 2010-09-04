var snippets = require('../lib/snippets');
module.exports = {     
  'should respond to add': function(assert) {
    assert.isDefined(snippets.add);
  },
  'should respond to get': function(assert) {
    assert.isDefined(snippets.get);     
  },
  'should respond to remove': function(assert) {
    assert.isDefined(snippets.remove);
  },
  'should save snippets': function(assert, beforeExit) {
    var code = 'something';
    var result;
    snippets.add(code, function(key) {
      snippets.get(key, function(code) {
        result = code;
      });
    });
    beforeExit(function() {
      assert.equal(code, result);
    });
  },
  'should remove snippets': function(assert, beforeExit) {
    var code = 'alert()';         
    var result = null;
    snippets.add(code, function(key) {
      snippets.remove(key, function() {
        snippets.get(key, function(snippet) {
          result = snippet;
        });
      });
    });   
    beforeExit(function() {
      assert.isUndefined(result);
    });
  }
};