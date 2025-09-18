import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RulesComponent } from './rules.component';
import { By } from '@angular/platform-browser';

describe('RulesComponent', () => {
  let fixture: ComponentFixture<RulesComponent>;
  let comp: RulesComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RulesComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(RulesComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load the first card', () => {
    expect(comp.idx).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('Serve Diagonally');
  });

  it('should go to next and back, respecting boundaries', () => {
    const nextBtn = fixture.debugElement.queryAll(By.css('.nav button'))[1].nativeElement;
    nextBtn.click(); fixture.detectChanges();
    expect(comp.idx).toBe(1);
    const backBtn = fixture.debugElement.queryAll(By.css('.nav button'))[0].nativeElement;
    backBtn.click(); fixture.detectChanges();
    expect(comp.idx).toBe(0);
    backBtn.click(); fixture.detectChanges();
    expect(comp.idx).toBe(0); // stays at first
    comp.idx = comp.cards.length - 1; fixture.detectChanges();
    nextBtn.click(); fixture.detectChanges();
    expect(comp.idx).toBe(comp.cards.length - 1); // stays at last
  });

  it('should toggle more-info panel and update aria-expanded', () => {
    const moreBtn = fixture.debugElement.query(By.css('button[aria-expanded]')).nativeElement;
    expect(moreBtn.getAttribute('aria-expanded')).toBe('false');
    moreBtn.click(); fixture.detectChanges();
    expect(comp.showMore).toBeTrue();
    expect(moreBtn.getAttribute('aria-expanded')).toBe('true');
    expect(fixture.nativeElement.textContent).toContain(comp.card.moreInfo);
    moreBtn.click(); fixture.detectChanges();
    expect(comp.showMore).toBeFalse();
    expect(moreBtn.getAttribute('aria-expanded')).toBe('false');
  });
});
