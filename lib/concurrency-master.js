'use strict';

// The concurrency master! Initialize with a positive integer
// concurrency value, then call add() on functions that return
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

    add(promise_func) {
        this.promises[this.promise_index] = this.promises[this.promise_index].then(promise_func);
        this.promise_index = (this.promise_index + 1) % this.concurrency;
    }

    wait() {
        return Promise.all(this.promises);
    }
}

module.exports = ConcurrencyMaster;
