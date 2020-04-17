[![Travis CI](https://img.shields.io/travis/toddbluhm/bluebird-events.svg)](https://travis-ci.org/toddbluhm/bluebird-events)
[![Coverage Status](https://badgen.net/coveralls/c/github/toddbluhm/bluebird-events)](https://coveralls.io/github/toddbluhm/bluebird-events?branch=master)
[![npm](https://badgen.net/npm/v/bluebird-events)](https://www.npmjs.com/package/bluebird-events)
[![npm](https://badgen.net/npm/dm/bluebird-events)](https://www.npmjs.com/package/bluebird-events)
[![License](https://badgen.net/github/license/toddbluhm/bluebird-events)](https://github.com/toddbluhm/bluebird-events/blob/master/LICENSE)
[![TS-Standard - Typescript Standard Style Guide](https://badgen.net/badge/code%20style/ts-standard/blue?icon=typescript)](https://github.com/toddbluhm/ts-standard)
[![Dependabot badge](https://badgen.net/dependabot/toddbluhm/bluebird-events?icon=dependabot)](https://dependabot.com/)

# Bluebird-Events

This package wraps an [event emitter](https://nodejs.org/api/events.html#events_class_events_eventemitter)
object and returns a [bluebird](https://github.com/petkaantonov/bluebird) promise that is either resolved,
or rejected based on what events are fired from the emitter.

**Note: Bluebird-Events v2.x is NOT backwards compatible with v1.x see
[changelog](https://github.com/toddbluhm/bluebird-events/blob/master/CHANGELOG.md) for details**

## Installation

`npm install bluebird-events`

Optionally run tests:

`npm test`

## Usage

```ts
import { promisify } from 'bluebird-events'

const someEmitter = new TestEmitter()

const promise = promisify(someEmitter, {
  resolve: 'success-event-name',
  reject: ['error-event-name', 'error-event-name-2']
})

// Will resolve the promise
someEmitter.emit('success-event-name')

// Will reject the promise with the given error
someEmitter.emit('error-event-name', new Error('Some Error Occurred!'))
```

## API

#### promisify(emitter, events)

`emitter`[`Object`] - Some object that can emit events (usually inherited from 
[Events.EventEmitter](https://nodejs.org/api/events.html#events_class_events_eventemitter))

`events`[`Object`] - Contains a mapping of events to listen for

`events.resolve`[`String`, `Array of Strings`, or `Boolean`] - The name for the event that will
cause the promise to resolve (defaults to: `'finish'`)

`events.reject`[`String`, `Array of Strings`, or `Boolean`] - The name for the event that will
cause the promise to reject (defaults to: `'error'`)

**Returns** - a bluebird promise

*Note: To disable listening for all resolve or reject events (including default and custom events)
just pass in `false` for the resolve/reject value.*

```ts
// This promise cannot be resolve successfully via an emitted event
// But it can be rejected via the default 'error' event
promisify(emitter, { resolve: false })
```

## Dependencies

This library is dependent upon `bluebird`, but because `bluebird` is so common, there is no need to
install it multiple times so `bluebird` is declared as a `peerDependency`

*Note: `bluebird` is also declared as a `devDependency` for running the test suite*

## Contributors

- [Brian Moeskau](https://github.com/bmoeskau)
- [Kevin Moritz](https://github.com/mayorbyrne)

## 📋 Contributing Guide

I welcome all pull requests. Please make sure you add appropriate test cases for any features
added. Before opening a PR please make sure to run the following scripts:

- `npm run lint` checks for code errors and format according to [ts-standard](https://github.com/toddbluhm/ts-standard)
- `npm test` make sure all tests pass
- `npm run test-cover` make sure the coverage has not decreased from current master
