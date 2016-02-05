var expect = require('chai').expect;
var Promise = require('bluebird');

var ConcurrencyMaster = require('../lib/concurrency-master');

var active = 0;
var maxActive = 0;
function wait(n) {
    return function() {
        active++;
        if (active > maxActive) {
            maxActive = active;
        }
        return new Promise(function(resolve, reject) {
            setTimeout(resolve, n);
        })
        .then(function() {
            active--;
        });
    };
}

describe('concurrency master', function() {
    this.timeout(300000);
    it('executes promises in parallel with a specified concurrency', function() {
        var master = new ConcurrencyMaster(5);
        var start = Date.now();
        for (var i = 0; i < 10; i++) {
            master.add(wait(1000));
        }
        return master.wait()
            .then(function() {
                var elapsed = Date.now() - start;
                expect(elapsed).at.most(2500);
                expect(elapsed).at.least(1500);
            })
            .then(function() {
                expect(maxActive).equals(5);
            });
    });
});
