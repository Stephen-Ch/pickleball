import { Injectable, signal } from '@angular/core';

export interface Scoreboard {
  team1Score: number;
  team2Score: number;
  servingTeam: 'team1' | 'team2';
  server: 1 | 2; // First or second server on serving team
}

@Injectable({ providedIn: 'root' })
export class ScoreboardService {
  private _scoreboard = signal<Scoreboard>({
    team1Score: 0,
    team2Score: 0,
    servingTeam: 'team1',
    server: 1
  });

  readonly scoreboard = this._scoreboard.asReadonly();

  addPoint(team: 'team1' | 'team2') {
    const current = this._scoreboard();
    if (team === 'team1') {
      this._scoreboard.set({
        ...current,
        team1Score: current.team1Score + 1
      });
    } else {
      this._scoreboard.set({
        ...current,
        team2Score: current.team2Score + 1
      });
    }
  }

  sideOut() {
    const current = this._scoreboard();
    const newServingTeam = current.servingTeam === 'team1' ? 'team2' : 'team1';
    this._scoreboard.set({
      ...current,
      servingTeam: newServingTeam,
      server: 1 // Reset to first server
    });
  }

  switchServer() {
    const current = this._scoreboard();
    this._scoreboard.set({
      ...current,
      server: current.server === 1 ? 2 : 1
    });
  }

  getThreeNumberScore(): string {
    const sb = this._scoreboard();
    if (sb.servingTeam === 'team1') {
      return `${sb.team1Score}-${sb.team2Score}-${sb.server}`;
    } else {
      return `${sb.team2Score}-${sb.team1Score}-${sb.server}`;
    }
  }

  reset() {
    this._scoreboard.set({
      team1Score: 0,
      team2Score: 0,
      servingTeam: 'team1',
      server: 1
    });
  }
}