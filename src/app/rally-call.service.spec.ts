import { RallyCallService, RallyEvent } from './rally-call.service';

describe('RallyCallService', () => {
  let service: RallyCallService;

  beforeEach(() => {
    service = new RallyCallService();
  });

  it('should handle kitchen volley fault', () => {
    const event: RallyEvent = { type: 'fault', reason: 'kitchen-volley' };
    const call = service.makeCall(event);
    expect(call.call).toBe('Fault: Kitchen volley');
    expect(call.explainer).toContain('non-volley zone');
  });

  it('should handle wrong server fault', () => {
    const event: RallyEvent = { type: 'fault', reason: 'wrong-server' };
    const call = service.makeCall(event);
    expect(call.call).toBe('Fault: Wrong server');
    expect(call.explainer).toContain('wrong player');
  });

  it('should handle point scored', () => {
    const event: RallyEvent = { type: 'point', scoringTeam: 'team1' };
    const call = service.makeCall(event);
    expect(call.call).toBe('Point scored');
    expect(call.explainer).toContain('Team 1');
  });

  it('should handle side-out', () => {
    const event: RallyEvent = { type: 'side-out', servingTeam: 'team2' };
    const call = service.makeCall(event);
    expect(call.call).toBe('Side-out');
    expect(call.explainer).toContain('Team 2 now serves');
  });

  it('should handle out of bounds fault', () => {
    const event: RallyEvent = { type: 'fault', reason: 'out' };
    const call = service.makeCall(event);
    expect(call.call).toBe('Fault: Out');
    expect(call.explainer).toContain('outside the court');
  });

  it('should handle unknown event gracefully', () => {
    const event = { type: 'unknown' } as any;
    const call = service.makeCall(event);
    expect(call.call).toBe('Unknown');
    expect(call.explainer).toContain('Unexpected');
  });
});