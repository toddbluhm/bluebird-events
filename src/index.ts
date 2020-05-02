import * as BPromise from 'bluebird'
import { EventEmitter } from 'events'

type GenericFunction = (...args: any[]) => void

export function promisify (
  emitter: EventEmitter,
  events: {
    resolve?: string | string[] | boolean
    reject?: string | string[] | boolean
  } = {}): BPromise<unknown> {
  const listeners: { [event: string]: GenericFunction } = {}

  // Set default values
  if (events.resolve === undefined) {
    events.resolve = ['finish']
  }
  if (typeof events.resolve === 'string') {
    events.resolve = [events.resolve]
  }
  if (events.reject === undefined) {
    events.reject = ['error']
  }
  if (typeof events.reject === 'string') {
    events.reject = [events.reject]
  }

  // Listener cleanup method
  function removeListeners (): void {
    for (const ev in listeners) {
      emitter.removeListener(ev, listeners[ev])
    }
  }

  // Adds an array of events to the emitter with the given func
  function addEventsToEmitter (events: string[], func: GenericFunction): void {
    for (const event of events) {
      emitter.once(event, func)
      listeners[event] = func
    }
  }

  function finishPromise (func: GenericFunction): GenericFunction {
    return (...args: any[]): void => {
      removeListeners()
      func(...args)
    }
  }

  return new BPromise((resolve, reject): void => { // eslint-disable-line
    if (events.resolve !== false) {
      addEventsToEmitter(events.resolve as string[], finishPromise(resolve))
    }

    if (events.reject !== false) {
      addEventsToEmitter(events.reject as string[], finishPromise(reject))
    }
  })
}
