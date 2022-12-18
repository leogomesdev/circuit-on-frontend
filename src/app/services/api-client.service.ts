import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { CurrentSchedule } from '../interfaces/current-schedule';
import { environment } from '../../environments/environment';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private backendBaseUrl = environment.envVar.PROPAGANDA_APP_BACKEND_BASE_URL;
  private pathCurrentSchedules = '/v1/current-schedules';
  private headers = {
    'Content-Type': 'application/json',
  };

  constructor(
    private http: HttpClient,
    public messageService: MessageService
  ) {}

  /**
   * Connect with API for fetching data
   * @returns Promise of a result
   */
  public getCurrentSchedules(): Observable<CurrentSchedule[]> {
    return this.http
      .get<CurrentSchedule[]>(this.backendBaseUrl + this.pathCurrentSchedules, {
        headers: this.headers,
      })
      .pipe(
        tap(() =>
          this.messageService.addMessage('Connected to API successfully')
        ),
        catchError(
          this.handleError<CurrentSchedule[]>('getCurrentSchedules', [])
        )
      );
  }

  /**
   * Handle Http operation that failed
   * Let the app keep running by returning an empty result
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: T): Observable<T> => {
      this.messageService.addMessage(
        `${operation} failed. Error while reading from API: ${JSON.stringify(
          error
        )}`
      );
      return of(result as T);
    };
  }
}
