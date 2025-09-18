import { ArcadeComponent, SeededRNG } from './arcade.component';
import { SettingsService } from './settings.service';
import { AudioService } from './audio.service';

describe('ArcadeComponent', () => {
  let component: ArcadeComponent;
  let settings: jasmine.SpyObj<SettingsService>;
  let audio: jasmine.SpyObj<AudioService>;

  beforeEach(() => {
    settings = jasmine.createSpyObj('SettingsService', ['difficulty', 'mute']);
    audio = jasmine.createSpyObj('AudioService', ['play']);
    settings.difficulty.and.returnValue('Beginner');
    settings.mute.and.returnValue(false);
    component = new ArcadeComponent(settings as any, audio as any, { runOutsideAngular: (fn: any) => fn() } as any);
  });

  it('maps Beginner difficulty to correct error/delay', () => {
    component.reset();
    expect(component.errorRate).toBe(0.1);
    expect(component.cpuDelay).toBe(120);
  });

  it('maps Intermediate difficulty to correct error/delay', () => {
    settings.difficulty.and.returnValue('Intermediate');
    component.reset();
    expect(component.errorRate).toBe(0.05);
    expect(component.cpuDelay).toBe(80);
  });

  it('uses deterministic RNG for repeatable outcomes', () => {
    const rng1 = new SeededRNG(42);
    const first = rng1.next();
    const rng2 = new SeededRNG(42);
    const second = rng2.next();
    expect(first).toBe(second);
  });

  it('plays bounce SFX on paddle hit if not muted', () => {
    component.ball = { x: 130, y: 308, vx: 2, vy: 2 };
    component.paddles[0].x = 130;
    component.paddles[0].y = 308;
    component.updatePaddleStyles();
    component.running = true;
    component.loop();
    expect(audio.play).toHaveBeenCalledWith('bounce');
  });

  it('does not play SFX if muted', () => {
    settings.mute.and.returnValue(true);
    component.ball = { x: 130, y: 308, vx: 2, vy: 2 };
    component.paddles[0].x = 130;
    component.paddles[0].y = 308;
    component.updatePaddleStyles();
    component.running = true;
    component.loop();
    expect(audio.play).not.toHaveBeenCalled();
  });
});
