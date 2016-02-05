var expect = require('chai').expect;
var Promise = require('bluebird');

var ConcurrencyMaster = require('../lib/concurrency-master');

function wait(n) {
    return function() {
        return Promise.delay(n);
    };
}

describe('concurrency master', function() {
    this.timeout(300000);
    it('executes promises in parallel with a specified concurrency', function() {
        var master = new ConcurrencyMaster(5);
        var start = Date.now();
        for (var i = 0; i < 10; i++) {
            master.enqueue(wait(1000));
        }
        return master.flush()
            .then(function() {
                var elapsed = Date.now() - start;
                expect(elapsed).at.most(2500);
                expect(elapsed).at.least(1500);
            });
    });
});
