import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FocusManagerService } from './focus-manager.service';
@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterModule],
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  // Activate FocusManagerService
  private _focusManager = inject(FocusManagerService);
}
