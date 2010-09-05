var nodejo = require('./nodejo');    
var ws = require('../vendor/websocket-server/lib/ws');
var snippets = require('./snippets');
var messageHandler = require('./messageHandler').messageHandler;

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
  snippets.add(snippet, function(snippet) {     
    if (snippet) {
      var message = JSON.stringify({ snippetAdd: snippet });
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
      
      snippets.each(function(snippet) {            
        client.send(JSON.stringify({ 'snippetAdd': snippet }));
      });
      
      client.addListener('message', function(json) {    
        messageHandler.handle(json, {
           'code': function(data) {
             serveCode(data, client);
             broadcastSnippet(data, client);
           },
           'snippet': function(data) {    
             snippets.get(data, function(snippet) {   
               client.send(JSON.stringify({ 'snippet' : snippet }));
             });
           }
        });
      });
    });
  },
  serveCode: serveCode
};