import { catchError, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import OktaAuth from '@okta/okta-auth-js';
import { OKTA_AUTH } from '@okta/okta-angular';
import { CreateScheduleDto } from '../../components/schedules/dto/create-schedule.dto';
import { environment } from '../../../environments/environment';
import { ErrorHandling } from '../error-handling';
import { Schedule } from '../../interfaces/schedule';

@Injectable({
  providedIn: 'root',
})
export class SchedulesApiService {
  private backendBaseUrl =
    environment.envVar.NG_APP_PROPAGANDA_APP_BACKEND_BASE_URL;
  private path = '/v1/schedules';
  private httpOptions;
  private token;

  constructor(
    private httpClient: HttpClient,
    private errorHandling: ErrorHandling,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
  ) {
    this.token = this.oktaAuth.getAccessToken();
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      }),
    };
  }

  /**
   * Creates an item
   * @param scheduleData - data for sending on the API call
   * @returns Observable<Schedule>
   */
  create(scheduleData: CreateScheduleDto): Observable<Schedule> {
    return this.httpClient
      .post<Schedule>(
        `${this.backendBaseUrl}${this.path}`,
        JSON.stringify(scheduleData),
        this.httpOptions
      )
      .pipe(
        catchError(
          this.errorHandling.handle<Schedule>('SchedulesApiService: create')
        )
      );
  }

  /**
   * Updates an item
   * @param scheduleData - data for sending on the API call
   * @param _id - reference to item that is going to be updated
   * @returns Observable<Schedule>
   */
  update(scheduleData: CreateScheduleDto, _id: string): Observable<Schedule> {
    return this.httpClient
      .put<Schedule>(
        `${this.backendBaseUrl}${this.path}/${_id}`,
        JSON.stringify(scheduleData),
        this.httpOptions
      )
      .pipe(
        catchError(
          this.errorHandling.handle<Schedule>('SchedulesApiService: update')
        )
      );
  }

  /**
   * Get all items from API
   * @returns Observable<Schedule[]>
   */
  getAll(): Observable<Schedule[]> {
    return this.httpClient
      .get<Schedule[]>(`${this.backendBaseUrl}${this.path}`, this.httpOptions)
      .pipe(
        catchError(
          this.errorHandling.handle<Schedule[]>(
            'SchedulesApiService: getAll',
            true,
            []
          )
        )
      );
  }
  /**
   * Get all items from API with scheduledAt bigger than or equal NOW
   * @returns Observable<Schedule[]>
   */
  getAllFuture(): Observable<Schedule[]> {
    return this.httpClient
      .get<Schedule[]>(
        `${this.backendBaseUrl}${this.path}/future`,
        this.httpOptions
      )
      .pipe(
        catchError(
          this.errorHandling.handle<Schedule[]>(
            'SchedulesApiService: getAllFuture',
            true,
            []
          )
        )
      );
  }

  /**
   * Deletes an item
   * @param _id - reference to item that is going to be deleted
   * @returns Observable<void>
   */
  delete(_id: string): Observable<void> {
    return this.httpClient
      .delete<void>(
        `${this.backendBaseUrl}${this.path}/${_id}`,
        this.httpOptions
      )
      .pipe(
        catchError(
          this.errorHandling.handle<void>('SchedulesApiService: delete')
        )
      );
  }
}
