[![Circle CI](https://img.shields.io/circleci/project/L7labs/sinon-bluebird.svg)](https://circleci.com/gh/L7labs/bluebird-events)
[![PeerDependencies](https://img.shields.io/david/peer/L7Labs/sinon-bluebird.svg)](https://github.com/L7labs/sinon-bluebird/blob/master/package.json)

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
var bluebirdEvents = require('bluebird-events');

var someEmitter = new TestEmitter();

var promise = blueBirdEvents(someEmitter, {
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

Dependencies
---
This library is dependent upon `bluebird`, but because `bluebird` is so common, there is no need to install it multiple times so `bluebird` is declared as a `peerDependency`

*Note: `bluebird` is also declared as a `devDependency` for running the test suite*
