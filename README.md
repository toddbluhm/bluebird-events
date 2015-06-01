[![Circle CI](https://img.shields.io/circleci/project/L7labs/bluebird-events.svg)](https://circleci.com/gh/L7labs/bluebird-events)
[![NPM version](https://img.shields.io/npm/v/bluebird-events.svg)](https://www.npmjs.com/package/bluebird-events)
[![PeerDependencies](https://img.shields.io/david/peer/L7Labs/bluebird-events.svg)](https://github.com/L7labs/bluebird-events/blob/master/package.json)
[![Downloads](http://img.shields.io/npm/dm/bluebird-events.svg?style=flat)](https://www.npmjs.com/package/bluebird-events)

Bluebird-Events
===

This package wraps an [event emitter](https://nodejs.org/api/events.html#events_class_events_eventemitter) object and returns a [bluebird](https://github.com/petkaantonov/bluebird) promise that is either resolved, rejected, or canceled based on what events are fired from the emitter.

Installation
---
`npm install bluebird-events`

Optionally run tests:

`npm test`

Usage
---

```js
var promisify = require('bluebird-events');

var someEmitter = new TestEmitter();

var promise = promisify(someEmitter, {
  resolve: 'success-event-name',
  reject: ['error-event-name', 'error-event-name-2'],
  cancel: 'cancel-event-name' // by passing cancel the promise is made cancelable
});

// Will resolve the promise
someEmitter.emit('success-event-name');

// Will reject the promise with the given error
someEmitter.emit('error-event-name', new Error('Some Error Occurred!'));

// Will also reject the promise with the given error
someEmitter.emit('error-event-name-2', new Error('Some Other Error Occurred!'));
```

API
---

**promisify(emitter, events)**

`emitter`[`Object`] - Some object that can emit events (usually inherited from [Events.EventEmitter](https://nodejs.org/api/events.html#events_class_events_eventemitter))

`events`[`Object`] - Contains a mapping of events to listen for

`events.resolve`[`String`,`Array of Strings` or `Boolean`] - The name for the event that will cause the promise to resolve (defaults to: `'finish'`)

`events.reject`[`String`,`Array of Strings` or `Boolean`] - The name for the event that will cause the promise to reject (defaults to: `'error'`)

`events.cancel`[`String` or `Array of Strings`] - The name for the event that will cause the promise to cancel (defaults to: `null`).
*If used, this will mark the promise chain as [cancelable](https://github.com/petkaantonov/bluebird/blob/master/API.md#cancellation)*

Returns bluebird promise

*Note: To disable listening for all resolve or reject events (including default and custom events) just pass in `false` for the resolve/reject value.*
```js
// This promise cannot be resolve successfully via an emitted event
// But it can be rejected via the default 'error' event
promisify(emitter, {resolve: false});
```


Dependencies
---
This library is dependent upon `bluebird`, but because `bluebird` is so common, there is no need to install it multiple times so `bluebird` is declared as a `peerDependency`

*Note: `bluebird` is also declared as a `devDependency` for running the test suite*

## Contributers

- [Brian Moeskau](https://github.com/bmoeskau)

- [Kevin Moritz](https://github.com/ecorkevin)

## License

**MIT**

Copyright &copy; 2015 Level Seven

Authored by [Todd Bluhm](https://github.com/toddbluhm)
