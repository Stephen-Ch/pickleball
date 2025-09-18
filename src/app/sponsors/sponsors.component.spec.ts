import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SponsorsComponent } from './sponsors.component';

describe('SponsorsComponent', () => {
  let component: SponsorsComponent;
  let fixture: ComponentFixture<SponsorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SponsorsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SponsorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display sponsors section heading', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const heading = compiled.querySelector('#sponsors-heading');
    expect(heading?.textContent?.trim()).toBe('Our Sponsors');
  });

  it('should display DailyInventory sponsor card', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const dailyInventoryCard = compiled.querySelector('.sponsor-card:first-child');
    expect(dailyInventoryCard).toBeTruthy();
    
    const sponsorName = dailyInventoryCard?.querySelector('.sponsor-name');
    expect(sponsorName?.textContent?.trim()).toBe('DailyInventory');
    
    const sponsorDescription = dailyInventoryCard?.querySelector('.sponsor-description');
    expect(sponsorDescription?.textContent?.trim()).toContain('inventory management');
  });

  it('should display JustSprites sponsor card', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const justSpritesCard = compiled.querySelector('.sponsor-card:last-child');
    expect(justSpritesCard).toBeTruthy();
    
    const sponsorName = justSpritesCard?.querySelector('.sponsor-name');
    expect(sponsorName?.textContent?.trim()).toBe('JustSprites');
    
    const sponsorDescription = justSpritesCard?.querySelector('.sponsor-description');
    expect(sponsorDescription?.textContent?.trim()).toContain('digital assets');
  });

  it('should have disabled sponsor links with proper attributes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const sponsorLinks = compiled.querySelectorAll('.sponsor-link');
    
    expect(sponsorLinks.length).toBe(2);
    
    sponsorLinks.forEach(link => {
      expect(link.getAttribute('disabled')).toBe('');
      expect(link.getAttribute('rel')).toBe('nofollow noopener');
      expect(link.getAttribute('aria-label')).toContain('coming soon');
    });
  });

  it('should have proper accessibility attributes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Check section has proper role and aria-labelledby
    const section = compiled.querySelector('.sponsors-section');
    expect(section?.getAttribute('role')).toBe('region');
    expect(section?.getAttribute('aria-labelledby')).toBe('sponsors-heading');
    
    // Check heading has proper id
    const heading = compiled.querySelector('#sponsors-heading');
    expect(heading?.id).toBe('sponsors-heading');
  });

  it('should display placeholder logos', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const dailyInventoryLogo = compiled.querySelector('.placeholder-logo.dailyinventory');
    const justSpritesLogo = compiled.querySelector('.placeholder-logo.justsprites');
    
    expect(dailyInventoryLogo?.textContent?.trim()).toBe('DI');
    expect(justSpritesLogo?.textContent?.trim()).toBe('JS');
  });
});