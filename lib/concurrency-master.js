'use strict';

var Promise = require('bluebird');

// The concurrency master! Initialize with a positive integer
// concurrency value, then call enqueue() on functions that return
// promises, and it'll call them all subject to the constraint
// that no more than this.concurrency are running at once

class ConcurrencyMaster {
    constructor(concurrency) {
        this.promises = [];
        for (var i = 0; i < concurrency; i++) {
            this.promises.push(Promise.resolve());
        }
        this.promise_index = 0;
        this.concurrency = concurrency;
    }

    enqueue(promise_func) {
        this.promises[this.promise_index] = this.promises[this.promise_index].then(promise_func);
        this.promise_index = (this.promise_index + 1) % this.concurrency;
    }

    flush() {
        return Promise.all(this.promises);
    }
}

module.exports = ConcurrencyMaster;
