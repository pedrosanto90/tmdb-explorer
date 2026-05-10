import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [],
  templateUrl: './error-message.html',
  styleUrl: './error-message.scss',
})
export class ErrorMessage {
  readonly message = input<string>('An error has occurred.');
  readonly showRetry = input<boolean>(false);

  readonly retry = output<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
