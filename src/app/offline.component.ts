import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-offline',
  template: `
    <section class="offline">
      <div class="offline-content">
        <h1>🏓 You're Offline</h1>
        <p>No worries! LearnPickle works offline.</p>
        <p>You can still access all the features you've visited before.</p>
        
        <div class="offline-features">
          <h3>Available Offline:</h3>
          <ul>
            <li>📚 Rules Reference</li>
            <li>🎯 Practice Scenarios</li>
            <li>🎮 Arcade Mode</li>
            <li>❓ Quiz Challenges</li>
          </ul>
        </div>
        
        <div class="offline-tip">
          <p><strong>Tip:</strong> When you're back online, any progress will be synced automatically.</p>
        </div>
        
        <button onclick="window.location.reload()" class="retry-button">
          🔄 Try Again
        </button>
      </div>
    </section>
  `,
  styles: [`
    .offline {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-family: 'Fira Sans', 'Segoe UI', system-ui, sans-serif;
      padding: 2rem;
    }
    
    .offline-content {
      max-width: 500px;
      text-align: center;
      background: rgba(255, 255, 255, 0.1);
      padding: 3rem 2rem;
      border-radius: 20px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .offline h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      font-weight: 700;
    }
    
    .offline p {
      font-size: 1.1rem;
      margin-bottom: 1rem;
      opacity: 0.9;
    }
    
    .offline-features {
      margin: 2rem 0;
      text-align: left;
    }
    
    .offline-features h3 {
      font-size: 1.3rem;
      margin-bottom: 1rem;
      text-align: center;
    }
    
    .offline-features ul {
      list-style: none;
      padding: 0;
    }
    
    .offline-features li {
      padding: 0.5rem 0;
      font-size: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .offline-tip {
      background: rgba(255, 255, 255, 0.1);
      padding: 1rem;
      border-radius: 10px;
      margin: 2rem 0;
    }
    
    .retry-button {
      background: linear-gradient(45deg, #ff6b6b, #ee5a24);
      border: none;
      color: white;
      padding: 1rem 2rem;
      font-size: 1.1rem;
      border-radius: 50px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 600;
    }
    
    .retry-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
    }
  `]
})
export class OfflineComponent {}