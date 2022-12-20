import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { CurrentSchedule } from '../../interfaces/current-schedule';
import { environment } from '../../../environments/environment';
import { MessageService } from '../message.service';
import { ErrorHandling } from '../error-handling';

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
    private messageService: MessageService,
    private errorHandling: ErrorHandling
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
        catchError(
          this.errorHandling.handle<CurrentSchedule[]>(
            'getCurrentSchedules',
            true,
            []
          )
        )
      );
  }
}
