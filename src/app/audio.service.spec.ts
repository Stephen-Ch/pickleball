import { TestBed } from '@angular/core/testing';
import { AudioService } from './audio.service';
import { SettingsService } from './settings.service';

class MockAudioContext {
  createOscillator() { return this.osc; }
  createGain() { return this.gain; }
  destination = {};
  currentTime = 0;
  close = jasmine.createSpy('close');
  osc = { connect: () => this.gain, start: jasmine.createSpy('start'), stop: jasmine.createSpy('stop'), disconnect: jasmine.createSpy('oscDisc'), onended: null, type: '', frequency: { value: 0, setValueAtTime: jasmine.createSpy(), linearRampToValueAtTime: jasmine.createSpy() } };
  gain = { connect: () => this.destination, disconnect: jasmine.createSpy('gainDisc'), gain: { value: 0 } };
}

describe('AudioService', () => {
  let service: AudioService;
  let settings: SettingsService;
  let origAudioContext: any;

  beforeAll(() => {
    origAudioContext = (window as any).AudioContext;
    (window as any).AudioContext = MockAudioContext;
  });
  afterAll(() => {
    (window as any).AudioContext = origAudioContext;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [AudioService, SettingsService] });
    settings = TestBed.inject(SettingsService);
    service = TestBed.inject(AudioService);
  });

  it('should not play when muted', () => {
  settings.setMute(true);
  spyOn((window as any).AudioContext.prototype, 'createOscillator').and.callThrough();
  // Wait for effect to propagate
  (service as any).muted = settings.mute();
  service.play('click');
  expect((window as any).AudioContext.prototype.createOscillator).not.toHaveBeenCalled();
  });

  it('should play click when not muted', () => {
  settings.setMute(false);
  spyOn((window as any).AudioContext.prototype, 'createOscillator').and.callThrough();
  (service as any).muted = settings.mute();
  service.play('click');
  expect((window as any).AudioContext.prototype.createOscillator).toHaveBeenCalled();
  });

  it('should play bounce when not muted', () => {
  settings.setMute(false);
  spyOn((window as any).AudioContext.prototype, 'createOscillator').and.callThrough();
  (service as any).muted = settings.mute();
  service.play('bounce');
  expect((window as any).AudioContext.prototype.createOscillator).toHaveBeenCalled();
  });
});
