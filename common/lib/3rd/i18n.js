(function (w){
  "use strict";
  var that = w.i18n = {};

  function noop(){
  };

  function extend(){
    var r = {};
    for ( var i = 0; i < arguments.length; i++ ) {
      for ( var j in arguments[i] ) {
        if ( arguments[i].hasOwnProperty(j) ) {
          r[j] = arguments[i][j];
        }
      }
    }
    return r;
  }

  that.getMessage = noop;

  that.observer = null;

  that.config = {
    attributes     : true,
    attributeFilter: ["title"],
    childList      : true,
    subtree        : true
  };

  that.replaceOpts = {
    content         : true,
    attr            : true,
    includeChilds   : true,
    ignoreAttributes: ["id", "style", "src"],
    ignoreElements  : ["SCRIPT", "TEXTAREA", "STYLE"]
  };

  /**
   * shortcuts
   */
  var slice = Array.prototype.slice
    , CHILDLIST = "childList"
    , ATTRIBUTES = "attributes"
    , ELEMENT = Node.ELEMENT_NODE
    , TEXTNODE = Node.TEXT_NODE;

  /**
   * Watch for element's html change
   * @param el {HTMLElement}
   * @public
   */
  that.observe = function (el){
    that._observe(el, that.mutationHandler);
  };

  /**
   * Call given `fn` when `target` have changed
   * @param target {HTMLElement}
   * @param fn {Function}
   * @private
   */
  that._observe = function (target, fn){
    var MutationObserver = w.MutationObserver || w.WebKitMutationObserver
      , observeTarget = target || document.body;

    if ( MutationObserver ) {
      that.observer = new MutationObserver(fn);
      that.observer.observe(observeTarget, that.config);
    } else {
      throw new Error("Browser does not support MutationObserver");
    }
  };

  /**
   * @public
   */
  that.stop = function (){
    that.observer && that.observer.disconnect();
  };

  /**
   * Replace `i18n` placeholders with the values for the given `el` html
   * @param el {HTMLElement}
   * @private
   */
  that.replace = function (el, opts){
    var textNodes
      , attributes
      , content;

    opts = extend(that.replaceOpts, opts);

    if ( opts.content ) {
      textNodes = that.findTextNodes(el, opts.ignoreElements);
      for ( var i = 0, il = textNodes.length; i < il; i++ ) {
        content = that.replacei18nMessage(textNodes[i].nodeValue);
        if ( content !== textNodes[i].nodeValue ) {
          textNodes[i].nodeValue = content;
        }
      }
    }
    if ( opts.attr ) {
      attributes = that.findAttributes(el, opts.ignoreAttributes, opts.includeChilds);
      for ( var j = 0, jl = attributes.length; j < jl; j++ ) {
        content = that.replacei18nMessage(attributes[j].value);
        if ( content !== attributes[j].value ) {
          attributes[j].value = content;
        }
      }
    }
  };

  /**
   *
   * @param mutations {Array}
   * @private
   */
  that.mutationHandler = function (mutations){
    for ( var i = 0; i < mutations.length; i++ ) {

      var m = mutations[i];

      if ( m.type === CHILDLIST ) {
        var addedNodes = m.addedNodes;
        for ( var j = 0; j < addedNodes.length; j++ ) {
          that.replace(addedNodes[j], { content: true, attr: true });
        }
      }

      if ( m.type === ATTRIBUTES ) {
        that.replace(m.target, { content: false, attr: true, includeChilds: false });
      }
    }
  };

  that.setGetMessageFn = function (fn){
    that.getMessage = fn;
  }

  /**
   * Replace messages placeholders with the values for the given `text`
   * @param text {String}
   * @private
   * @return {String}
   */
  that.replacei18nMessage = function (text){
    var replace = function (str, $1){
      return that.getMessage($1);
    };

    return text.replace(/__MSG_([\w_@]+)__/g, replace);
  };


  /**
   *
   * @param el {HTMLElement}
   * @param ignoreAttributes {Array}
   * @returns {Array}
   */
  that.findAttributes = function (el, ignoreAttributes, includeChilds){
    var attrs = [];

    //element node
    if ( ELEMENT === el.nodeType ) {
      if ( el.attributes ) {
        for ( var i = 0, il = el.attributes.length; i < il; i++ ) {
          var curAttr = el.attributes[i];
          if ( !~ignoreAttributes.indexOf(curAttr.name) ) {
            attrs.push(curAttr);
          }
        }
      }

      if ( includeChilds ) {
        for ( var child = el.firstChild; child !== null; child = child.nextSibling ) {
          attrs = attrs.concat(that.findAttributes(child, ignoreAttributes, includeChilds));
        }
      }
    }

    return attrs;
  };

  /**
   *
   * @param el {HTMLElement}
   * @param ignoreElements {Array}
   * @returns {Array}
   */
  that.findTextNodes = function (el, ignoreElements){
    var nodes = [];

    if ( TEXTNODE === el.nodeType ) {
      return [el];
    }

    if ( ELEMENT === el.nodeType && !~ignoreElements.indexOf(el.tagName) ) {
      for ( var child = el.firstChild; child !== null; child = child.nextSibling ) {
        nodes = nodes.concat(that.findTextNodes(child, ignoreElements));
      }
    }
    return nodes;
  };

})(window);