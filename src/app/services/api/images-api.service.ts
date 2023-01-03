import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MessageService } from '../message.service';
import { Image } from '../../interfaces/image';
import { ErrorHandling } from '../error-handling';

@Injectable({
  providedIn: 'root',
})
export class ImagesApiService {
  private backendBaseUrl = environment.envVar.PROPAGANDA_APP_BACKEND_BASE_URL;
  private path = '/v1/images';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(
    private httpClient: HttpClient,
    private messageService: MessageService,
    private errorHandling: ErrorHandling
  ) {}

  /**
   * Get all items from API
   * @returns Observable<Image[]>
   */
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

  /**
   * Get an Image from API
   * @returns Observable<Image>
   */
  get(_id: string): Observable<Image> {
    return this.httpClient
      .get<Image>(`${this.backendBaseUrl}${this.path}/${_id}`, this.httpOptions)
      .pipe(
        catchError(this.errorHandling.handle<Image>('ImagesApiService:get'))
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
      .pipe(catchError(this.errorHandling.handle('ImagesApiService: delete')));
  }
}
