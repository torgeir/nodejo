var nodejo = require('./nodejo');    
var ws = require('../vendor/websocket-server/lib/ws');
var snippets = require('./snippets');

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
             
var broadcastSnippet = function(snippet, client) {
  snippets.add(snippet, function(key) {     
    if (key) {
      var message = JSON.stringify({ snippetAdd: key });
      client.send(message);
      client.broadcast(message);
    }
  });
};

module.exports = {
  configure: function(app) {
    var socket = ws.createServer({ server: app });
    socket.addListener("listening", function(){});
    socket.addListener('close', function(client) {});
    socket.addListener('connection', function(client) {
      client.addListener('message', function(json) {    
        try {
          var message = JSON.parse(json);
          for (var key in message) {
            var data = message[key];      
            switch (key) {
              case 'code': 
                serveCode(data, client);
                broadcastSnippet(data, client);
              break;  
              case 'snippet':                     
                snippets.get(data, function(snippet) {   
                  client.send(JSON.stringify({ 'snippet' : snippet }));
                });
              break;
              default:
                throw "Operation '" + key + "' not supported.";
              break;
            }
          }
        } catch (e) {
          console.log('Could not parse json from client');
        }
      });
    });
  },
  serveCode: serveCode
};