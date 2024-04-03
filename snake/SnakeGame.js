import React, { useState, useEffect } from 'react';
import './App.css';

const gridSize = 20;
const gridUnit = 25;

function App() {
  const [snake, setSnake] = useState([{ x: 2, y: 2 }]);
  const [direction, setDirection] = useState('RIGHT');
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp': setDirection('UP'); break;
        case 'ArrowDown': setDirection('DOWN'); break;
        case 'ArrowLeft': setDirection('LEFT'); break;
        case 'ArrowRight': setDirection('RIGHT'); break;
        default: break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!gameStart) return;

    const moveSnake = () => {
      let newSnake = [...snake];
      let head = { ...newSnake[newSnake.length - 1] };

      switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
        default: break;
      }

      if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize || newSnake.find(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return;
      }

      newSnake.push(head);
      if (head.x === food.x && head.y === food.y) {
        setScore(score + 1);
        setFood({ x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) });
      } else {
        newSnake.shift();
      }

      setSnake(newSnake);
    };

    const gameLoop = setInterval(moveSnake, 200);

    return () => clearInterval(gameLoop);
  }, [snake, direction, gameStart, food, score]);

  const startGame = () => {
    setGameStart(true);
    setGameOver(false);
    setSnake([{ x: 2, y: 2 }]);
    setDirection('RIGHT');
    setFood({ x: 5, y: 5 });
    setScore(0);
  };

  return (
    <div className="App">
      {!gameStart ? (
        <div className="overlay">
          <div className="screen startScreen">
            <h2>Welcome to Snake Game!</h2>
            <p>Hit the button to start playing</p>
            <button onClick={startGame} className="startButton">Start Game</button>
          </div>
        </div>
      ) : gameOver ? (
        <div className="overlay">
          <div className="screen gameOverScreen">
            <h2>Game Over</h2>
            <p>Your final score: {score}</p>
            <button onClick={startGame} className="restartButton">Restart</button>
          </div>
        </div>
      ) : (
        <div>
          <div className="game-area" style={{ width: gridSize * gridUnit, height: gridSize * gridUnit }}>
            {snake.map((segment, index) => (
              <div className="snake" key={index} style={{ left: `${segment.x * gridUnit}px`, top: `${segment.y * gridUnit}px` }}></div>
            ))}
            <div className="food" style={{ left: `${food.x * gridUnit}px`, top: `${food.y * gridUnit}px` }}></div>
          </div>
          <div className="score">Score: {score}</div>
        </div>
      )}
    </div>
  );
  

}

export default App;
