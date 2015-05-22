var BPromise = require('bluebird');

module.exports = exports = function(obj, events) {
  var listeners = {},
    removeListeners,
    prom, res, rej, can;

  //Listener cleanup method
  removeListeners = function() {
    for(var ev in listeners) {
      obj.removeListener(ev, listeners[ev]);
    }
  };

  prom = new BPromise(function(resolve, reject) {
    // Handle the resolve event
    if(events.resolve) {
      res = function() {
        resolve.apply(this, arguments);
        removeListeners();
      };
      obj.once(events.resolve, res);
      removeListeners[events.resolve] = res;
    }

    //Handle the reject event
    if(events.reject) {
      rej = function() {
        reject.apply(this, arguments);
        removeListeners();
      };
      obj.once(events.reject, rej);
      removeListeners[events.reject] = rej;
    }
  });

  // Handle the cancel event
  if(events.cancel) {
    prom.cancellable();
    can = function() {
      prom.cancel.apply(prom, arguments);
      removeListeners();
    };
    obj.once(events.cancel, can);
    removeListeners[events.cancel] = can;
  }

  return prom;
};
