import { fromFetch } from "rxjs/fetch";
import { Observable, from, map, switchMap, throwError } from "rxjs";
import Singleton from "../decorators/singleton";
import { Body, Error } from "./type";

@Singleton
class HttpClientSingleton {
  get<T>(url: string, header?: any, params?: any): Observable<T> {
    const headers = {
      ...header,
    };

    const queryParams = new URLSearchParams(params);
    const path = `${url}?${queryParams.toString()}`;

    return fromFetch(path, {
      method: "GET",
      headers,
    }).pipe(switchMap(this.mapResponse)) as Observable<T>;
  }

  post<T>(
    url: string,
    header?: any,
    body: Body = null,
    params?: any
  ): Observable<T> {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      ...header,
    };

    const queryParams = new URLSearchParams(params);
    const path = `${url}?${queryParams.toString()}`;

    return fromFetch(path, {
      method: "POST",
      headers,
      body,
    }).pipe(switchMap(this.mapResponse)) as Observable<T>;
  }

  errorHandler(err: any): Observable<Error> {
    return throwError(() => ({
      error: true,
      message: err.message,
      status: `Error ${err.status}`,
    }));
  }

  private mapResponse<T>(response: Response): Observable<any> {
    if (!response.ok) return this.errorHandler(response);

    // Convert response headers to an object
    const headers: any = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    return from(response.json()).pipe(map((resp: any) => ({ resp, headers })));
  }
}

export const HttpClient = new HttpClientSingleton();
