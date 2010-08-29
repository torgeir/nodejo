var nodejo = require('./nodejo');    
var ws = require('../vendor/websocket-server/lib/ws');

var serveCode = function(code, client) {
  nodejo.serveCode(code, function(err, fileName) {
    if (err) {
      return;
    }
    var node = nodejo.spawnNodeFromFile(fileName);
    attachEventListeners(node, client);
  });
};

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

module.exports = {
  configure: function(app) {
    var socket = ws.createServer({ server: app });
    socket.addListener("listening", function(){});
    socket.addListener('close', function(client) {});
    socket.addListener('connection', function(client) {
      client.addListener('message', function(code) {
        serveCode(code, client);
      });
    });
  },
  serveCode: serveCode
};