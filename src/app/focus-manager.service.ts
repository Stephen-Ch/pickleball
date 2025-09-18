import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class FocusManagerService {
  private router = inject(Router);
  constructor() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          const header = document.getElementById('app-header');
          if (header) header.focus();
        }, 0);
      }
    });
  }
}
