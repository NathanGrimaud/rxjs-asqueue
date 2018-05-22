import test from 'ava';
import { of } from 'rxjs';
import { mapTo, delay, map, catchError, tap } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';
import { asQueue } from '../lib';
import { sort } from 'ramda';
import { _throw } from 'rxjs/observable/throw';
const results = [{ wait: 0 }, { wait: 2000 }, { wait: 100 }, { wait: 1000 }, { wait: 3000 }];

test('classic observable are fully async, the first available observable will be sent to pipeline', t => {
  const example = of(null);
  const messages = results.map(({ wait }) => example.pipe(mapTo(wait), delay(wait)));
  const ordered_results = sort((a, b) => (a.wait < b.wait ? -1 : 1), results);
  let index = 0;
  return merge(...messages).pipe(
    map(value => {
      t.is(value, ordered_results[index].wait);
      index++;
    })
  );
});

test('with asQueue, the observable will run in order, even if one observable is ready before', t => {
  const example = of(null);
  const messages = results.map(({ wait }) => example.pipe(mapTo(wait), delay(wait)));
  let index = 0;
  return asQueue(messages).pipe(
    map(value => {
      t.is(value, results[index].wait);
      index++;
    })
  );
});

test('asQueue will throw an error error if one of the observables throws an error', t => {
  const error = new Error('crash');
  const withError = _throw(error);
  return asQueue([withError]).pipe(
    map(value => t.fail()),
    catchError(catchedError => {
      t.is(error, catchedError);
      return of(error);
    })
  );
});

test('asQueue will  completes if no observable is given', t => {
  return asQueue([]).subscribe({
    complete: () => t.pass()
  });
});
