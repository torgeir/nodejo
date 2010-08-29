var nodejowebsocket = require('../lib/nodejo.websocket');

module.exports = {
	'should serve code for websockets': function(assert, beforeExit) {
	  
    var actual = '';
    var code = "var sys = require('sys'); setTimeout(function() {sys.print('works');}, 100);";
    var websocketMockClient = {
      send : function(code) {
        actual += code;
      }
    };
    
    nodejowebsocket.serveCode(code, websocketMockClient);
    
    beforeExit(function() {
  		var expected = '{\"codeStart\":null}\{\"codeChunk\":\"works\"}\{\"codeEnd\":null}';
      assert.equal(expected, actual);
    });

  }
};
