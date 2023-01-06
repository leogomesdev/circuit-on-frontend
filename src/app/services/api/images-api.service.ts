import { catchError, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import OktaAuth from '@okta/okta-auth-js';
import { OKTA_AUTH } from '@okta/okta-angular';
import { CreateImageDto } from 'src/app/components/images/dto/create-image.dto';
import { environment } from '../../../environments/environment';
import { ErrorHandling } from '../error-handling';
import { Image } from '../../interfaces/image';
import { ImagesByCategory } from 'src/app/interfaces/images-by-category';
import { MessageService } from '../message.service';

@Injectable({
  providedIn: 'root',
})
export class ImagesApiService {
  private backendBaseUrl =
    environment.envVar.NG_APP_PROPAGANDA_APP_BACKEND_BASE_URL;
  private path = '/v1/images';
  private httpOptions;

  constructor(
    private httpClient: HttpClient,
    private messageService: MessageService,
    private errorHandling: ErrorHandling,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
  ) {
    const token = this.oktaAuth.getAccessToken();
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  /**
   * Creates an item
   * @param imageData - data for sending on the API call
   * @returns Observable<Image>
   */
  create(file: File, imageData: CreateImageDto): Observable<Image> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', imageData.category);
    formData.append('title', imageData.title);
    if (imageData.backgroundColor) {
      formData.append('backgroundColor', imageData.backgroundColor);
    }
    return this.httpClient
      .post<Image>(`${this.backendBaseUrl}${this.path}`, formData)
      .pipe(
        catchError(this.errorHandling.handle<Image>('ImagesApiService: create'))
      );
  }

  /**
   * Updates an item
   * @param imageData - data for sending on the API call
   * @param _id - reference to item that is going to be updated
   * @returns Observable<Image>
   */
  update(imageData: CreateImageDto, _id: string): Observable<Image> {
    return this.httpClient
      .put<Image>(
        `${this.backendBaseUrl}${this.path}/${_id}`,
        JSON.stringify(imageData),
        this.httpOptions
      )
      .pipe(
        catchError(this.errorHandling.handle<Image>('ImagesApiService: update'))
      );
  }

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
   * Get all items from API
   * @returns Observable<ImagesByCategory[]>
   */
  getGroupedByCategory(): Observable<ImagesByCategory[]> {
    return this.httpClient
      .get<ImagesByCategory[]>(
        `${this.backendBaseUrl}${this.path}/grouped-by-category`,
        this.httpOptions
      )
      .pipe(
        catchError(
          this.errorHandling.handle<ImagesByCategory[]>(
            'ImagesApiService: getGroupedByCategory',
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
      .pipe(catchError(this.errorHandling.handle('ImagesApiService: delete')));
  }
}
