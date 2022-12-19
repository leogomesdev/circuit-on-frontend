import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Schedule } from '../../interfaces/schedule';
import { CreateScheduleDto } from '../../components/schedules/dto/create-schedule.dto';
import { ErrorHandling } from '../error-handling';

@Injectable({
  providedIn: 'root',
})
export class SchedulesApiService {
  private backendBaseUrl = environment.envVar.PROPAGANDA_APP_BACKEND_BASE_URL;
  private path = '/v1/schedules';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(
    private httpClient: HttpClient,
    private errorHandling: ErrorHandling
  ) {}

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

  getAll(): Observable<Schedule[]> {
    return this.httpClient
      .get<Schedule[]>(`${this.backendBaseUrl}${this.path}`)
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

  delete(_id: string) {
    return this.httpClient
      .delete<Schedule>(
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
