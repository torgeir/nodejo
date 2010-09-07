var nodejo = (function() {

  /* Web socket connection */
  var connection;
  
  /* Response html element  */
  var responseEl;
  
  /* Codemirror js-editor */
  var editor;                           
  
  /* Snippets widget */
  var snippets;
  
  var init = function(conf) {         
    responseEl  = $(conf.responseSelector);
    editor      = conf.editor;
    attachEventListeners();                                             
                                                                     
    // Only for those with websockets
    window['WebSocket'] && setupWebSocket(conf.wsurl);
    snippets = window['WebSocket'] && SnippetsManager.createWidget();
  };

  var setupWebSocket = function(url) {  
    connection = new WebSocket(url);
    connection.onopen = fetchCodeFromHash;
    // conn.onclose = function() {};
    connection.onmessage = function(e) {
      var json = e.data;
      handleMessage(json);
    };
    $(document).unload(function() {
      connection.close();
    });         
  };                                   

  var attachEventListeners = function() {
    window.onhashchange = fetchCodeFromHash;   
    $(document).keyup(runCodeOnCtrlEnter);
    $(editor.win).keyup(runCodeOnCtrlEnter)
  };                                 
        
  var fetchCodeFromHash = function() {    
    var hash = window.location.hash;
    if (connection && hash) {
      connection.send(JSON.stringify({ snippet: hash.replace('#', '') }));
    }   
  };    
  
  var runCodeOnCtrlEnter = function(event) {  
    var isEnter = (event.keyCode == '13');
    if (event.ctrlKey && isEnter) {
      submitCode();
    }        
  };                        
  
  var submitCode = function() {
    var code = editor.getCode(); 
    if (connection) {
      connection.send(JSON.stringify({ code: code }));
    }           
    else {
      AjaxStream.request('/eval', 'code=' + encodeURIComponent(code), function(response) {
        responseEl.html(response.responseText);
      });
    }
  };         
                                     
  var handleMessage = function(json) {
    messageHandler.handle(json, {
      'codeStart': function() {
        responseEl.html('');
      },
      'codeChunk': function(chunk) {
        responseEl.append(chunk);
      },
      'codeEnd': function() {
        responseEl.html('<pre>' + responseEl.html() + '</pre>');
      },
      'codeErr': function(err) {
        responseEl.html(err);
      },
      'snippetAdd': function(snippet) {
        snippets.add(snippet.key, snippet.date);
      },
      'snippet': function(snippet) {         
        editor.setCode(snippet.code);
      }
    });
  };
                              
  return {
    init: init
  };               
  
})();