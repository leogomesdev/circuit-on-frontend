import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messages: string[] = [];

  public addMessage(message: string): void {
    this.messages.push(message);
  }

  public clearMessage(): void {
    this.messages = [];
  }

  public getMessages(): string[] {
    return this.messages;
  }
}
