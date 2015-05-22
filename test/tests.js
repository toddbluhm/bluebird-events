var bluebirdEvents = require('../index'),
  should = require('should'),
  TestClass = require('./TestClass');

describe('Bluebird-Events used inside a class', function() {
  before(function() {
    this.testClass = new TestClass();
  });

  it('should resolve', function() {
    return this.testClass.shouldResolve();
  });

  it('should reject', function() {
    return this.testClass.shouldReject()
      .then(function() {
        'Should not resolve'.should.be.false;
      })
      .catch(function() {
        return true;
      });
  });

  it('should cancel', function() {
    return this.testClass.shouldCancel()
      .then(function() {
        'Should not resolve'.should.be.false;
      })
      .catch(function() {
        return true;
      });
  });

  it('should resolve with value', function() {
    return this.testClass.shouldResolveWithValue()
      .then(function(val) {
        val.should.equal('Some Value');
      });
  });

  it('should reject with Error', function() {
    return this.testClass.shouldRejectWithError()
      .then(function() {
        'Should not resolve'.should.be.false;
      })
      .catch(function(err) {
        err.message.should.equal('Some Error!');
        return true;
      });
  });

  it('should cancel with Error', function() {
    var prom = this.testClass.shouldCancelWithError()

    //promise should be pending
    prom.reflect().isPending().should.equal.true;

    //now cancel the promise
    this.testClass.cancel();

    return prom
      .then(function() {
        'Should not resolve'.should.be.false;
      })
      .catch(function(err) {
        err.message.should.equal('Some Error!');
        return true;
      });
  });
});

describe('Bluebird-Events used with emmitter based object', function() {
  before(function() {
    this.testClass = new TestClass();
  });

  it('should resolve', function() {
    var prom = bluebirdEvents(this.testClass, {
      resolve: 'yay',
      reject: 'uh-oh',
      cancel: 'good-bye'
    });

    this.testClass.emit('yay');

    return prom;
  });

  it('should reject', function() {
    var prom = bluebirdEvents(this.testClass, {
      resolve: 'yay',
      reject: 'uh-oh',
      cancel: 'good-bye'
    });

    this.testClass.emit('uh-oh');

    return prom
      .then(function() {
        'Should not resolve'.should.be.false;
      })
      .catch(function() {
        return true;
      });
  });

  it('should cancel', function() {
    var prom = bluebirdEvents(this.testClass, {
      resolve: 'yay',
      reject: 'uh-oh',
      cancel: 'good-bye'
    });

    this.testClass.emit('good-bye');

    return prom
      .then(function() {
        'Should not resolve'.should.be.false;
      })
      .catch(function() {
        return true;
      });
  });

  it('should resolve with value', function() {
    var prom = bluebirdEvents(this.testClass, {
      resolve: 'yay',
      reject: 'uh-oh',
      cancel: 'good-bye'
    });

    this.testClass.emit('yay', 'Some Value');

    return prom
      .then(function(val) {
        val.should.equal('Some Value');
      });
  });

  it('should reject with an Error', function() {
    var prom = bluebirdEvents(this.testClass, {
      resolve: 'yay',
      reject: 'uh-oh',
      cancel: 'good-bye'
    });

    this.testClass.emit('uh-oh', new Error('Some Error'));

    return prom
      .then(function() {
        'Should not resolve'.should.be.false;
      })
      .catch(function(err) {
        err.message.should.equal('Some Error');
        return true;
      });
  });

  it('should cancel', function() {
    var prom = bluebirdEvents(this.testClass, {
      resolve: 'yay',
      reject: 'uh-oh',
      cancel: 'good-bye'
    });

    this.testClass.emit('good-bye', new Error('Some Error'));

    return prom
      .then(function() {
        'Should not resolve'.should.be.false;
      })
      .catch(function(err) {
        err.message.should.equal('Some Error');
        return true;
      });
  });
});
