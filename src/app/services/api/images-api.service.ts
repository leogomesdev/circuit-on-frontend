import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MessageService } from '../message.service';
import { Schedule } from '../../interfaces/schedule';
import { Image } from '../../interfaces/image';
import { ErrorHandling } from '../error-handling';

@Injectable({
  providedIn: 'root',
})
export class ImagesApiService {
  private backendBaseUrl = environment.envVar.PROPAGANDA_APP_BACKEND_BASE_URL;
  private path = '/v1/images';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(
    private httpClient: HttpClient,
    private messageService: MessageService,
    private errorHandling: ErrorHandling
  ) {}

  getAll(): Observable<Image[]> {
    return this.httpClient
      .get<Image[]>(`${this.backendBaseUrl}${this.path}`, this.httpOptions)
      .pipe(
        catchError(
          this.errorHandling.handle<Image[]>(
            'ImagesApiService: getAll',
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
      .pipe(catchError(this.errorHandling.handle('ImagesApiService: delete')));
  }
}
