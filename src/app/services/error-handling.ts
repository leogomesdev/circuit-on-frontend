import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandling {
  constructor(private messageService: MessageService) {}

  /**
   * Handle Http operation errors
   * @param operation - name of the operation that failed
   * @param returnEmptyResult - keep app running by returning an empty result
   * @param result - optional value to return as the observable result
   */
  handle<T>(operation = 'operation', returnEmptyResult = false, result?: T) {
    return (error: T): Observable<T> => {
      this.messageService.addMessage(
        `${operation} failed. Error while reading from API: ${JSON.stringify(
          error
        )}`
      );
      if (returnEmptyResult) {
        return of(result as T);
      }
      throw error;
    };
  }
}
