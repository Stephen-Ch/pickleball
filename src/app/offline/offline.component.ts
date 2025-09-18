import { Component } from '@angular/core';

@Component({
  selector: 'app-offline',
  standalone: true,
  template: `
    <div class="offline-container">
      <div class="offline-content">
        <div class="offline-icon">🏓</div>
        <h1>You're Offline</h1>
        <p class="offline-message">
          It looks like you've lost your internet connection. Don't worry, you can still access 
          the pages you've visited before!
        </p>
        <div class="offline-tips">
          <h2>While offline, you can:</h2>
          <ul>
            <li>Review rules you've already learned</li>
            <li>Practice scenarios you've completed</li>
            <li>Check your badge progress</li>
          </ul>
        </div>
        <button class="retry-button" onclick="window.location.reload()">
          Try Again
        </button>
      </div>
    </div>
  `,
  styles: [`
    .offline-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
      padding: 2rem;
      background: var(--background-color);
    }

    .offline-content {
      text-align: center;
      max-width: 500px;
      background: var(--background-secondary);
      border: 2px solid var(--primary-color);
      border-radius: 8px;
      padding: 3rem 2rem;
    }

    .offline-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      filter: grayscale(1);
    }

    h1 {
      font-family: 'Consolas', monospace;
      color: var(--primary-color);
      font-size: 2.5rem;
      margin-bottom: 1rem;
      text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
    }

    .offline-message {
      color: var(--text-color);
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .offline-tips {
      text-align: left;
      margin-bottom: 2rem;
    }

    .offline-tips h2 {
      font-family: 'Consolas', monospace;
      color: var(--accent-color);
      font-size: 1.3rem;
      margin-bottom: 1rem;
      text-align: center;
    }

    .offline-tips ul {
      color: var(--text-color);
      padding-left: 1.5rem;
    }

    .offline-tips li {
      margin-bottom: 0.5rem;
    }

    .retry-button {
      background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
      color: var(--background-color);
      border: none;
      padding: 1rem 2rem;
      font-size: 1.1rem;
      font-weight: bold;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: 'Consolas', monospace;
    }

    .retry-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 255, 255, 0.3);
    }

    .retry-button:active {
      transform: translateY(0);
    }

    @media (max-width: 768px) {
      .offline-container {
        padding: 1rem;
      }

      .offline-content {
        padding: 2rem 1rem;
      }

      h1 {
        font-size: 2rem;
      }

      .offline-icon {
        font-size: 3rem;
      }
    }
  `]
})
export class OfflineComponent {
}