Bluebird-Events
===

Install
---
`npm install bluebird-events`

Usage
---

```js
var blueBirdEvents = require('bluebird-events');

var someEmitter = new TestEmitter();

var promise = blueBirdEvents(someEmitter, {
  resolve: 'success-event-name',
  reject: 'error-event-name',
  cancel: 'cancel-event-name' // by passing cancel the promise is made cancelable
});

someEmitter.emit('success-event-name'); // promise is now resolved

someEmitter.emit('error-event-name', new Error('Some Error Occurred!!!')); // promise now rejected with the given error

```

Dependencies
---
This library is dependent upon `bluebird`, as such `bluebird` is a `peerDependency`

*Note: `bluebird` is a `devDependency` for running the test suite*
