[![Travis CI](https://img.shields.io/travis/toddbluhm/bluebird-events.svg)](https://travis-ci.org/toddbluhm/bluebird-events)
[![Coveralls](https://img.shields.io/coveralls/toddbluhm/bluebird-events.svg?maxAge=2592000)](https://coveralls.io/github/toddbluhm/bluebird-events)
[![NPM version](https://img.shields.io/npm/v/bluebird-events.svg)](https://www.npmjs.com/package/bluebird-events)
[![Downloads](http://img.shields.io/npm/dm/bluebird-events.svg?style=flat)](https://www.npmjs.com/package/bluebird-events)
[![NPM license](https://img.shields.io/npm/l/bluebird-events.svg?maxAge=2592000)](https://www.npmjs.com/package/bluebird-events)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)


# Bluebird-Events

This package wraps an [event emitter](https://nodejs.org/api/events.html#events_class_events_eventemitter) object and returns a [bluebird](https://github.com/petkaantonov/bluebird) promise that is either resolved, or rejected based on what events are fired from the emitter.

**Note: Bluebird-Events v2.x is NOT backwards compatible with v1.x see [changelog](https://github.com/toddbluhm/bluebird-events/blob/master/CHANGELOG.md) for details**

## Installation

`npm install bluebird-events`

Optionally run tests:

`npm test`

## Usage

```js
var promisify = require('bluebird-events')

var someEmitter = new TestEmitter()

var promise = promisify(someEmitter, {
  resolve: 'success-event-name',
  reject: ['error-event-name', 'error-event-name-2']
})

// Will resolve the promise
someEmitter.emit('success-event-name')

// Will reject the promise with the given error
someEmitter.emit('error-event-name', new Error('Some Error Occurred!'))

// Will also reject the promise with the given error
someEmitter.emit('error-event-name-2', new Error('Some Other Error Occurred!'))
```

## API

#### promisify(emitter, events)

`emitter`[`Object`] - Some object that can emit events (usually inherited from [Events.EventEmitter](https://nodejs.org/api/events.html#events_class_events_eventemitter))

`events`[`Object`] - Contains a mapping of events to listen for

`events.resolve`[`String`, `Array of Strings`, or `Boolean`] - The name for the event that will cause the promise to resolve (defaults to: `'finish'`)

`events.reject`[`String`, `Array of Strings`, or `Boolean`] - The name for the event that will cause the promise to reject (defaults to: `'error'`)

**Returns** - a bluebird promise

*Note: To disable listening for all resolve or reject events (including default and custom events) just pass in `false` for the resolve/reject value.*
```js
// This promise cannot be resolve successfully via an emitted event
// But it can be rejected via the default 'error' event
promisify(emitter, {resolve: false});
```


## Dependencies

This library is dependent upon `bluebird`, but because `bluebird` is so common, there is no need to install it multiple times so `bluebird` is declared as a `peerDependency`

*Note: `bluebird` is also declared as a `devDependency` for running the test suite*

## Contributors

- [Brian Moeskau](https://github.com/bmoeskau)
- [Kevin Moritz](https://github.com/mayorbyrne)

## License

**MIT**
