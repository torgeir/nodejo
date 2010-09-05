if (JSON === undefined) {
  throw 'MessageHandler: json.js is missing.';
}                                  
this.messageHandler = {
  handle: function(json, actions) {
    try {
      var message = JSON.parse(json);
      for(var key in message) {        
        var data = message[key];
        var action = actions[key];
        if (action) { 
          action(data);
        }
      }                                              
    } 
    catch (e) {
      throw 'Error parsing json: ' + e;
    }
  }
};