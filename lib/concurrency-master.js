'use strict';

// The concurrency master! Initialize with a positive integer
// concurrency value, then call add() on functions that return
// promises, and it'll call them all subject to the constraint
// that no more than this.concurrency are running at once

class ConcurrencyMaster {
    constructor(concurrency) {
        this._validate_and_set_concurrency(concurrency);
        this.promises = [];
        for (var i = 0; i < concurrency; i++) {
            this.promises.push(Promise.resolve());
        }
        this.promise_index = 0;
    }

    _validate_and_set_concurrency(concurrency) {
        var numeric = typeof concurrency === 'number' && concurrency === concurrency;
        var positive_integer = concurrency > 0 && concurrency % 1 === 0;
        if (!numeric || !positive_integer) {
            throw new Error('ConcurrencyMaster constructor requires positive integer concurrency');
        }
        this.concurrency = concurrency;
    }

    add(promise_func) {
        if (typeof promise_func !== 'function') {
            throw new Error('ConcurrencyMaster.add requires function argument');
        }
        this.promises[this.promise_index] = this.promises[this.promise_index].then(promise_func);
        this.promise_index = (this.promise_index + 1) % this.concurrency;
    }

    wait() {
        return Promise.all(this.promises);
    }
}

module.exports = ConcurrencyMaster;
