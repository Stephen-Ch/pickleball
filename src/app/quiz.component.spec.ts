import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizComponent } from './quiz.component';
import { By } from '@angular/platform-browser';

describe('QuizComponent', () => {
  let fixture: ComponentFixture<QuizComponent>;
  let comp: QuizComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(QuizComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load the first question', () => {
    expect(comp.idx).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('Where must the serve land?');
  });

  it('should score correct answers and show summary', () => {
    for (let i = 0; i < comp.questions.length; i++) {
      comp.answer(comp.questions[i].answer);
      comp.next();
    }
    fixture.detectChanges();
    expect(comp.completed).toBeTrue();
    expect(comp.score).toBe(comp.questions.length);
    expect(fixture.nativeElement.textContent).toContain('Perfect!');
  });

  it('should not increment score for wrong answers', () => {
    comp.answer(0); // wrong for first question
    comp.next();
    fixture.detectChanges();
    expect(comp.score).toBe(0);
  });
});
