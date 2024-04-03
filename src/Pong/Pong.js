import React, { useState, useEffect } from 'react';
import './Pong.css';

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
        setPaddlePos(prev => Math.max(prev - 5, 0)); 
      } else if (event.key === 'ArrowDown' && paddlePos < 100 - paddleHeight) { 
        setPaddlePos(prev => Math.min(prev + 5, 100 - paddleHeight)); 
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

      
      const opponentMoveSpeed = 1.3**score; 
      if (ballPos.top > opponentPaddlePos + paddleHeight / 2) {
        setOpponentPaddlePos(prevPos => Math.min(prevPos + opponentMoveSpeed, 100 - paddleHeight));
      } else if (ballPos.top < opponentPaddlePos + paddleHeight / 2) {
        setOpponentPaddlePos(prevPos => Math.max(prevPos - opponentMoveSpeed, 0));
      }

      
      if (newTop <= 0 || newTop >= 95) {
        setBallDirection(prev => ({ ...prev, y: -prev.y }));
      }
      const ballDiameter = 3
      
      if (
        newLeft <= (1 + ballDiameter) && 
        newTop + ballDiameter >= paddlePos && 
        newTop <= paddlePos + paddleHeight 
      ) {
        setBallDirection(prev => ({ ...prev, x: -prev.x }));
      }

      
      if (
        newLeft >= 95 - ballDiameter && 
        newTop + ballDiameter >= opponentPaddlePos && 
        newTop <= opponentPaddlePos + paddleHeight 
      ) {
        setBallDirection(prev => ({ ...prev, x: -prev.x }));
      }

      
      if (newLeft < 0 || newLeft > 100) {
        setBallPos({ top: 50, left: 50 }); 
        if (newLeft < 0) {
          setIsGameOver(true);
        } else {
          setScore((currentScore) => currentScore + 1);
          setBallSpeed(currentSpeed => Math.min(currentSpeed + 0.1, 2)); 
        }
      } else {
        setBallPos({ top: newTop, left: newLeft }); 
      }
      const resetBallSpeed = () => {
        setBallSpeed(1); 
      };

    };

    const updateOpponentPaddle = () => {
      const targetPos = ballPos.top - paddleHeight / 2;
      const moveSpeed = 0.05; 
      setOpponentPaddlePos(prevPos => prevPos + (targetPos - prevPos) * moveSpeed);
    };
  
    
    const ballInterval = setInterval(moveBall, 50); 
    const opponentInterval = setInterval(updateOpponentPaddle, 50); 
  
    
    return () => {
      clearInterval(ballInterval);
      clearInterval(opponentInterval);
    };
  }, [ballPos, ballDirection, ballSpeed, isGameStarted, paddlePos, opponentPaddlePos, score]);
  const startGame = () => {
    setIsGameStarted(true);
  };
  
  const restartGame = () => {
    setPaddlePos(40); 
    setOpponentPaddlePos(40); 
    setBallPos({ top: 50, left: 50 }); 
    setBallSpeed(baseBallSpeed); 
    setScore(0); 
    setIsGameOver(false); 
    setIsGameStarted(true); 
  };
  

  if (!isGameStarted) {
    return <StartScreen onStart={startGame} />;
  }


  if (isGameOver) {
    
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
    
    return (
      <div className="pong">
        <div className="overlay">
          <StartScreen onStart={startGame} />
        </div>
      </div>
    );
  }

  return (
    <div className="pong">
      <Paddle top={paddlePos} isOpponent={false} />
      <Paddle top={opponentPaddlePos} isOpponent={true} />
      <Ball top={ballPos.top} left={ballPos.left} />
      <div className="score">Score: {score}</div>
    </div>
  );
  
}

export default App;