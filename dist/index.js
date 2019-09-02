"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BPromise = require("bluebird");
function promisify(emitter, events = {}) {
    const listeners = {};
    // Set default values
    if (events.resolve === undefined) {
        events.resolve = ['finish'];
    }
    if (typeof events.resolve === 'string') {
        events.resolve = [events.resolve];
    }
    if (events.reject === undefined) {
        events.reject = ['error'];
    }
    if (typeof events.reject === 'string') {
        events.reject = [events.reject];
    }
    // Listener cleanup method
    function removeListeners() {
        for (const ev in listeners) {
            emitter.removeListener(ev, listeners[ev]);
        }
    }
    // Adds an array of events to the emitter with the given func
    function addEventsToEmitter(events, func) {
        for (const event of events) {
            emitter.once(event, func);
            listeners[event] = func;
        }
    }
    function finishPromise(func) {
        return (...args) => {
            removeListeners();
            func(...args);
        };
    }
    return new BPromise((resolve, reject) => {
        if (events.resolve !== false) {
            addEventsToEmitter(events.resolve, finishPromise(resolve));
        }
        if (events.reject !== false) {
            addEventsToEmitter(events.reject, finishPromise(reject));
        }
    });
}
exports.promisify = promisify;
