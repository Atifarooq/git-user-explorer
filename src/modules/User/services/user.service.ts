import {
  Observable,
  catchError,
  defer,
  delay,
  forkJoin,
  from,
  map,
  mergeMap,
  of,
  startWith,
  switchMap,
  tap,
} from "rxjs";
import { Singleton, HttpClient } from "../../../core";
import { IUser, IServerUser } from "../types/user.type";
import favouritesService from "./favourites.service";
import { transformUsersData } from "../helpers";

@Singleton
class UserServiceSingleton {
  private static _baseURL: string;
  private rateLimit: any = {};

  constructor(base: string) {
    UserServiceSingleton._baseURL = base;
    this.getRateLimit();
  }

  user(id: string): Observable<any> {
    return HttpClient.get<IServerUser>(
      `${UserServiceSingleton._baseURL}/users/${id}`
    ).pipe(
      switchMap(({ resp }: any) =>
        from(favouritesService.favourite(resp.id)).pipe(
          map((favouriteData: any) =>
            this.transformUserData({ ...resp, favourite: !!favouriteData })
          )
        )
      ),
      startWith({ fetching: true }),
      catchError(HttpClient.errorHandler)
    );
  }

  search(params: any): Observable<any> {
    return this.delayUntil().pipe(
      mergeMap(() =>
        HttpClient.get<any>(
          `${UserServiceSingleton._baseURL}/search/users`,
          {},
          params
        )
      ),
      tap(({ headers }: any) => this.updateRateLimitHeaders(headers)),
      mergeMap(({ resp }: any) => {
        const favoriteObservables: Observable<any>[] = resp.items.map(
          ({ id, login, name, avatar_url, bio }: any) =>
            favouritesService.favourite(id).pipe(
              map((favouriteData: any) => ({
                id,
                login,
                name,
                avatar_url,
                bio,
                favourite: !!favouriteData,
              }))
            )
        );

        return forkJoin(favoriteObservables).pipe(
          map((items: any[]) => transformUsersData({ ...resp, items }, params))
        );
      }),
      startWith({ fetching: true }),
      catchError(HttpClient.errorHandler)
    );
  }

  private getRateLimit(): void {
    HttpClient.get<IServerUser>(`${UserServiceSingleton._baseURL}/rate_limit`)
      .subscribe((resp: any) => {
        this.rateLimit = resp.resources.search;
      })
      .unsubscribe();
    // .pipe(
    //   tap(({ headers }: any) => this.updateRateLimitHeaders(headers)),
    //   catchError(HttpClient.errorHandler)
    // )
    // .subscribe();
  }

  private transformUserData(data: IServerUser): IUser {
    const {
      id,
      login,
      name,
      avatar_url,
      html_url,
      bio,
      favourite,
      followers = 0,
      following = 0,
      public_repos = 0,
    } = data;

    return {
      id,
      login,
      name,
      avatar_url,
      html_url,
      bio,
      favourite,
      stats: [
        {
          caption: "followers",
          value: followers,
        },
        {
          caption: "following",
          value: following,
        },
        {
          caption: "repos",
          value: public_repos,
        },
      ],
    };
  }

  private updateRateLimitHeaders(headers: any): void {
    this.rateLimit.limit = parseInt(headers["x-ratelimit-limit"], 10);
    this.rateLimit.remaining = parseInt(headers["x-ratelimit-remaining"], 10);
    this.rateLimit.used = parseInt(headers["x-ratelimit-used"], 10);
    this.rateLimit.reset = parseInt(headers["x-ratelimit-reset"], 10);
  }

  private delayUntil(): Observable<any> {
    return defer(() => {
      if (this.rateLimit.remaining && this.rateLimit.remaining - 1 <= 0) {
        // Rate limit exceeded, wait until reset time
        const delayTill: Date = new Date((this.rateLimit.reset || 0) * 1000);
        if (delayTill) {
          console.log(`Rate limit exceeded. Waiting for ${delayTill}.`);
          return of(null).pipe(
            delay(delayTill.getTime() - new Date().getTime()), // Calculate the delay in milliseconds
            map(() => null)
          );
        }
      }
      return of(null);
    }).pipe(switchMap(() => of(null))); // Flatten the observable and return an empty result
  }
}

const userSerice = new UserServiceSingleton("https://api.github.com");
export default userSerice;
