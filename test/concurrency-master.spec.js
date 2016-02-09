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
    describe('validation', function() {
        it('rejects invalid constructor arguments', function() {
            function expect_failure(argument) {
                try {
                    var master = new ConcurrencyMaster(argument);
                    throw new Error('should have failed');
                } catch(err) {
                    expect(err.message).equal('ConcurrencyMaster constructor requires positive integer concurrency');
                }
            }

            expect_failure(-1);
            expect_failure(1.5);
            expect_failure('bananas in pajamas');
            expect_failure(NaN);
            expect_failure();
            expect_failure(null);
            expect_failure({});
            expect_failure(new ConcurrencyMaster(1));
            expect_failure(0);
            expect_failure(function() {});
            expect_failure(new Promise(function(resolve, reject) {}));
        });

        it('rejects invalid add arguments', function() {
            function expect_failure(argument) {
                try {
                    var master = new ConcurrencyMaster(1);
                    master.add(argument);
                    throw new Error('should have failed');
                } catch(err) {
                    expect(err.message).equal('ConcurrencyMaster.add requires function argument');
                }
            }

            expect_failure(-1);
            expect_failure(1.5);
            expect_failure(1);
            expect_failure('bananas in pajamas');
            expect_failure(NaN);
            expect_failure();
            expect_failure(null);
            expect_failure({});
            expect_failure(new ConcurrencyMaster(1));
            expect_failure(0);
            expect_failure(new Promise(function(resolve, reject) {}));
        });
    });

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
