var BPromise = require('bluebird');

function eventsToArray(events) {
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
    resolveEvents,
    rejectEvents,
    cancelEvents;

  // Param Errors
  if(!obj || typeof obj.emit !== 'function') {
    throw new Error('Object passed in must inherit from require("events").EventEmitter!');
  }

  if(!events || typeof events !== 'object' || Array.isArray(events)) {
    throw new Error('Missing events object. Please pass in an events object with ' +
      'resolve/reject events');
  }

  if(!events.resolve && !events.reject && !events.cancel) {
    throw new Error('No valid event type specified in events object! Please pass in at least ' +
      'one of the specified event types: resolve, reject, or cancel.');
  }

  // Listener cleanup method
  var removeListeners = function() {
    for(var ev in listeners) {
      obj.removeListener(ev, listeners[ev]);
    }
  };

  // Adds an array of events to the object with the given func
  var addEventsToObj = function(events, func) {
    for(var i=0; i < events.length; i++) {
      obj.once(events[i], func);
      listeners[events[i]] = func;
    }
  };

  // Execute the given function and cleanup listeners
  var executePromise = function(func, ctx) {
    return function() {
      func.apply(ctx || this, arguments);
      removeListeners();
    };
  };

  var prom = new BPromise(function(resolve, reject) {
    // Handle the resolve event
    if(events.resolve) {
      resolveEvents = eventsToArray(events.resolve);

      addEventsToObj(resolveEvents, executePromise(resolve));
    }

    // Handle the reject event
    if(events.reject) {
      rejectEvents = eventsToArray(events.reject);

      addEventsToObj(rejectEvents, executePromise(reject));
    }
  });

  // Handle the cancel event
  if(events.cancel) {
    prom.cancellable();
    cancelEvents = eventsToArray(events.cancel);

    addEventsToObj(cancelEvents, executePromise(prom.cancel, prom));
  }

  return prom;
};

module.exports.eventsToArray = eventsToArray;
