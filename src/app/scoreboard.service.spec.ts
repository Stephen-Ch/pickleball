import { ScoreboardService } from './scoreboard.service';

describe('ScoreboardService', () => {
  let service: ScoreboardService;

  beforeEach(() => {
    service = new ScoreboardService();
  });

  it('should start with 0-0-1 score', () => {
    expect(service.getThreeNumberScore()).toBe('0-0-1');
  });

  it('should add point to team1', () => {
    service.addPoint('team1');
    expect(service.scoreboard().team1Score).toBe(1);
    expect(service.getThreeNumberScore()).toBe('1-0-1');
  });

  it('should add point to team2', () => {
    service.addPoint('team2');
    expect(service.scoreboard().team2Score).toBe(1);
    expect(service.getThreeNumberScore()).toBe('0-1-1');
  });

  it('should handle side-out correctly', () => {
    service.sideOut();
    expect(service.scoreboard().servingTeam).toBe('team2');
    expect(service.scoreboard().server).toBe(1);
    expect(service.getThreeNumberScore()).toBe('0-0-1');
  });

  it('should switch server correctly', () => {
    service.switchServer();
    expect(service.scoreboard().server).toBe(2);
    expect(service.getThreeNumberScore()).toBe('0-0-2');
  });

  it('should format three-number score correctly when team2 serves', () => {
    service.sideOut(); // team2 serves
    service.addPoint('team1');
    service.addPoint('team2');
    service.switchServer();
    expect(service.getThreeNumberScore()).toBe('1-1-2');
  });

  it('should reset scoreboard correctly', () => {
    service.addPoint('team1');
    service.addPoint('team2');
    service.sideOut();
    service.switchServer();
    
    service.reset();
    
    expect(service.scoreboard().team1Score).toBe(0);
    expect(service.scoreboard().team2Score).toBe(0);
    expect(service.scoreboard().servingTeam).toBe('team1');
    expect(service.scoreboard().server).toBe(1);
    expect(service.getThreeNumberScore()).toBe('0-0-1');
  });
});