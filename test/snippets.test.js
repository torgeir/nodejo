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
    snippets.add(code, function(snippet) {
      snippets.get(snippet.key, function(snippet) {
        result = snippet.code;
      });
    });
    beforeExit(function() {
      assert.equal(code, result);    
    });
  },
  'should remove snippets': function(assert, beforeExit) {
    var code = 'alert()';         
    var result = null;
    snippets.add(code, function(snippet) {
      snippets.remove(snippet.key, function() {
        snippets.get(snippet.key, function(snippet) {
          result = snippet;
        });
      });
    });   
    beforeExit(function() {
      assert.isUndefined(result);
    });
  },
  'should be able to loop snippets': function(assert, beforeExit) {
    var res = '';  
    snippets.add('1', function() {
      snippets.add('2', function() {
        snippets.each(function(snippet) {
          res += snippet.code;
        });
      });
    });    
    beforeExit(function() {     
      assert.ok(res.match(/1/));
      assert.ok(res.match(/2/));
    });
  }
};