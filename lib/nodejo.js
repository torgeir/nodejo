var sys = require('sys');
var spawn = require('child_process').spawn;
var crypto = require('crypto');
var fs = require('fs');

var scripts = [];

module.exports = {
  serveCode: function(code, fileCreatedCallback) {
    var fileName = '/tmp/nodejo_' + makeRandomFileName(); 
    createFileWithContents(fileName, code, function(err) {
      fileCreatedCallback(err, fileName);
    });
  },
  spawnNodeFromFile: function(file) {
    var node = spawn('node', [file]);
    node.on('exit', function() {
      fs.unlink(file);
    });
    scripts.push({ process: node, time: new Date().getTime() });
    return node;
  }
};
                      
var makeRandomFileName = function() {
  var md5 = crypto.createHash('md5');
  var rand = Math.random()*10000;
  md5.update(rand + new Date());
  return md5.digest('hex');
};  

var createFileWithContents = function(fileName, code, callback) {
  fs.writeFile(fileName, code, function (err) {
    callback(err);
  });
};
                         
// TODO: make work with tests
/*
var purgeTimeout = 1000 * 60;
setInterval(function() {
  for (var i = scripts.length - 1; i >= 0; i--){
    var script = scripts[i];
    if (script.time + purgeTimeout < new Date().getTime()) {
      script.process.kill();
      scripts.splice(i, 1);
    }
  };
}, 1000);
*/
