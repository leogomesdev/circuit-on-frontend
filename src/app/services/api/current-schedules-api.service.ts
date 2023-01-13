import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { CurrentSchedule } from '../../interfaces/api-responses/current-schedule.interface';
import { environment } from '../../../environments/environment';
import { ErrorHandling } from '../error-handling.class';

@Injectable({
  providedIn: 'root',
})
export class CurrentSchedulesApiService {
  private backendBaseUrl = environment.envVar.NG_APP_BACKEND_BASE_URL;
  private path = '/v1/current-schedules';
  private headers = {
    'Content-Type': 'application/json',
  };

  constructor(private http: HttpClient, private errorHandling: ErrorHandling) {}

  /**
   * Connect with API for fetching data
   * @returns Promise of a result
   */
  public getAll(maxFutureItems: number): Observable<CurrentSchedule[]> {
    return this.http
      .get<CurrentSchedule[]>(
        `${this.backendBaseUrl}${this.path}?maxFutureItems=${maxFutureItems}`,
        {
          headers: this.headers,
        }
      )
      .pipe(
        catchError(
          this.errorHandling.handle<CurrentSchedule[]>(
            'CurrentSchedulesApiService:getAll',
            true,
            []
          )
        )
      );
  }
}
