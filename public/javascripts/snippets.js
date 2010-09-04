(function() {

  var ListDisplay = function(id, parent) {
    this.list = document.createElement('ul');
    this.list.id = id;
    parent.appendChild(this.list);                      
  };
  ListDisplay.prototype = {
    append: function(el) {
      var li = document.createElement('li');
      li.className = 'item';
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
                                            
  var SnippetsWidget = function(display, conf) {
    this.display = display;
    this.conf = conf;
  };
  SnippetsWidget.prototype = {
    add: function(key) {          
      var textNode = document.createTextNode(key);
      var el = this.display.append(textNode);
      $(el).data('hash', key);
    }
  };

  var SnippetsManager = {
    createWidget: function(conf) {          
      conf = conf || {
        id: 'snippets',
        parent: $('div#snippets')
      };                                                      
               
      if (!conf.parent.length) {
        throw 'SnippetsManager: you need to provide a parent';
      }                 

      $('.item').live('click', function(item) {
        var li = $(item.target);
        window.location.hash = li.data('hash');
      });

      var display = new ListDisplay(conf.id + '-display', conf.parent[0]);
      var snippetsWidget = new SnippetsWidget(display, conf);
      return snippetsWidget;
    }
  };                                                       
  
  window.SnippetsManager = SnippetsManager;                 
  
})();