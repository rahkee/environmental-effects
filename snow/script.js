// Get the canvas element and its context
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// Circle class to manage individual circles
class Circle {
  constructor() {
    // Use exponential distribution to favor smaller circles
    const randomValue = Math.random();
    this.radius = Math.pow(randomValue, 3) * 4 + 1; // Using cubic power for stronger bias towards small circles, max radius 5px (10px diameter)

    // Randomly choose starting position (top or left)
    if (Math.random() < 0.5) {
      // Start from top
      this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
      this.y = -this.radius;
    } else {
      // Start from left
      this.x = -this.radius;
      this.y = Math.random() * (canvas.height - this.radius * 2) + this.radius;
    }

    this.velocity = (Math.random() * 2);
    this.windSpeed = (Math.random() * .5); // Reduced wind speed by 25%
    this.windChange = 0.02; // How quickly wind direction changes
    this.windOffset = Math.random() * Math.PI * 2; // Random starting point in the wind pattern
    this.baseWind = .5; // Slower base rightward drift
  }

  update() {
    // Update vertical position
    this.y += this.velocity;

    // Update horizontal position with wind effect
    this.windOffset += this.windChange;
    // Add base wind and oscillating component
    this.x += this.baseWind + Math.sin(this.windOffset) * this.windSpeed;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.globalCompositeOperation = 'difference';
    ctx.fill();
    ctx.closePath();
    ctx.globalCompositeOperation = 'source-over'; // Reset composite operation
  }
}

// Array to store all circles
let circles = [];

// Function to create a new circle
function createCircle() {
  circles.push(new Circle());
}

// Function to draw the text
function drawText() {
  ctx.fillStyle = 'white';
  ctx.font = '450px "Six Caps"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '-0.025em'; // Reduce letter spacing
  ctx.fillText('RUIN', canvas.width / 2, canvas.height / 2);
  ctx.letterSpacing = 'normal'; // Reset letter spacing
}

// Clear the canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawText(); // Redraw the text after clearing
}

// Animation loop
function animate() {
  clearCanvas();

  // Update and draw all circles
  circles = circles.filter(circle => {
    circle.update();
    circle.draw();
    // Remove circles that have fallen off screen (bottom, left, or right)
    return circle.y < canvas.height + circle.radius &&
      circle.x > -circle.radius &&
      circle.x < canvas.width + circle.radius;
  });

  // Create multiple new circles each frame
  for (let i = 0; i < 1; i++) {
    createCircle();
  }

  requestAnimationFrame(animate);
}

// Initialize the animation when the page loads
window.addEventListener('load', () => {
  // Create initial circles
  for (let i = 0; i < 5; i++) { // Reduced from 3000 to 1500 initial circles
    createCircle();
  }
  animate();
}); 