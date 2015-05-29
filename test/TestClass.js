var bluebirdEvents = require('../index'),
  util = require('util'),
  events = require('events');

function TestClass(opts) {
  events.EventEmitter.call(this, opts);
}

util.inherits(TestClass, events.EventEmitter);

TestClass.prototype.shouldResolve = function () {
  var prom = bluebirdEvents(this, {
    resolve: 'done',
    reject: 'error'
  });

  this.emit('done');

  return prom;
};

TestClass.prototype.shouldReject = function () {
  var prom = bluebirdEvents(this, {
    resolve: 'done',
    reject: 'error'
  });

  this.emit('error');

  return prom;
};

TestClass.prototype.shouldCancel = function () {
  var prom = bluebirdEvents(this, {
    resolve: 'done',
    reject: 'error',
    cancel: 'cancel'
  });

  this.emit('cancel');

  return prom;
};

TestClass.prototype.shouldResolveWithValue = function () {
  var prom = bluebirdEvents(this, {
    resolve: 'done',
    reject: 'error'
  });

  this.emit('done', 'Some Value');

  return prom;
};

TestClass.prototype.shouldRejectWithError = function () {
  var prom = bluebirdEvents(this, {
    resolve: 'done',
    reject: 'error'
  });

  this.emit('error', new Error('Some Error!'));

  return prom;
};

TestClass.prototype.shouldCancelWithError = function () {
  return bluebirdEvents(this, {
    resolve: 'done',
    reject: 'error',
    cancel: 'cancel'
  });
};

TestClass.prototype.cancel = function () {
  this.emit('cancel', new Error('Some Error!'));
};

module.exports = exports = TestClass;
