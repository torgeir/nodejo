(function() {

  var conn;
  var code = $('#code');
  var responseDiv = $('#coderesponse')[0]; 
  var submit; 
  
  if (window["WebSocket"]) {
    
    // Chrome, Safari
    var snippetsWidget = SnippetsManager.createWidget();
    
    conn = new WebSocket("ws://127.0.0.1:3000/");        
    socket.init(conn);
    $(document).unload(function() {
      conn.close();
    });
    
    submit = function() {
      socket.send(JSON.stringify({ code: editor.getCode() }));   
    };
 
    socket.onmessage = function(json) {   
      messageHandler.handle(json, {
        'codeStart': function() {
          responseDiv.innerHTML = '';
        },
        'codeChunk': function(chunk) {
          responseDiv.innerHTML = responseDiv.innerHTML + chunk;
        },
        'codeEnd': function() {
          responseDiv.innerHTML = '<pre>' + responseDiv.innerHTML + '</pre>';
        },
        'codeErr': function(err) {
          responseDiv.innerHTML = err;
        },
        'snippetAdd': function(snippet) {
          snippetsWidget.add(snippet.key, snippet.date);
        },
        'snippet': function(snippet) {         
          editor.setCode(snippet.code);
        }
      });
    };

    var fetchCodeFromHash = function() {    
      socket.send(JSON.stringify({ snippet: window.location.hash.replace('#', '') }));
    };
    window.onhashchange = fetchCodeFromHash;   
    setTimeout(function() {
      fetchCodeFromHash();
    }, 100);
  }  
  else {                           
    
    // Others
    
    submit = function() {               
      AjaxStream.request('/eval', 'code=' + encodeURIComponent(editor.getCode()), function(response) {
        responseDiv.innerHTML = response.responseText;
      });
    };
    
  }
             
  var runCodeOnCtrlEnter = function(event) {
    var isEnter = (event.keyCode == '13');
    if (event.ctrlKey && isEnter) {
      submit();
    }        
  };
  code.keyup(runCodeOnCtrlEnter);
  $(document).keyup(runCodeOnCtrlEnter);
  
  // Export                     
  this.nodejo = {
    run: runCodeOnCtrlEnter
  };
  
})();