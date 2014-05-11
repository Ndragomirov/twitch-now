(function ( w ) {
    "use strict";
    var that = w.i18n = {};

    that.observer = null;
    that.config = {
        attributes: true,
        childList : true,
        subtree   : true
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
    that.observe = function ( el ) {
        that._observe( el, that.mutationHandler );
    };

    /**
     * Call given `fn` when `target` have changed
     * @param target {HTMLElement}
     * @param fn {Function}
     * @private
     */
    that._observe = function ( target, fn ) {
        var MutationObserver = w.MutationObserver || w.WebKitMutationObserver
            , observeTarget = target || document.body;

        if ( MutationObserver ) {
            that.observer = new MutationObserver( fn );
            that.observer.observe( observeTarget, that.config );
        } else {
            throw new Error( "Browser does not support MutationObserver" );
        }
    };

    /**
     * @public
     */
    that.stop = function () {
        that.observer && that.observer.disconnect();
    };

    /**
     * Replace `i18n` placeholders with the values for the given `el` html
     * @param el {HTMLElement}
     * @private
     */
    that.replace = function ( el, opts ) {
        var textNodes
            , attributes
            , content;

        opts = opts || {content: true, attr: true};

        if ( opts.content ) {
            textNodes = that.findTextNodes( el );
            for ( var i = 0; i < textNodes.length; i++ ) {
                content = that.replacei18nMessage( textNodes[i].nodeValue );
                if ( content !== textNodes[i].nodeValue ) {
                    textNodes[i].nodeValue = content;
                }
            }
        }
        if ( opts.attr ) {
            attributes = that.findAttributes( el );
            for ( var j = 0; j < attributes.length; j++ ) {
                content = that.replacei18nMessage( attributes[j].value );
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
    that.mutationHandler = function ( mutations ) {
        for ( var i = 0; i < mutations.length; i++ ) {

            var m = mutations[i];

            if ( m.type === CHILDLIST ) {
                var addedNodes = m.addedNodes;
                for ( var j = 0; j < addedNodes.length; j++ ) {
                    that.replace( addedNodes[j], {content: true, attr: true } );
                }
            }

            if ( m.type === ATTRIBUTES ) {
                that.replace( m.target, {attr: true} );
            }
        }
    };

    /**
     * Replace messages placeholders with the values for the given `text`
     * @param text {String}
     * @private
     * @return {String}
     */
    that.replacei18nMessage = function ( text ) {
        var replace = function ( str, $1 ) {
            return chrome.i18n.getMessage( $1 );
        };

        return text.replace( /__MSG_([\w_@]+)__/g, replace );
    };


    /**
     * @param el {HTMLElement}
     * @private
     * @return {Array}
     */
    that.findAttributes = function ( el ) {
        var attrs = [];

        //element node
        if ( ELEMENT === el.nodeType ) {
            if ( el.attributes ) {
                attrs = attrs.concat( slice.call( el.attributes, 0 ) );
            }

            for ( var child = el.firstChild; child !== null; child = child.nextSibling ) {
                attrs = attrs.concat( that.findAttributes( child ) );
            }
        }

        return attrs;
    };

    /**
     * @param el {HTMLElement}
     * @private
     * @return {Array}
     */
    that.findTextNodes = function ( el ) {
        var nodes = []
            , ignoreTags = ["SCRIPT", "TEXTAREA", "STYLE"];

        if ( TEXTNODE === el.nodeType ) {
            return [el];
        }

        if ( ELEMENT === el.nodeType && ignoreTags.indexOf( el.tagName ) === -1 ) {
            for ( var child = el.firstChild; child !== null; child = child.nextSibling ) {
                nodes = nodes.concat( that.findTextNodes( child ) );
            }
        }
        return nodes;
    };

})( window );