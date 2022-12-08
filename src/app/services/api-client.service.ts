import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { CurrentSchedule } from '../interfaces/current-schedule';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private backendBaseUrl = environment.envVar.PROPAGANDA_APP_BACKEND_BASE_URL;

  constructor(private http: HttpClient) {}

  public getDataToDisplay(): Observable<CurrentSchedule[]> {
    const path = '/schedules/current';

    const headers = {
      'Content-Type': 'application/json',
    };
    return this.http
      .get<CurrentSchedule[]>(this.backendBaseUrl + path, { headers })
      .pipe(
        tap(() => console.log('fetched data from API')),
        catchError(this.handleError<CurrentSchedule[]>('getDataToDisplay', []))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: T): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.log(
        `${operation} error while reading from API: ${JSON.stringify(error)}`
      ); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
