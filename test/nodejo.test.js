var nodejo = require('../lib/nodejo');
var fs = require('fs');
var path = require('path');

module.exports = {
  'should remove tmp file after run' : function(assert, beforeExit) {
    var filePath = '/tmp/nodejs_removal_test.js';
    var fileIsRemoved = false;

    fs.writeFile(filePath, '// noop', function(err) {
      var node = nodejo.spawnNodeFromFile(filePath);  
      node.on('exit', function() {
	path.exists(filePath, function(exists) {
	  fileIsRemoved = !exists;
	});
      });
    });

    beforeExit(function() {
      assert.ok(fileIsRemoved);
    });
  }
}
