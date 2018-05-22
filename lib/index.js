"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const ramda_1 = require("ramda");
function asQueue(observables) {
    const reversed = ramda_1.reverse(observables);
    return new rxjs_1.Observable(observer => {
        function getLastAndNext(observables) {
            const lastObservable = observables.pop();
            if (lastObservable === undefined)
                return observer.complete();
            lastObservable.subscribe({
                next: (value) => {
                    observer.next(value);
                    getLastAndNext(observables);
                },
                error: error => observer.error(error)
            });
        }
        getLastAndNext(reversed);
    });
}
exports.asQueue = asQueue;
