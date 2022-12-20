import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarMessageComponent } from '../components/snackbar-message/snackbar-message.component';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private snackBar: MatSnackBar) {}

  private messages: string[] = [];

  public addMessage(message: string): void {
    this.messages.push(message);
  }

  public clearMessages(): void {
    this.messages = [];
  }

  public getMessages(): string[] {
    return this.messages;
  }

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

  public showSuccess(message: string, durationInSeconds?: number): void {
    this.openSnackBar(message, durationInSeconds, ['success-snack-message']);
  }

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
