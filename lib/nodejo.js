var sys = require('sys');
var spawn = require('child_process').spawn;
var crypto = require('crypto');
var md5 = crypto.createHash('md5');
var fs = require('fs');

var nodejo = {};
nodejo.handleWebsocketConnection = function(client) {
  client.addListener('message', function(code) {
    serveCode(code, function(err, fileName) {
      if (err) {
        return;
      }
      var node = spawnNodeWithFile(fileName);
      attachWebsocketEventListeners(node, client);
    });
  });
};
nodejo.routes = {
  eval: function(req, res) {
    var code = req.body && req.body.code;
    if (code) {
      serveCode(code, function(err, fileName) {
        if (err) {
          res.send(500);
        }
        var node = spawnNodeWithFile(fileName);
        attachPostEventListeners(node, res);
      });
    }            
    else {
      res.send(204);
    }
  }
}

var serveCode = function serveCode(code, fileCreatedCallback) {
  var fileName = '/tmp/nodejo_' + makeRandomFileName(); 
  createFileWithContents(fileName, code, function(err) {
    fileCreatedCallback(err, fileName);
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

var spawnNodeWithFile = function(file) {
  var script = spawn('node', [file]);
  return script;
};

var attachWebsocketEventListeners = function(node, client) {
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

var attachPostEventListeners = function(node, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  node.stdout.on('data', function(data) {
    res.write(data.toString());
  });
  node.stderr.on('data', function(data) {
    res.write(data.toString());
  });
  node.on('exit', function(exitCode) {
    res.end();
  });
};

module.exports = nodejo;