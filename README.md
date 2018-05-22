[![Build Status](https://travis-ci.org/NathanGrimaud/rxjs-asqueue.svg?branch=master)](https://travis-ci.org/NathanGrimaud/rxjs-asqueue) [![Coverage Status](https://coveralls.io/repos/github/NathanGrimaud/rxjs-asqueue/badge.svg?branch=master)](https://coveralls.io/github/NathanGrimaud/rxjs-asqueue?branch=master)

# Rx asQueue

```typescript
signature: asQueue(input: Observable[]): Observable
```

### Turn multiple observables into a single observable, values will be emitted in the order of the input observables.

## Examples

with the merge operator, once a value is emitted, it will be sent to our pipeline

```javascript
const results = [{ wait: 0 }, { wait: 2000 }, { wait: 100 }, { wait: 1000 }, { wait: 3000 }];
const example = of(null);
const messages = results.map(result => example.pipe(mapTo(result.wait), delay(result.wait)));
merge(...messages)
  .pipe(
    map(value => {
      console.log(`${value}ms!`);
    })
  )
  .subscribe();

// 0ms ! ... 100ms! ... 1000ms! ... 2000ms! ... 3000ms
```

with the asQueue operator, we will receive the values in the order of the input observables

```javascript
const results = [{ wait: 0 }, { wait: 2000 }, { wait: 100 }, { wait: 1000 }, { wait: 3000 }];
const example = of(null);
const messages = results.map(result => example.pipe(mapTo(result.wait), delay(result.wait)));
asQueue(messages)
  .pipe(
    map(value => {
      console.log(`${value}ms!`);
    })
  )
  .subscribe();

// 0ms ! ... 2000ms! ... 100ms! ... 1000ms! ... 3000ms
```
