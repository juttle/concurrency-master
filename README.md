# Concurrency Master

The Concurrency Master is a lightweight promise-based task scheduler. Initialize it with a concurrency value, then call its `add` method on functions that return [Promises](https://www.promisejs.org/). The ConcurrencyMaster will execute all the given promise-returning functions. In doing so, it will make sure that no more than its given concurrency are running in parallel.

The `wait()` method returns a Promise that resolves when all of the ConcurrencyMaster's `push`ed Promises have resolved.

## Example

```javascript
var ConcurrencyMaster = require('concurrency-master');

function waitOneSecondAndLog() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Hey!');
            resolve();
        }, 1000);
    });    
}

var concurrencyMaster = new ConcurrencyMaster(2);
concurrencyMaster.add(waitOneSecondAndLog);
concurrencyMaster.add(waitOneSecondAndLog);
concurrencyMaster.add(waitOneSecondAndLog);
concurrencyMaster.wait().then(() => {
    console.log('all done!');
});
```

The ConcurrencyMaster in this example has a concurrency of 2, so after one second, you'll see two `Hey!` messages. After another second, you'll see the third `Hey!` message, then `all done!`. Sweet!
