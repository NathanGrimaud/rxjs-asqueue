import { Observable, of } from 'rxjs';
import { reverse } from 'ramda';
export function asQueue<T>(observables: Observable<T>[]): Observable<T> {
  const reversed = reverse(observables);
  return new Observable(observer => {
    function getLastAndNext(observables: Observable<T>[]) {
      const lastObservable = observables.pop();
      if (lastObservable === undefined) return observer.complete();
      lastObservable.subscribe({
        next: (value: T) => {
          observer.next(value);
          getLastAndNext(observables);
        },
        error: error => observer.error(error)
      });
    }
    getLastAndNext(reversed);
  });
}
