import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PracticeComponent } from './practice.component';
import { By } from '@angular/platform-browser';

describe('PracticeComponent', () => {
  let fixture: ComponentFixture<PracticeComponent>;
  let comp: PracticeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(PracticeComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load the first scenario', () => {
    expect(comp.idx).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('It’s the start of a new game');
  });

  it('should evaluate answer and show feedback', () => {
    const btns = fixture.debugElement.queryAll(By.css('button'));
    btns[0].nativeElement.click(); fixture.detectChanges();
    expect(comp.answered).toBeTrue();
    expect(fixture.nativeElement.textContent).toContain('Correct!');
  });

  it('should progress to next scenario and handle boundaries', () => {
    comp.idx = comp.scenarios.length - 1;
    comp.answered = true;
    fixture.detectChanges();
    const nextBtn = fixture.debugElement.query(By.css('button'));
    nextBtn.nativeElement.click(); fixture.detectChanges();
    expect(comp.idx).toBe(comp.scenarios.length);
    expect(fixture.nativeElement.textContent).toContain('completed all practice scenarios');
  });
});
