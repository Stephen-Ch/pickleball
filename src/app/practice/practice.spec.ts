import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Practice } from './practice';

describe('Practice', () => {
  let component: Practice;
  let fixture: ComponentFixture<Practice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Practice, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Practice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
