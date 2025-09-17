import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-shell',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './shell.html',
  styleUrl: './shell.scss'
})
export class Shell implements OnInit, AfterViewInit {
  
  constructor(private router: Router, private elementRef: ElementRef) {}
  
  ngOnInit() {
    // Focus management on route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.focusMainContent();
      });
  }
  
  ngAfterViewInit() {
    // Initial focus for the first load
    setTimeout(() => this.focusMainContent(), 100);
  }
  
  private focusMainContent() {
    const mainContent = this.elementRef.nativeElement.querySelector('#main-content');
    if (mainContent) {
      mainContent.focus();
      // Also try to focus the first h1 in main content
      const firstHeading = mainContent.querySelector('h1');
      if (firstHeading) {
        firstHeading.focus();
      }
    }
  }
}
