import { Injectable } from '@angular/core';

export interface RallyEvent {
  type: 'fault' | 'point' | 'side-out';
  reason?: 'kitchen-volley' | 'wrong-server' | 'wrong-position' | 'net' | 'out' | 'double-bounce';
  servingTeam?: 'team1' | 'team2';
  scoringTeam?: 'team1' | 'team2';
}

export interface RallyCall {
  call: string;
  explainer: string;
}

@Injectable({ providedIn: 'root' })
export class RallyCallService {
  
  makeCall(event: RallyEvent): RallyCall {
    switch (event.type) {
      case 'fault':
        return this.makeFaultCall(event);
      case 'point':
        return this.makePointCall(event);
      case 'side-out':
        return this.makeSideOutCall(event);
      default:
        return { call: 'Unknown', explainer: 'Unexpected rally event.' };
    }
  }

  private makeFaultCall(event: RallyEvent): RallyCall {
    switch (event.reason) {
      case 'kitchen-volley':
        return {
          call: 'Fault: Kitchen volley',
          explainer: 'Cannot volley the ball while standing in the non-volley zone (kitchen).'
        };
      case 'wrong-server':
        return {
          call: 'Fault: Wrong server',
          explainer: 'The wrong player attempted to serve for their team.'
        };
      case 'wrong-position':
        return {
          call: 'Fault: Wrong position',
          explainer: 'Player was serving from the incorrect side of the court.'
        };
      case 'net':
        return {
          call: 'Fault: Net',
          explainer: 'Ball hit the net and did not clear to the other side.'
        };
      case 'out':
        return {
          call: 'Fault: Out',
          explainer: 'Ball landed outside the court boundaries.'
        };
      case 'double-bounce':
        return {
          call: 'Fault: Double bounce',
          explainer: 'Ball bounced twice on one side before being returned.'
        };
      default:
        return {
          call: 'Fault',
          explainer: 'A rule violation occurred during the rally.'
        };
    }
  }

  private makePointCall(event: RallyEvent): RallyCall {
    const team = event.scoringTeam === 'team1' ? 'Team 1' : 'Team 2';
    return {
      call: 'Point scored',
      explainer: `${team} wins the rally and scores a point.`
    };
  }

  private makeSideOutCall(event: RallyEvent): RallyCall {
    const newServingTeam = event.servingTeam === 'team1' ? 'Team 1' : 'Team 2';
    return {
      call: 'Side-out',
      explainer: `Serving team loses the rally. ${newServingTeam} now serves.`
    };
  }
}