'use strict';

var Promise = require('bluebird');

// The concurrency master! Initialize with a positive integer
// concurrency value, then call enqueue() on functions that return
// promises, and it'll call them all subject to the constraint
// that no more than this.concurrency are running at once

class ConcurrencyMaster {
    constructor(concurrency) {
        this.waiting_functions = [];
        this.active_promises = 0;
        this.concurrency = concurrency;
    }

    _run(promise_function) {
        this.active_promises++;
        promise_function().finally(this._promise_done.bind(this));
    }

    _promise_done() {
        this.active_promises--;
        if (this.waiting_functions.length > 0) {
            this._run(this.waiting_functions.shift());
        } else if (this.all_done) {
            this.all_done();
        }
    }

    enqueue(promise_function) {
        if (this.active_promises < this.concurrency) {
            this._run(promise_function);
        } else {
            this.waiting_functions.push(promise_function);
        }
    }

    flush() {
        return new Promise((resolve, reject) => {
            this.all_done = resolve;
        });
    }
}

module.exports = ConcurrencyMaster;
