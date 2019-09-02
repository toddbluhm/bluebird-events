/// <reference types="node" />
import * as BPromise from 'bluebird';
import { EventEmitter } from 'events';
export declare function promisify(emitter: EventEmitter, events?: {
    resolve?: string | string[] | boolean;
    reject?: string | string[] | boolean;
}): BPromise<unknown>;
