Utils = {};

Utils.viewMixin = function (from) {
  var to = this.prototype;

  // we add those methods which exists on `from` but not on `to` to the latter
  _.defaults(to, from);
  // … and we do the same for events
  _.defaults(to.events, from.events);

  // we then extend `to`'s `initialize`
  Utils.extendMethod(to, from, "initialize");
  // … and its `render`
  Utils.extendMethod(to, from, "render");
};

// Helper method to extend an already existing method
Utils.extendMethod = function (to, from, methodName) {

  // if the method is defined on from ...
  if ( !_.isUndefined(from[methodName]) ) {
    var old = to[methodName];

    // ... we create a new function on to
    to[methodName] = function () {

      // wherein we first call the method which exists on `to`
      var oldReturn = old.apply(this, arguments);

      // and then call the method on `from`
      from[methodName].apply(this, arguments);

      // and then return the expected result,
      // i.e. what the method on `to` returns
      return oldReturn;

    };
  }

};

Backbone.Collection.mixin = Utils.viewMixin;