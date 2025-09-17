# 🏓 Pickleball Learning Game

A fun, interactive pong-style game designed to teach beginners the rules and fundamentals of pickleball! This web-based game combines classic pong gameplay with educational elements that introduce players to pickleball's unique rules and court layout.

![Pickleball Game Screenshot](https://github.com/user-attachments/assets/11b00d4f-202b-43c7-a80f-e566ba5cc05c)

## 🎯 Features

### Educational Elements
- **Interactive Rule Learning**: Learn pickleball rules through gameplay tooltips
- **Authentic Court Layout**: Proper pickleball court with non-volley zones (kitchen) and service lines
- **Rule Explanations**: Dynamic tips that appear during gameplay to explain key concepts
- **Comprehensive Rules Modal**: Detailed reference for all pickleball rules

### Game Features
- **Smooth Pong-Style Gameplay**: Classic paddle and ball mechanics adapted for pickleball
- **Responsive Controls**: Mouse, keyboard, and touch controls for all devices
- **Score Tracking**: Official pickleball scoring (first to 11, must win by 2)
- **AI Opponent**: Computer player that simulates realistic pickleball gameplay
- **Pause/Resume**: Full game state management
- **Mobile Responsive**: Optimized for both desktop and mobile devices

![Game in Action](https://github.com/user-attachments/assets/3e2d38ec-2fc7-49aa-9f03-546abe0a409d)

## 🎮 How to Play

### Controls
- **Mouse**: Move your paddle by moving the mouse up and down
- **Keyboard**: Use arrow keys or W/S keys to control your paddle
- **Touch**: On mobile devices, touch and drag to control your paddle
- **Spacebar**: Pause/resume the game

### Game Rules Integrated
1. **Underhand Serve**: Ball movement simulates the slower pace of underhand serves
2. **Double Bounce Rule**: Educational tips explain when this rule applies
3. **Non-Volley Zone**: Shaded areas on court represent the 7-foot "kitchen" zones
4. **Scoring**: Only the serving team can score (simplified for pong-style gameplay)

## 🏃‍♂️ Getting Started

### Option 1: Open Directly
Simply open `index.html` in your web browser to start playing immediately.

### Option 2: Local Server (Recommended)
For the best experience, run a local server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

## 📱 Mobile Support

The game is fully responsive and works great on mobile devices:

![Mobile Version](https://github.com/user-attachments/assets/27e8dbf7-956f-4d0c-b623-061746e2d518)

## 🏗️ Technical Details

### Technologies Used
- **HTML5 Canvas**: For smooth game rendering and animations
- **JavaScript ES6**: Modern JavaScript for game logic and interactions  
- **CSS3**: Responsive design with gradients and animations
- **No Dependencies**: Pure vanilla web technologies for maximum compatibility

### Project Structure
```
pickleball/
├── index.html          # Main game page
├── game.js            # Game logic and mechanics
├── style.css          # Styling and responsive design
└── README.md          # This documentation
```

## 🎓 Educational Content

### Rules Covered
- **Underhand Serve Rule**: Must serve underhand below the waist
- **Double Bounce Rule**: Ball must bounce once on each side before volleys
- **Non-Volley Zone**: 7-foot zones where you cannot volley the ball
- **Scoring System**: Only serving team scores, first to 11 wins by 2
- **Court Layout**: Proper dimensions and zone markings

### Learning Approach
The game uses contextual learning - rules are explained as they become relevant during gameplay, making it easier for beginners to understand when and why each rule matters.

## 🔄 Future Enhancements

Potential improvements for future versions:
- Sound effects and audio feedback
- Multiple difficulty levels
- Tournament mode with multiple games
- Detailed statistics tracking
- Multiplayer support
- More advanced AI behaviors
- Additional court layouts and game modes

## 🤝 Contributing

This project welcomes contributions! Whether you want to:
- Add new educational content
- Improve the game mechanics
- Enhance the visual design
- Fix bugs or optimize performance

Feel free to open issues or submit pull requests.

## 📄 License

This project is open source and available for educational and recreational use.

---

**Start learning pickleball today!** 🏓 Open the game and discover why pickleball is one of the fastest-growing sports in America.