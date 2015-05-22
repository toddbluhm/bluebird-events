var BPromise = require('bluebird');

function EventsToArray(events) {
  var type = typeof events;
  if(type !== 'string' && !Array.isArray(events)) {
    throw new Error('Incorrect type provided. The given param must be either a String or Array');
  }

  if(type === 'string') {
    return [events];
  }
  return events;
}

module.exports = exports = function(obj, events) {
  var listeners = {},
    removeListeners,
    prom, res, rej, can,
    resEvents, rejEvents, canEvents;

  // Param Errors
  if(!obj || typeof obj.emit !== 'function') {
    throw new Error('Object passed in must inherit from require("events").EventEmitter!');
  }

  if(!events || typeof events !== 'object' || Array.isArray(events)) {
    throw new Error('Missing events object. Please pass in an events object with ' +
      'resolve/reject events');
  }

  if(!events.resolve && !events.reject && !events.cancel) {
    throw new Error('No proper event type specificed in events object! Please pass in atleast 1 ' +
      'specified event type: resolve, reject, or cancel.');
  }

  // Listener cleanup method
  removeListeners = function() {
    for(var ev in listeners) {
      obj.removeListener(ev, listeners[ev]);
    }
  };

  // Adds an array of events to the object with the given func
  addEventsToObj = function(events, func) {
    for(var i=0; i < events.length; i++) {
      obj.once(events[i], func);
      listeners[events[i]] = func;
    }
  };

  // Execute the given function and cleanup listeners
  executePromise = function(func, ctx) {
    return function() {
      func.apply(ctx || this, arguments);
      removeListeners();
    };
  };

  prom = new BPromise(function(resolve, reject) {
    // Handle the resolve event
    if(events.resolve) {
      resEvents = EventsToArray(events.resolve);

      addEventsToObj(resEvents, executePromise(resolve));
    }

    //Handle the reject event
    if(events.reject) {
      rejEvents = EventsToArray(events.reject);

      addEventsToObj(rejEvents, executePromise(reject));
    }
  });

  // Handle the cancel event
  if(events.cancel) {
    prom.cancellable();
    canEvents = EventsToArray(events.cancel);

    addEventsToObj(canEvents, executePromise(prom.cancel, prom));
  }

  return prom;
};

module.exports.EventsToArray = EventsToArray;
