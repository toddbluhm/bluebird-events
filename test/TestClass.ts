import { EventEmitter } from 'events'
import * as BPromise from 'bluebird'
import { promisify } from '../src'

export class TestClass extends EventEmitter {
  shouldResolve (): BPromise<void> {
    const prom = promisify(this, {
      resolve: 'done',
      reject: 'error'
    })
    this.emit('done')
    return prom as BPromise<void>
  }

  shouldReject (): BPromise<void> {
    const prom = promisify(this, {
      resolve: 'done',
      reject: 'error'
    })
    this.emit('error', new Error('Oh no!'))
    return prom as BPromise<void>
  }

  shouldResolveWithValue (): BPromise<string> {
    const prom = promisify(this, {
      resolve: 'done',
      reject: 'error'
    })
    this.emit('done', 'Some Value')
    return prom as BPromise<string>
  }

  shouldRejectWithError (): BPromise<void> {
    const prom = promisify(this, {
      resolve: 'done',
      reject: 'error'
    })
    this.emit('error', new Error('Some Error!'))
    return prom as BPromise<void>
  }
}
