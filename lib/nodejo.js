var sys = require('sys');
var spawn = require('child_process').spawn;
var crypto = require('crypto');
var md5 = crypto.createHash('md5');
var fs = require('fs');
                         
var attachEventListeners = function(node, client) {
  client.send(JSON.stringify({ codeStart: null }));
  node.stdout.on('data', function(data) {
    client.send(JSON.stringify({ codeChunk: data.toString() }));
  });
  node.stderr.on('data', function(data) {
    client.send(JSON.stringify({ codeErr: data.toString() }));
  });
  node.on('exit', function(exitCode) {
    client.send(JSON.stringify({ codeEnd: null }));
  });
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
}

var serveCode = function serveCode(code, client) {
  var fileName = '/tmp/nodejo_' + makeRandomFileName(); 
  createFileWithContents(fileName, code, function(err) {
    if (err) {
      return;
    }

    var node = spawn('node', [fileName]);
    attachEventListeners(node, client);
  });
};

var nodejo = {};
nodejo.handle = function(client) {
  client.addListener('message', function(message) {
    serveCode(message, client);
  });
}
module.exports = nodejo;