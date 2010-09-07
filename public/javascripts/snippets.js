(function() {                        

  var ListDisplay = function(conf) {
    var list = $('<ul></ul>');
    var parent = $(conf.parent);
    this.itemClass = conf.itemClass;
    list.id = conf.id;
    this.list = $(list);
    parent.append(list);        
  };
  
  ListDisplay.prototype = {
    prepend: function(el) {
      var li = $('<li></li>');
      li.addClass(this.itemClass);
      li.append(el);                       
      li.fadeIn(1000);
      this.list.prepend(li);
      return li;
    }
  };
                                                       
  var formatDate = function(date) {
    date = new Date(date) || new Date();
    
    var format = function(date) {
      return date < 10 ? '0' + date : date;
    };
    
    return [
      format(date.getHours()),
      ':',
      format(date.getMinutes()),
      ':',
      format(date.getSeconds())
    ].join('');
  }
                                            
  var SnippetsWidget = function(display) {
    this.display = display;
  };
  SnippetsWidget.prototype = {
    add: function(key, date) {   
      var textNode = document.createTextNode(formatDate(date));
      var li = this.display.prepend(textNode);
      li.data('hash', key);
    }
  };

  var SnippetsManager = {
    createWidget: function(conf) {          
      conf = conf || {
        id: 'snippets-display',
        parent: '#snippets',
        itemClass: 'item'
      };                                                      
               
      if (!conf.parent) {    
        throw 'SnippetsManager: you need to provide a parent';
      }                 

      $('.' + conf.itemClass).live('click', function(item) {  
        var li = $(item.target);
        window.location.hash = li.data('hash');
      });

      var display = new ListDisplay(conf);
      var snippetsWidget = new SnippetsWidget(display);
      return snippetsWidget;
    }
  };                                                       
  
  window.SnippetsManager = SnippetsManager;                 
  
})();