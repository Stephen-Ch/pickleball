class PickleballGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game state
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameMode = 'practice';
        
        // Scores
        this.playerScore = 0;
        this.computerScore = 0;
        this.maxScore = 11;
        
        // Game objects
        this.player = {
            x: 20,
            y: this.canvas.height / 2 - 40,
            width: 15,
            height: 80,
            speed: 6,
            color: '#ff6b35'
        };
        
        this.computer = {
            x: this.canvas.width - 35,
            y: this.canvas.height / 2 - 40,
            width: 15,
            height: 80,
            speed: 4,
            color: '#4a7c59'
        };
        
        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            radius: 8,
            speedX: 5,
            speedY: 3,
            color: '#fff',
            bounceCount: 0,
            maxSpeed: 8
        };
        
        // Pickleball court elements
        this.court = {
            netWidth: 4,
            nonVolleyZoneWidth: 70, // 7 feet scaled to canvas
            serviceLineY: 100 // Service court lines
        };
        
        // Educational tips
        this.currentTip = 0;
        this.tips = [
            {
                title: "Underhand Serve",
                text: "In pickleball, all serves must be underhand and below the waist. The ball is moving slowly to simulate this!"
            },
            {
                title: "Double Bounce Rule",
                text: "The ball must bounce once on each side before players can volley (hit in the air)."
            },
            {
                title: "Non-Volley Zone",
                text: "The shaded areas near the net are 'kitchens' - you can't volley the ball here!"
            },
            {
                title: "Scoring",
                text: "Only the serving team can score points. Games are played to 11, must win by 2."
            },
            {
                title: "Keep Playing!",
                text: "Great job! Keep practicing to master these pickleball fundamentals."
            }
        ];
        
        // Input handling
        this.keys = {};
        this.mouseY = this.canvas.height / 2;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.showTip(0);
        this.gameLoop();
    }
    
    setupEventListeners() {
        // Button controls
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('rulesBtn').addEventListener('click', () => this.showRules());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        
        // Rules modal
        const modal = document.getElementById('rulesModal');
        const closeBtn = document.querySelector('.close');
        closeBtn.addEventListener('click', () => modal.style.display = 'none');
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === ' ') {
                e.preventDefault();
                this.togglePause();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // Mouse controls
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseY = e.clientY - rect.top;
        });
        
        // Touch controls for mobile
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            this.mouseY = e.touches[0].clientY - rect.top;
        });
    }
    
    startGame() {
        this.gameRunning = true;
        this.gamePaused = false;
        document.getElementById('startBtn').textContent = 'Restart';
        this.resetBall();
    }
    
    togglePause() {
        if (this.gameRunning) {
            this.gamePaused = !this.gamePaused;
            document.getElementById('pauseBtn').textContent = this.gamePaused ? 'Resume' : 'Pause';
        }
    }
    
    resetGame() {
        this.gameRunning = false;
        this.gamePaused = false;
        this.playerScore = 0;
        this.computerScore = 0;
        this.currentTip = 0;
        this.resetBall();
        this.updateScore();
        this.showTip(0);
        document.getElementById('startBtn').textContent = 'Start Game';
        document.getElementById('pauseBtn').textContent = 'Pause';
    }
    
    resetBall() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
        this.ball.speedX = (Math.random() > 0.5 ? 1 : -1) * 5;
        this.ball.speedY = (Math.random() - 0.5) * 6;
        this.ball.bounceCount = 0;
    }
    
    update() {
        if (!this.gameRunning || this.gamePaused) return;
        
        this.updatePaddles();
        this.updateBall();
        this.checkCollisions();
        this.checkScore();
    }
    
    updatePaddles() {
        // Player paddle control
        if (this.keys['ArrowUp'] || this.keys['w']) {
            this.player.y = Math.max(0, this.player.y - this.player.speed);
        }
        if (this.keys['ArrowDown'] || this.keys['s']) {
            this.player.y = Math.min(this.canvas.height - this.player.height, this.player.y + this.player.speed);
        }
        
        // Mouse control
        const targetY = this.mouseY - this.player.height / 2;
        this.player.y = Math.max(0, Math.min(this.canvas.height - this.player.height, targetY));
        
        // Computer AI (simulates pickleball player behavior)
        const ballCenterY = this.ball.y;
        const computerCenterY = this.computer.y + this.computer.height / 2;
        
        if (ballCenterY < computerCenterY - 10) {
            this.computer.y = Math.max(0, this.computer.y - this.computer.speed);
        } else if (ballCenterY > computerCenterY + 10) {
            this.computer.y = Math.min(this.canvas.height - this.computer.height, this.computer.y + this.computer.speed);
        }
    }
    
    updateBall() {
        this.ball.x += this.ball.speedX;
        this.ball.y += this.ball.speedY;
        
        // Ball bouncing off top and bottom walls
        if (this.ball.y <= this.ball.radius || this.ball.y >= this.canvas.height - this.ball.radius) {
            this.ball.speedY = -this.ball.speedY;
        }
    }
    
    checkCollisions() {
        // Player paddle collision
        if (this.ball.x - this.ball.radius <= this.player.x + this.player.width &&
            this.ball.x + this.ball.radius >= this.player.x &&
            this.ball.y >= this.player.y &&
            this.ball.y <= this.player.y + this.player.height) {
            
            this.ball.speedX = Math.abs(this.ball.speedX);
            this.ball.bounceCount++;
            this.handlePickleballRules();
            
            // Add spin based on where ball hits paddle
            const hitPos = (this.ball.y - this.player.y) / this.player.height;
            this.ball.speedY = (hitPos - 0.5) * 8;
        }
        
        // Computer paddle collision
        if (this.ball.x + this.ball.radius >= this.computer.x &&
            this.ball.x - this.ball.radius <= this.computer.x + this.computer.width &&
            this.ball.y >= this.computer.y &&
            this.ball.y <= this.computer.y + this.computer.height) {
            
            this.ball.speedX = -Math.abs(this.ball.speedX);
            this.ball.bounceCount++;
            
            // Add some variation to computer hits
            const hitPos = (this.ball.y - this.computer.y) / this.computer.height;
            this.ball.speedY = (hitPos - 0.5) * 6;
        }
    }
    
    handlePickleballRules() {
        // Simulate pickleball rules through gameplay mechanics
        
        // Double bounce rule simulation
        if (this.ball.bounceCount === 2) {
            this.showTip(1); // Double bounce rule tip
        }
        
        // Non-volley zone enforcement
        if (this.ball.x > this.court.nonVolleyZoneWidth && 
            this.ball.x < this.canvas.width - this.court.nonVolleyZoneWidth) {
            // Ball is in non-volley zone
            if (this.ball.bounceCount % 4 === 0) {
                this.showTip(2); // Non-volley zone tip
            }
        }
        
        // Speed limitation (underhand serve simulation)
        if (Math.abs(this.ball.speedX) > this.ball.maxSpeed) {
            this.ball.speedX = this.ball.speedX > 0 ? this.ball.maxSpeed : -this.ball.maxSpeed;
        }
        if (Math.abs(this.ball.speedY) > this.ball.maxSpeed) {
            this.ball.speedY = this.ball.speedY > 0 ? this.ball.maxSpeed : -this.ball.maxSpeed;
        }
    }
    
    checkScore() {
        // Player scores
        if (this.ball.x > this.canvas.width) {
            this.playerScore++;
            this.updateScore();
            this.resetBall();
            this.showTip(3); // Scoring tip
            
            if (this.playerScore >= this.maxScore && this.playerScore - this.computerScore >= 2) {
                this.endGame('Player Wins!');
            }
        }
        
        // Computer scores
        if (this.ball.x < 0) {
            this.computerScore++;
            this.updateScore();
            this.resetBall();
            
            if (this.computerScore >= this.maxScore && this.computerScore - this.playerScore >= 2) {
                this.endGame('Computer Wins!');
            }
        }
    }
    
    endGame(winner) {
        this.gameRunning = false;
        this.showTip(4); // Final tip
        alert(`${winner} - Great job learning pickleball rules!`);
    }
    
    updateScore() {
        document.getElementById('playerScore').textContent = this.playerScore;
        document.getElementById('computerScore').textContent = this.computerScore;
        
        // Add animation
        document.getElementById('playerScore').classList.add('score-animation');
        document.getElementById('computerScore').classList.add('score-animation');
        
        setTimeout(() => {
            document.getElementById('playerScore').classList.remove('score-animation');
            document.getElementById('computerScore').classList.remove('score-animation');
        }, 500);
    }
    
    showTip(tipIndex) {
        if (tipIndex < this.tips.length) {
            const tip = this.tips[tipIndex];
            document.getElementById('tipTitle').textContent = tip.title;
            document.getElementById('tipText').textContent = tip.text;
            this.currentTip = tipIndex;
        }
    }
    
    showRules() {
        document.getElementById('rulesModal').style.display = 'block';
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#1a4d3a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawCourt();
        this.drawPaddles();
        this.drawBall();
        
        if (this.gamePaused) {
            this.drawPauseScreen();
        }
    }
    
    drawCourt() {
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        
        // Center line (net)
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(this.canvas.width / 2 - this.court.netWidth / 2, 0, this.court.netWidth, this.canvas.height);
        
        // Non-volley zones (kitchen)
        this.ctx.fillStyle = 'rgba(255, 107, 53, 0.2)';
        this.ctx.fillRect(0, 0, this.court.nonVolleyZoneWidth, this.canvas.height);
        this.ctx.fillRect(this.canvas.width - this.court.nonVolleyZoneWidth, 0, this.court.nonVolleyZoneWidth, this.canvas.height);
        
        // Service lines
        this.ctx.beginPath();
        this.ctx.setLineDash([5, 5]);
        this.ctx.moveTo(this.court.nonVolleyZoneWidth, this.court.serviceLineY);
        this.ctx.lineTo(this.canvas.width / 2, this.court.serviceLineY);
        this.ctx.moveTo(this.canvas.width / 2, this.court.serviceLineY);
        this.ctx.lineTo(this.canvas.width - this.court.nonVolleyZoneWidth, this.court.serviceLineY);
        
        this.ctx.moveTo(this.court.nonVolleyZoneWidth, this.canvas.height - this.court.serviceLineY);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height - this.court.serviceLineY);
        this.ctx.moveTo(this.canvas.width / 2, this.canvas.height - this.court.serviceLineY);
        this.ctx.lineTo(this.canvas.width - this.court.nonVolleyZoneWidth, this.canvas.height - this.court.serviceLineY);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
    
    drawPaddles() {
        // Player paddle
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // Computer paddle
        this.ctx.fillStyle = this.computer.color;
        this.ctx.fillRect(this.computer.x, this.computer.y, this.computer.width, this.computer.height);
    }
    
    drawBall() {
        this.ctx.fillStyle = this.ball.color;
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Add trail effect
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x - this.ball.speedX, this.ball.y - this.ball.speedY, this.ball.radius * 0.7, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawPauseScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        
        this.ctx.font = '20px Arial';
        this.ctx.fillText('Press SPACE or click Pause to resume', this.canvas.width / 2, this.canvas.height / 2 + 50);
    }
    
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new PickleballGame();
});