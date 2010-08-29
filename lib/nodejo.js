var sys = require('sys');
var spawn = require('child_process').spawn;
var crypto = require('crypto');
var md5 = crypto.createHash('md5');
var fs = require('fs');

module.exports = {
  serveCode: function(code, fileCreatedCallback) {
    var fileName = '/tmp/nodejo_' + makeRandomFileName(); 
    createFileWithContents(fileName, code, function(err) {
      fileCreatedCallback(err, fileName);
    });
  },
  spawnNodeFromFile: function(file) {
    var node = spawn('node', [file]);
    return node;
  }
};
                      
var makeRandomFileName = function() {
  var rand = Math.random()*10000;
  md5.update(rand + new Date());
  return md5.digest('hex');
};  

var createFileWithContents = function(fileName, code, callback) {
  fs.writeFile(fileName, code, function (err) {
    callback(err);
  });
};