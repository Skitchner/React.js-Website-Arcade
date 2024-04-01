import React, { useState, useEffect } from 'react';
import './App.css';

const StartScreen = ({ onStart }) => (
  <div className="pong">
    <div
      className="overlay"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
      <div className="start-screen">
        <h1>Welcome to Pong!</h1>
        <button onClick={onStart}>Start Game</button>
      </div>
    </div>
  </div>
);

  const GameOverScreen = ({ score, onRestart }) => (
    <div className="pong">
      <div
        className="overlay"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
        <div className="game-over-screen">
          <h1>Game Over</h1>
          <p>Your score: {score}</p>
          <button onClick={onRestart}>Restart Game</button>
        </div>
      </div>
    </div>
  );



const Paddle = ({ top, isOpponent = false }) => (
  <div
    className="paddle"
    style={{
      top: `${top}%`,
      left: isOpponent ? 'auto' : '10px',
      right: isOpponent ? '10px' : 'auto',
    }}
  />
);

const Ball = ({ top, left }) => (
  <div className="ball" style={{ top: `${top}%`, left: `${left}%` }} />
);

function App() {
  const [paddlePos, setPaddlePos] = useState(40);
  const [opponentPaddlePos, setOpponentPaddlePos] = useState(40);
  const [ballPos, setBallPos] = useState({ top: 50, left: 50 });
  const [ballDirection, setBallDirection] = useState({ x: 1, y: -1 });
  const [ballSpeed, setBallSpeed] = useState(1.2);
  const baseBallSpeed = 1;
  const speedIncrement = 0.1;
  const [score, setScore] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  

  
  

  useEffect(() => {
    const interval = setInterval(() => {
      setBallSpeed(ballSpeed => ballSpeed + 0.04);
    }, 1000);
  return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    
    const handleKeyDown = (event) => {
      const paddleHeight = 20;
      if (event.key === 'ArrowUp' && paddlePos > 0) {
        setPaddlePos(prev => Math.max(prev - 5, 0)); // Adjust for smoother movement
      } else if (event.key === 'ArrowDown' && paddlePos < 100 - paddleHeight) { // Ensures paddle stays within bounds
        setPaddlePos(prev => Math.min(prev + 5, 100 - paddleHeight)); // Prevents moving below the bottom
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paddlePos]);

  useEffect(() => {
    if (!isGameStarted) return;
    const paddleHeight = 20;

    const moveBall = () => {
      let newTop = ballPos.top + ballDirection.y * ballSpeed;
      let newLeft = ballPos.left + ballDirection.x * ballSpeed;

      const willMiss = Math.random() < 0.9;

      // Move opponent paddle
      const opponentMoveSpeed = 1.3**score; // Adjust for difficulty
      if (ballPos.top > opponentPaddlePos + paddleHeight / 2) {
        setOpponentPaddlePos(prevPos => Math.min(prevPos + opponentMoveSpeed, 100 - paddleHeight));
      } else if (ballPos.top < opponentPaddlePos + paddleHeight / 2) {
        setOpponentPaddlePos(prevPos => Math.max(prevPos - opponentMoveSpeed, 0));
      }

      // Collision with top or bottom walls
      if (newTop <= 0 || newTop >= 95) {
        setBallDirection(prev => ({ ...prev, y: -prev.y }));
      }
      const ballDiameter = 3
      // Collision with player's paddle
      if (
        newLeft <= (1 + ballDiameter) && // Consider the paddle's width plus the ball's diameter
        newTop + ballDiameter >= paddlePos && // Adjusted to consider the ball's height
        newTop <= paddlePos + paddleHeight // Ensures accurate collision detection at the paddle's bottom edge
      ) {
        setBallDirection(prev => ({ ...prev, x: -prev.x }));
      }

      // Collision with opponent's paddle
      if (
        newLeft >= 95 - ballDiameter && // Adjust based on the screen width minus the ball's diameter for accuracy
        newTop + ballDiameter >= opponentPaddlePos && // Consider the ball's height for accurate detection
        newTop <= opponentPaddlePos + paddleHeight // Ensures collision detection at the paddle's bottom edge is accurate
      ) {
        setBallDirection(prev => ({ ...prev, x: -prev.x }));
      }

      // Ball missed the paddles
      if (newLeft < 0 || newLeft > 100) {
        setBallPos({ top: 50, left: 50 }); // Reset ball position
        if (newLeft < 0) {
          setIsGameOver(true);
        } else {
          setScore((currentScore) => currentScore + 1);
          setBallSpeed(currentSpeed => Math.min(currentSpeed + 0.1, 2)); // Increase ball speed slightly, cap at 2 for example
        }
      } else {
        setBallPos({ top: newTop, left: newLeft }); // Update ball position
      }
      const resetBallSpeed = () => {
        setBallSpeed(1); // Reset to initial speed when needed, e.g., starting a new game
      };

    };

    const updateOpponentPaddle = () => {
      const targetPos = ballPos.top - paddleHeight / 2;
      const moveSpeed = 0.05; // Adjust for smoother or faster interpolation
      setOpponentPaddlePos(prevPos => prevPos + (targetPos - prevPos) * moveSpeed);
    };
  
    // Setup intervals for ball and opponent paddle movement
    const ballInterval = setInterval(moveBall, 50); // Adjust interval for game speed preference
    const opponentInterval = setInterval(updateOpponentPaddle, 50); // Update opponent position
  
    // Cleanup function to clear intervals when component unmounts or game stops
    return () => {
      clearInterval(ballInterval);
      clearInterval(opponentInterval);
    };
  }, [ballPos, ballDirection, ballSpeed, isGameStarted, paddlePos, opponentPaddlePos, score]);
  const startGame = () => {
    setIsGameStarted(true);
  };
  
  const restartGame = () => {
    setPaddlePos(40); // Reset player paddle position
    setOpponentPaddlePos(40); // Reset opponent paddle position
    setBallPos({ top: 50, left: 50 }); // Reset ball position
    setBallSpeed(baseBallSpeed); // Reset ball speed to its base speed
    setScore(0); // Reset score
    setIsGameOver(false); // Reset game over flag
    setIsGameStarted(true); // Start the game immediately
  };
  

  if (!isGameStarted) {
    return <StartScreen onStart={startGame} />;
  }

  // ...

  if (isGameOver) {
    // Game over screen with the semi-transparent overlay
    return (
      <div className="pong">
        <div className="overlay">
          <GameOverScreen score={score} onRestart={restartGame} />
        </div>
        <Paddle top={paddlePos} isOpponent={false} />
        <Paddle top={opponentPaddlePos} isOpponent={true} />
        <Ball top={ballPos.top} left={ballPos.left} />
      </div>
    );
  } else if (!isGameStarted) {
    // Start screen with the semi-transparent overlay
    return (
      <div className="pong">
        <div className="overlay">
          <StartScreen onStart={startGame} />
        </div>
      </div>
    );
  }

  // Rest of your game rendering logic...

  return (
    <div className="pong">
      <Paddle top={paddlePos} isOpponent={false} />
      <Paddle top={opponentPaddlePos} isOpponent={true} /> {/* Assuming you have opponentPaddlePos state */}
      <Ball top={ballPos.top} left={ballPos.left} />
      <div className="score">Score: {score}</div>
    </div>
  );
  
}

export default App;
