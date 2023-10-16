import { useEffect, useMemo, useState } from "react";
import { of, Subject } from "rxjs";
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter,
  switchMap,
} from "rxjs/operators";

const useDebounce = (term: string, debounce: number = 200): string => {
  const [state, setState] = useState<string>("");
  const textStream$: Subject<string> = useMemo(() => {
    const observer$: Subject<string> = new Subject();
    observer$
      .pipe(
        map((query: string) => query.trim()),
        debounceTime(debounce),
        distinctUntilChanged(),
        filter((query: string) => query.length >= 3 || !query.length),
        switchMap((query: string) => of(query))
      )
      .subscribe((res: string) => setState(res));
    return observer$;
  }, [debounce]);

  useEffect(() => {
    textStream$.next(term);
  }, [term, textStream$]);

  return state;
};

export default useDebounce;
