import { TestBed } from '@angular/core/testing';
import { FocusManagerService } from './focus-manager.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';

describe('FocusManagerService', () => {
  let service: FocusManagerService;
  let routerEvents$: Subject<any>;
  let header: HTMLElement;
  let focusSpy: jasmine.Spy;

  beforeEach(() => {
    routerEvents$ = new Subject();
    TestBed.configureTestingModule({
      providers: [
        FocusManagerService,
        { provide: Router, useValue: { events: routerEvents$.asObservable() } }
      ]
    });
    header = document.createElement('header');
    header.id = 'app-header';
    header.tabIndex = -1;
    document.body.appendChild(header);
    focusSpy = spyOn(header, 'focus');
    service = TestBed.inject(FocusManagerService);
  });

  afterEach(() => {
    document.body.removeChild(header);
    routerEvents$.complete();
  });

  it('should focus #app-header after NavigationEnd', (done) => {
    routerEvents$.next(new NavigationEnd(1, '/old', '/new'));
    setTimeout(() => {
      expect(focusSpy).toHaveBeenCalled();
      done();
    }, 1);
  });
});
export {};
