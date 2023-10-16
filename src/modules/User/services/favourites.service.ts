import {
  Observable,
  catchError,
  map,
  startWith,
  switchMap,
  throwError,
} from "rxjs";
import { Singleton } from "../../../core";
import { IUser } from "../types/user.type";
import { IndexedDBService } from "../../../core/database/db";
import { transformUsersData } from "../helpers";

@Singleton
class FavouriteServiceSingleton {
  private dbService: IndexedDBService<any>;

  constructor(storeName: string) {
    this.dbService = new IndexedDBService("Users", storeName);
  }

  favourites(params: any) {
    return this.dbService.getAll(params.page, params.per_page).pipe(
      map((data: any) => transformUsersData(data, params)),
      startWith({ fetching: true }),
      catchError((fetchError) =>
        throwError(() => `Error getting user: ${fetchError}`)
      )
    );
  }

  favourite(id: number): Observable<any> {
    return this.dbService.find(id);
  }

  toggle(user: IUser): Observable<any> {
    const updatedUser: IUser = {
      ...user,
      favourite: !user.favourite,
    };

    return this.dbService.find(updatedUser.id).pipe(
      switchMap((u: any) =>
        this.dbService[u ? "delete" : "add"](u ? u.id : updatedUser).pipe(
          map(() => updatedUser),
          catchError((deleteError) =>
            throwError(() => `Error setting user: ${deleteError}`)
          )
        )
      ),
      startWith({ fetching: true }),
      catchError((error) => throwError(() => `Error finding user: ${error}`))
    );
  }
}

const favouriteService = new FavouriteServiceSingleton("favourites");
export default favouriteService;
