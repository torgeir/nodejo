(function() {

  var ListDisplay = function(conf) {
    this.list = document.createElement('ul');
    this.list.id = conf.id;
    conf.parent.appendChild(this.list);        
    this.conf = conf;              
  };
  ListDisplay.prototype = {
    append: function(el) {
      var li = document.createElement('li');
      li.className = this.conf.itemClass;
      li.appendChild(el);
      this.list.appendChild(li);
      return li;
    },
    remove: function(el) {
      this.list.removeChild(el);
    },
    clear: function() {
      this.list.innerHTML = '';
    }
  };
                                            
  var SnippetsWidget = function(display) {
    this.display = display;
  };
  SnippetsWidget.prototype = {
    add: function(key) {          
      var textNode = document.createTextNode(key);
      var item = this.display.append(textNode);
      var element = $(item);
      element.data('hash', key);
    }
  };

  var SnippetsManager = {
    createWidget: function(conf) {          
      conf = conf || {
        id: 'snippets-display',
        parent: $('div#snippets')[0],
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