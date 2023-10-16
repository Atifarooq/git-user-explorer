import { Observable, fromEvent, throwError, Subject, merge, of } from "rxjs";
import {
  catchError,
  filter,
  map,
  scan,
  switchMap,
  take,
  takeWhile,
  toArray,
} from "rxjs/operators";

export class IndexedDBService<T> {
  private db: IDBDatabase | null = null;
  private dbOpenSubject = new Subject<void>();

  constructor(private dbName: string, private storeName: string) {}

  private openIndexedDB(): Observable<IDBDatabase> {
    if (this.db) return of(this.db);

    const openRequest = indexedDB.open(this.dbName, 1);

    const errorEvent$ = fromEvent(openRequest, "error");
    const upgradeneededEvent$ = fromEvent(openRequest, "upgradeneeded");
    const successEvent$ = fromEvent(openRequest, "success");

    merge(errorEvent$, upgradeneededEvent$, successEvent$).subscribe(
      (event: Event) => {
        if (event.type === "upgradeneeded") {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName, {
              keyPath: "id",
              autoIncrement: true,
            });
          }
        } else if (event.type === "success") {
          this.db = (event.target as IDBOpenDBRequest).result;
          this.dbOpenSubject.next();
        } else if (event.type === "error") {
          this.dbOpenSubject.error(
            `Error opening database: ${
              (event.target as IDBOpenDBRequest).error
            }`
          );
        }
      }
    );

    return this.dbOpenSubject.asObservable().pipe(
      take(1),
      switchMap(() => {
        if (!this.db) {
          return throwError(() => "Database not open");
        }
        return of(this.db);
      })
    );
  }

  open(): Observable<void> {
    return this.openIndexedDB().pipe(map(() => undefined));
  }

  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  add(data: T): Observable<T> {
    return this.openIndexedDB().pipe(
      switchMap(() => {
        const transaction = this.db!.transaction([this.storeName], "readwrite");
        const objectStore = transaction.objectStore(this.storeName);
        const addRequest = objectStore.add(data);

        return fromEvent(addRequest, "success").pipe(
          take(1),
          map(() => data),
          catchError((error) => throwError(() => `Error adding data: ${error}`))
        );
      })
    );
  }

  update(id: number, newData: Partial<T>): Observable<void> {
    return this.openIndexedDB().pipe(
      switchMap(() => {
        const transaction = this.db!.transaction([this.storeName], "readwrite");
        const objectStore = transaction.objectStore(this.storeName);

        const getRequest = objectStore.get(id);

        return fromEvent(getRequest, "success").pipe(
          take(1),
          switchMap((event: Event) => {
            const existingData = (event.target as IDBRequest).result as
              | T
              | undefined;
            if (existingData) {
              // Merge existing data with new data
              const updatedData = { ...existingData, ...newData };
              const putRequest = objectStore.put(updatedData, id);

              return fromEvent(putRequest, "success").pipe(
                take(1),
                map(() => undefined),
                catchError((error) =>
                  throwError(() => `Error updating data: ${error}`)
                )
              );
            } else {
              return throwError(() => `Data with ID ${id} not found`);
            }
          }),
          catchError((error) =>
            throwError(() => `Error finding data: ${error}`)
          )
        );
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.openIndexedDB().pipe(
      switchMap(() => {
        const transaction = this.db!.transaction([this.storeName], "readwrite");
        const objectStore = transaction.objectStore(this.storeName);
        const deleteRequest = objectStore.delete(id);

        return fromEvent(deleteRequest, "success").pipe(
          take(1),
          map(() => undefined),
          catchError((error) =>
            throwError(() => `Error deleting data: ${error}`)
          )
        );
      })
    );
  }

  find(id: number): Observable<T | undefined> {
    return this.openIndexedDB().pipe(
      switchMap(() => {
        const transaction = this.db!.transaction([this.storeName], "readonly");
        const objectStore = transaction.objectStore(this.storeName);
        const getRequest = objectStore.get(id);

        return fromEvent(getRequest, "success").pipe(
          take(1),
          map(
            (event: Event) =>
              (event.target as IDBRequest).result as T | undefined
          ),
          catchError((error) =>
            throwError(() => `Error finding data: ${error}`)
          )
        );
      })
    );
  }

  findAndUpdate(id: number, newData: Partial<T>): Observable<T> {
    return this.openIndexedDB().pipe(
      switchMap(() => {
        const transaction = this.db!.transaction([this.storeName], "readwrite");
        const objectStore = transaction.objectStore(this.storeName);

        const getRequest = objectStore.get(id);

        return fromEvent(getRequest, "success").pipe(
          take(1),
          switchMap((event: Event) => {
            const existingData = (event.target as IDBRequest).result as
              | T
              | undefined;
            if (existingData) {
              // Merge existing data with new data
              const updatedData = { ...existingData, ...newData };
              const putRequest = objectStore.put(updatedData, id);

              return fromEvent(putRequest, "success").pipe(
                take(1),
                map(() => updatedData), // Return the updated data
                catchError((error) =>
                  throwError(() => `Error updating data: ${error}`)
                )
              );
            } else {
              return throwError(() => `Data with ID ${id} not found`);
            }
          }),
          catchError((error) =>
            throwError(() => `Error finding data: ${error}`)
          )
        );
      })
    );
  }

  getAll(page: number, pageSize: number): Observable<any> {
    return this.openIndexedDB().pipe(
      switchMap((db) => {
        const transaction = db.transaction([this.storeName], "readonly");
        const objectStore = transaction.objectStore(this.storeName);

        const countRequest = objectStore.count();
        const cursorRequest = objectStore.openCursor();
        let currentIndex = 0;

        return fromEvent(countRequest, "success").pipe(
          map((event: any) => (event.target as IDBRequest).result as number),
          switchMap((total_count) => {
            return fromEvent(cursorRequest, "success").pipe(
              map((event) => (event.target as IDBRequest).result as IDBCursor),
              filter((cursor) => cursor !== null),
              scan((acc: any[], cursor: any) => {
                if (cursor) {
                  if (currentIndex >= (page - 1) * pageSize) {
                    acc.push(cursor.value);
                  }
                  currentIndex++;
                  if (acc.length < pageSize) {
                    cursor.continue();
                  }
                }
                return acc;
              }, []),
              takeWhile(
                (list) =>
                  list.length <
                  (pageSize > total_count ? total_count : pageSize)
              ),
              toArray(),
              map((mapList) => {
                return {
                  items: mapList[mapList.length - 1],
                  total_count,
                  incomplete_results: currentIndex < total_count,
                };
              })
            );
          }),
          catchError((error) =>
            throwError(() => `Error getting data: ${error}`)
          )
        );
      })
    );
  }
}

// // Example usage:
// const dbService = new IndexedDBService("MyDatabase", "MyStore");

// dbService.add({ name: "John", age: 30 }).subscribe(
//   (data) => {
//     console.log("All data:", data);
//   },
//   (error) => {
//     console.error(error);
//   },
//   () => {
//     dbService.close();
//   }
// );
