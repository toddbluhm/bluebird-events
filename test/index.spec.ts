import { assert } from 'chai'
import { promisify } from '../src/'
import { TestClass } from './TestClass'

describe('promisify', () => {
  describe('usage inside of a class', () => {
    let testClass: TestClass
    before(() => {
      testClass = new TestClass()
    })

    it('should resolve', async () => {
      const value = await testClass.shouldResolve()
      assert.isUndefined(value)
    })

    it('should reject', async () => {
      try {
        await testClass.shouldReject()
        assert.fail('The promise should have failed.')
      } catch (e) {
        assert.match(e.message, /oh no!/gi)
      }
    })

    it('should resolve with value', async () => {
      const value = await testClass.shouldResolveWithValue()
      assert.equal(value, 'Some Value')
    })

    it('should reject with Error', async () => {
      try {
        await testClass.shouldRejectWithError()
        assert.fail('The promise should have failed.')
      } catch (e) {
        assert.match(e.message, /Some Error!/gi)
      }
    })
  })

  describe('usage with emitter based object', () => {
    let testClass: TestClass
    before(() => {
      testClass = new TestClass()
    })

    it('should resolve', async () => {
      const prom = promisify(testClass, {
        resolve: 'yay',
        reject: 'uh-oh'
      })
      testClass.emit('yay')
      const value = await prom
      assert.isUndefined(value)
    })

    it('should reject', async () => {
      const prom = promisify(testClass, {
        resolve: 'yay',
        reject: 'uh-oh'
      })
      testClass.emit('uh-oh', new Error('Oh no!'))
      try {
        await prom
        assert.fail('The promise should have failed.')
      } catch (e) {
        assert.match(e.message, /oh no!/gi)
      }
    })

    it('should resolve with value', async () => {
      const prom = promisify(testClass, {
        resolve: 'yay',
        reject: 'uh-oh'
      })
      testClass.emit('yay', 'Some Value')
      const value = await prom
      assert.equal(value, 'Some Value')
    })

    it('should reject with an Error', async () => {
      const prom = promisify(testClass, {
        resolve: 'yay',
        reject: 'uh-oh'
      })
      testClass.emit('uh-oh', new Error('Some Error'))

      try {
        await prom
        assert.fail('The promise should have failed.')
      } catch (e) {
        assert.match(e.message, /some error/gi)
      }
    })
  })

  describe('handling multiple events', () => {
    let testClass: TestClass
    before(() => {
      testClass = new TestClass()
    })

    it('should resolve with both events', async () => {
      const prom = promisify(testClass, {
        resolve: ['success', 'anotherSuccess'],
        reject: ['bad', 'anotherBad']
      })
      testClass.emit('success')
      const prom2 = promisify(testClass, {
        resolve: ['success', 'anotherSuccess'],
        reject: ['bad', 'anotherBad']
      })
      testClass.emit('anotherSuccess')

      const val1 = await prom
      const val2 = await prom2
      assert.isUndefined(val1)
      assert.isUndefined(val2)
    })

    it('should reject with both events', async () => {
      const prom = promisify(testClass, {
        resolve: ['success', 'anotherSuccess'],
        reject: ['bad', 'anotherBad']
      })
      testClass.emit('bad', new Error('Oh no!'))
      const prom2 = promisify(testClass, {
        resolve: ['success', 'anotherSuccess'],
        reject: ['bad', 'anotherBad']
      })
      testClass.emit('anotherBad', new Error('Oh no again!'))

      try {
        await prom
        assert.fail('The promise should have failed.')
      } catch (e) {
        assert.match(e.message, /oh no!/gi)
      }

      try {
        await prom2
        assert.fail('The promise should have failed.')
      } catch (e) {
        assert.match(e.message, /oh no again!/gi)
      }
    })

    it('should resolve with both events and values', async () => {
      const prom = promisify(testClass, {
        resolve: ['success', 'anotherSuccess'],
        reject: ['bad', 'anotherBad']
      })
      testClass.emit('success', 'Yay!')

      const prom2 = promisify(testClass, {
        resolve: ['success', 'anotherSuccess'],
        reject: ['bad', 'anotherBad']
      })
      testClass.emit('anotherSuccess', 'Double Yay!')

      const val1 = await prom
      const val2 = await prom2
      assert.equal(val1, 'Yay!')
      assert.equal(val2, 'Double Yay!')
    })

    it('should reject with both events and values', async () => {
      const prom = promisify(testClass, {
        resolve: ['success', 'anotherSuccess'],
        reject: ['bad', 'anotherBad']
      })
      testClass.emit('bad', new Error('Uh-Oh!'))

      const prom2 = promisify(testClass, {
        resolve: ['success', 'anotherSuccess'],
        reject: ['bad', 'anotherBad']
      })
      testClass.emit('anotherBad', new Error('My Bad'))

      try {
        await prom
        assert.fail('The promise should have failed.')
      } catch (e) {
        assert.match(e.message, /uh-oh!/gi)
      }

      try {
        await prom2
        assert.fail('The promise should have failed.')
      } catch (e) {
        assert.match(e.message, /my bad/gi)
      }
    })
  })

  describe('usage with default events', () => {
    let testClass: TestClass
    before(() => {
      testClass = new TestClass()
    })

    it('should resolve by listening for default "finish" event', async () => {
      const prom = promisify(testClass)
      testClass.emit('finish')

      const value = await prom
      assert.isUndefined(value)
    })

    it('should reject by listening for default "error" event', async () => {
      const prom = promisify(testClass)
      testClass.emit('error', new Error('Oh no!'))

      try {
        await prom
        assert.fail('The promise should have failed.')
      } catch (e) {
        assert.match(e.message, /oh no!/gi)
      }
    })
  })

  describe('usage with disabled events', () => {
    let testClass: TestClass
    before(() => {
      testClass = new TestClass()
    })

    it('should not reject because of an emitted event', async () => {
      const prom = promisify(testClass, {
        reject: false
      })
      testClass.emit('err') //  cannot use 'error' here because it will cause an
      //  unhandled exception because its a Node "Special Case" event
      try {
        await prom.timeout(100, 'Never rejected')
        assert.fail('The promise should have failed.')
      } catch (e) {
        assert.match(e.message, /never rejected/gi)
      }
    })

    it('should not resolve because of an emitted event', async () => {
      const prom = promisify(testClass, {
        resolve: false
      })
      testClass.emit('finish')

      try {
        await prom.timeout(100, 'Never resolved')
        assert.fail('The promise should have failed.')
      } catch (e) {
        assert.match(e.message, /never resolved/gi)
      }
    })
  })
})
