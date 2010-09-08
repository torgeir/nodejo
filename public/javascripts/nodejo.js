var nodejo = (function() {

  /* Web socket connection */
  var connection;
  
  /* Response html element  */
  var responseEl;
  
  /* Codemirror js-editor */
  var editor;                           
  
  /* Snippets widget */
  var snippets;
                
  var nameEl;
  
  var init = function(conf) {         
    responseEl  = $(conf.responseSelector);
    nameEl      = $(conf.nameSelector);
    editor      = conf.editor;
    attachEventListeners();                                             
                                                                     
    // Only for those with websockets
    window['WebSocket'] && setupWebSocket(conf.wsurl);
    snippets = window['WebSocket'] && SnippetsManager.createWidget();
  };

  var setupWebSocket = function(url) {  
    connection = new WebSocket(url);
    connection.onopen = fetchCodeFromHash;
    connection.onclose = function() {
      
    };
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
    var nameWithoutHtml = nameEl.html().replace(/<\/?[^>]+>/gi, '');
    if (connection) {
      connection.send(JSON.stringify({ code: { text: code, name: nameWithoutHtml } }));
    }           
    else {
      AjaxStream.request('/eval', 'code=' + encodeURIComponent(code), function(response) {
        responseEl.html(response.responseText);
      });
    }
  };         
                 
  var escapeHTML = function(html) {
    var div = document.createElement('div');
    var textNode = document.createTextNode(html);
    div.appendChild(textNode);
    return div.innerHTML;
  };
                                     
  var handleMessage = function(json) {
    messageHandler.handle(json, {
      'codeStart': function() {
        responseEl.html('');
      },
      'codeChunk': function(chunk) {
        responseEl.append(escapeHTML(chunk));
      },
      'codeEnd': function() {},
      'codeErr': function(err) {
        responseEl.html(escapeHTML(err));
      },
      'snippetAdd': function(snippet) {
        snippets.add(snippet.key, snippet.date, snippet.name);
      },
      'snippet': function(snippet) {   
        try {
          editor.setCode(snippet.code);
        } catch (e) {
          // fail silently
        }
      },
      'moveCursorToLine': function(line) {
        try {
          editor.jumpToLine(editor.nthLine(line));
        } catch (e) {
          // fail silently
        }
      }
    });
  };
                              
  return {
    init: init
  };               
  
})();