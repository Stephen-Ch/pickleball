import { Component, ElementRef, ViewChild, AfterViewInit, NgZone, inject } from '@angular/core';
import { NgForOf, NgStyle } from '@angular/common';
import { SettingsService } from './settings.service';
import { AudioService } from './audio.service';
import { RallyCallService, RallyEvent } from './rally-call.service';
import { ScoreboardService } from './scoreboard.service';
import { RallyBannerComponent } from './rally-banner.component';

// Deterministic RNG for testability
export class SeededRNG {
  private state: number;
  constructor(seed: number) { this.state = seed; }
  next() {
    // xorshift32
    let x = this.state;
    x ^= x << 13; x ^= x >> 17; x ^= x << 5;
    this.state = x >>> 0;
    return this.state / 0xFFFFFFFF;
  }
}

@Component({
  standalone: true,
  selector: 'app-arcade',
  imports: [NgForOf, NgStyle, RallyBannerComponent],
  template: `
    <section class="arcade">
      <h2>Arcade Rally Demo</h2>
      <div class="score-display">{{ scoreboardService.getThreeNumberScore() }}</div>
      <div #board class="board" (touchstart)="onTouch($event)">
        <div class="ball" [ngStyle]="{ left: ball.x + 'px', top: ball.y + 'px' }"></div>
        <div *ngFor="let p of paddles" class="paddle" [ngStyle]="p.style"></div>
      </div>
      <div class="controls">
        <button (click)="reset()">Restart</button>
      </div>
      <app-rally-banner #rallyBanner></app-rally-banner>
    </section>
  `,
  styles: [`
    .arcade {
      max-width: 420px;
      margin: 2.5rem auto;
      text-align: center;
      font-family: 'Fira Sans', 'Segoe UI', 'Arial Rounded MT Bold', system-ui, sans-serif;
      color: #222;
    }
    .arcade h2 {
      font-size: 2rem;
      letter-spacing: 0.01em;
      color: #e60012;
      text-shadow: 0 2px 0 #fff, 0 4px 8px #0002;
      margin-bottom: 1.2rem;
    }
    .score-display {
      font-size: 1.5rem;
      font-weight: bold;
      color: #e60012;
      text-align: center;
      margin-bottom: 1rem;
      background: linear-gradient(90deg, #fff 0%, #ffe066 100%);
      border: 2px solid #e60012;
      border-radius: 1rem;
      padding: 0.5rem 1rem;
      display: inline-block;
      box-shadow: 0 2px 8px #0002;
    }
    .board {
      position: relative;
      width: 320px;
      height: 320px;
      background: linear-gradient(135deg, #f8f8f8 0%, #e0f7fa 100%);
      margin: 0 auto;
      border-radius: 24px;
      box-shadow: 0 4px 24px #0002, 0 1.5px 0 #fff inset;
      overflow: hidden;
      touch-action: none;
      border: 4px solid #e60012;
      outline: 2px solid #fff;
    }
    .ball {
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: radial-gradient(circle at 60% 40%, #fff 0%, #e60012 80%);
      box-shadow: 0 2px 8px #e6001240, 0 0.5px 0 #fff inset;
      border: 2px solid #fff;
      transition: none;
    }
    .paddle {
      position: absolute;
      width: 60px;
      height: 14px;
      background: linear-gradient(90deg, #fff 0%, #222 100%);
      border-radius: 8px;
      box-shadow: 0 2px 8px #0002, 0 1px 0 #fff inset;
      border: 2px solid #e60012;
      opacity: 0.98;
    }
    .controls {
      margin-top: 1.5rem;
    }
    .controls button {
      font-size: 1.1rem;
      font-family: inherit;
      background: linear-gradient(180deg, #fff 0%, #ffe066 100%);
      color: #e60012;
      border: 2.5px solid #e60012;
      border-radius: 1.5rem;
      padding: 0.6rem 2.2rem;
      font-weight: bold;
      box-shadow: 0 2px 8px #e6001240, 0 1px 0 #fff inset;
      cursor: pointer;
      transition: background 0.15s, box-shadow 0.15s;
    }
    .controls button:active {
      background: #ffe066;
      box-shadow: 0 1px 2px #e6001240 inset;
    }
  `]
})
export class ArcadeComponent implements AfterViewInit {
  @ViewChild('board') boardRef!: ElementRef;
  @ViewChild('rallyBanner') rallyBanner!: RallyBannerComponent;
  
  settings: SettingsService;
  audio: AudioService;
  zone: NgZone;
  rallyCallService: RallyCallService;
  scoreboardService: ScoreboardService;

  ball = { x: 151, y: 151, vx: 2, vy: 2 };
  paddles = [
    { x: 130, y: 308, w: 60, h: 12, cpu: false, style: {} },
    { x: 308, y: 130, w: 12, h: 60, cpu: true, style: {} },
    { x: 130, y: 0, w: 60, h: 12, cpu: true, style: {} },
    { x: 0, y: 130, w: 12, h: 60, cpu: true, style: {} },
  ];
  running = false;
  rng = new SeededRNG(42);
  difficulty = 'Beginner';
  errorRate = 0.1;
  cpuDelay = 120;
  lastMove = 0;

  constructor(
    settings?: SettingsService,
    audio?: AudioService,
    zone?: NgZone,
    rallyCallService?: RallyCallService,
    scoreboardService?: ScoreboardService
  ) {
    this.settings = settings ?? inject(SettingsService);
    this.audio = audio ?? inject(AudioService);
    this.zone = zone ?? inject(NgZone);
    this.rallyCallService = rallyCallService ?? inject(RallyCallService);
    this.scoreboardService = scoreboardService ?? inject(ScoreboardService);
  }

  ngAfterViewInit() {
    this.reset();
  }

  reset() {
    this.difficulty = this.settings.difficulty();
    if (this.difficulty === 'Intermediate') {
      this.errorRate = 0.05;
      this.cpuDelay = 80;
    } else {
      this.errorRate = 0.1;
      this.cpuDelay = 120;
    }
    this.ball = { x: 151, y: 151, vx: 2, vy: 2 };
    this.running = true;
    this.rng = new SeededRNG(42);
    this.zone.runOutsideAngular(() => this.loop());
  }

  onTouch(event: TouchEvent) {
    const rect = this.boardRef.nativeElement.getBoundingClientRect();
    const x = event.touches[0].clientX - rect.left;
    this.paddles[0].x = Math.max(0, Math.min(260, x - 30));
    this.updatePaddleStyles();
  }

  updatePaddleStyles() {
    this.paddles[0].style = { left: this.paddles[0].x + 'px', top: this.paddles[0].y + 'px' };
    this.paddles[1].style = { left: this.paddles[1].x + 'px', top: this.paddles[1].y + 'px' };
    this.paddles[2].style = { left: this.paddles[2].x + 'px', top: this.paddles[2].y + 'px' };
    this.paddles[3].style = { left: this.paddles[3].x + 'px', top: this.paddles[3].y + 'px' };
  }

  loop() {
    if (!this.running) return;
    this.ball.x += this.ball.vx;
    this.ball.y += this.ball.vy;
    
    // Check rally end conditions
    if (this.ball.x <= 0 || this.ball.x >= 302 || this.ball.y <= 0 || this.ball.y >= 302) {
      this.endRally();
      return;
    }
    
    for (let i = 0; i < 4; i++) {
      const p = this.paddles[i];
      if (this.hitPaddle(p)) {
        if (i % 2 === 0) this.ball.vy *= -1; else this.ball.vx *= -1;
        if (p.cpu && this.rng.next() < this.errorRate) {
          if (i % 2 === 0) this.ball.vx += (this.rng.next() - 0.5) * 2;
          else this.ball.vy += (this.rng.next() - 0.5) * 2;
        }
        if (!this.settings.mute()) this.audio.play('bounce');
      }
    }
    const now = performance.now();
    if (now - this.lastMove > this.cpuDelay) {
      this.moveCPUs();
      this.lastMove = now;
    }
    this.updatePaddleStyles();
    requestAnimationFrame(() => this.loop());
  }

  hitPaddle(p: any) {
    return (
      this.ball.x + 18 > p.x && this.ball.x < p.x + p.w &&
      this.ball.y + 18 > p.y && this.ball.y < p.y + p.h
    );
  }

  moveCPUs() {
    this.paddles[1].y = Math.max(0, Math.min(260, this.ball.y - 24 + (this.rng.next() < this.errorRate ? this.rng.next() * 40 - 20 : 0)));
    this.paddles[2].x = Math.max(0, Math.min(260, this.ball.x - 30 + (this.rng.next() < this.errorRate ? this.rng.next() * 40 - 20 : 0)));
    this.paddles[3].y = Math.max(0, Math.min(260, this.ball.y - 24 + (this.rng.next() < this.errorRate ? this.rng.next() * 40 - 20 : 0)));
  }

  endRally() {
    this.running = false;
    
    // Determine rally outcome based on ball position
    let event: RallyEvent;
    const servingTeam = this.scoreboardService.scoreboard().servingTeam;
    
    if (this.ball.y <= 0) {
      // Ball went out top (player wins)
      event = { type: 'point', scoringTeam: 'team1' };
      if (servingTeam === 'team1') {
        this.scoreboardService.addPoint('team1');
      } else {
        this.scoreboardService.sideOut();
        this.scoreboardService.addPoint('team1');
      }
    } else if (this.ball.y >= 302) {
      // Ball went out bottom (CPU wins)
      event = { type: 'fault', reason: 'out' };
      if (servingTeam === 'team2') {
        this.scoreboardService.addPoint('team2');
      } else {
        this.scoreboardService.sideOut();
      }
    } else {
      // Ball went out side (random for demo)
      if (this.rng.next() < 0.5) {
        event = { type: 'point', scoringTeam: 'team1' };
        if (servingTeam === 'team1') {
          this.scoreboardService.addPoint('team1');
        } else {
          this.scoreboardService.sideOut();
          this.scoreboardService.addPoint('team1');
        }
      } else {
        event = { type: 'fault', reason: 'out' };
        if (servingTeam === 'team2') {
          this.scoreboardService.addPoint('team2');
        } else {
          this.scoreboardService.sideOut();
        }
      }
    }

    // Show rally call
    const call = this.rallyCallService.makeCall(event);
    this.rallyBanner.call = call.call;
    this.rallyBanner.explainer = call.explainer;
    this.rallyBanner.score = this.scoreboardService.getThreeNumberScore();
    this.rallyBanner.show();

    // Restart rally after delay
    setTimeout(() => {
      this.ball = { x: 151, y: 151, vx: 2, vy: 2 };
      this.running = true;
      this.zone.runOutsideAngular(() => this.loop());
    }, 4000);
  }
}
