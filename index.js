var BPromise = require('bluebird')

function eventsToArray (events) {
  var type = typeof events
  if (type !== 'string' && !Array.isArray(events)) {
    throw new Error('Incorrect type provided. The given param must be either a String or Array')
  }

  if (type === 'string') {
    return [events]
  }
  return events
}

module.exports = exports = function (obj, events) {
  var listeners = {}
  var resolveEvents
  var rejectEvents

  // Param Errors
  if (!obj || typeof obj.emit !== 'function') {
    throw new Error('Object passed in must inherit from require("events").EventEmitter!')
  }

  // Default values
  events = events || {}
  if (!events.resolve &&
    typeof events.resolve !== 'boolean') {
    events.resolve = 'finish'
  }

  if (!events.reject &&
    typeof events.reject !== 'boolean') {
    events.reject = 'error'
  }

  // Listener cleanup method
  var removeListeners = function () {
    for (var ev in listeners) {
      obj.removeListener(ev, listeners[ev])
    }
  }

  // Adds an array of events to the object with the given func
  var addEventsToObj = function (events, func) {
    for (var i = 0; i < events.length; i++) {
      obj.once(events[i], func)
      listeners[events[i]] = func
    }
  }

  // Execute the given function and cleanup listeners
  var executePromise = function (func, ctx) {
    return function () {
      func.apply(ctx || this, arguments)
      removeListeners()
    }
  }

  var prom = new BPromise(function (resolve, reject) {
    // Handle the resolve event
    if (events.resolve) {
      resolveEvents = eventsToArray(events.resolve)

      addEventsToObj(resolveEvents, executePromise(resolve))
    }

    // Handle the reject event
    if (events.reject) {
      rejectEvents = eventsToArray(events.reject)

      addEventsToObj(rejectEvents, executePromise(reject))
    }
  })

  return prom
}

module.exports.eventsToArray = eventsToArray
