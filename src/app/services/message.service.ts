import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarMessageComponent } from '../components/shared/snackbar-message/snackbar-message.component';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messages: string[] = [];

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Add a message to the queue
   * @param message - message to add
   * @returns void
   */
  public addMessage(message: string): void {
    this.messages.push(message);
  }

  /**
   * Clean all messages from the queue
   * @returns void
   */
  public clearMessages(): void {
    this.messages = [];
  }

  /**
   * Get all messages from the queue
   * @returns string[]
   */
  public getMessages(): string[] {
    return this.messages;
  }

  /**
   * Show all the messages from queue at once, and clean the current queue
   * @param durationInSeconds: number
   * @returns void
   */
  public displayAllMessagesAndClear(durationInSeconds?: number): void {
    if (this.messages.length === 0) {
      return;
    }
    const data = `<ul>${this.messages
      .map((_) => `<li>${_}</li>`)
      .join('')}</ul>`;

    this.openSnackBar(data, durationInSeconds, ['general-snack-message']);
    this.clearMessages();
  }

  /**
   * Display an error message
   * @param message - message to show
   * @param errors - list of errors to show
   * @param durationInSeconds - How long the message should stay on the screen
   * @returns void
   */
  public showError(
    message: string,
    errors?: string[],
    durationInSeconds?: number
  ): void {
    let data: string = message;
    if (errors && errors.length > 0) {
      const listOfErrors: string = Array.isArray(errors)
        ? errors.map((_) => `<li>${_}</li>`).join('')
        : errors;
      data += `<ul>${listOfErrors}</ul>`;
    }

    this.openSnackBar(data, durationInSeconds, ['error-snack-message']);
  }

  /**
   * Display an error message
   * @param message - message to show
   * @param durationInSeconds - how long the message should stay on the screen
   * @returns void
   */
  public showSuccess(message: string, durationInSeconds?: number): void {
    this.openSnackBar(message, durationInSeconds, ['success-snack-message']);
  }

  /**
   * Show SnackBar Component with the error message
   * @param data - data to show
   * @param durationInSeconds - how long the message should stay on the screen
   * @param panelClass - CSS classes to add to message container
   * @returns void
   */
  private openSnackBar(
    data: string,
    durationInSeconds?: number,
    panelClass?: string[]
  ): void {
    this.snackBar.openFromComponent(SnackbarMessageComponent, {
      data,
      panelClass,
      duration: durationInSeconds ? durationInSeconds * 1000 : undefined,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}
