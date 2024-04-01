import React, { useState } from 'react';
import './Number_guess.css';

function GuessTheNumberGame() {
  const [number, setNumber] = useState(Math.floor(Math.random() * 100) + 1);
  const [message, setMessage] = useState('Guess a number between 1 and 100');
  const [guessCount, setGuessCount] = useState(0);
  const [highScore, setHighScore] = useState(Infinity);
  const [lastGuess, setLastGuess] = useState(null);
  const [previousGuesses, setPreviousGuesses] = useState([]);
  const [numbers, setNumbers] = useState(Array.from({ length: 100 }, (_, i) => ({ value: i + 1, enabled: true })));

  const checkGuess = (numGuess) => {
    setLastGuess(numGuess);
    setGuessCount(prevCount => prevCount + 1);
    setPreviousGuesses(prevGuesses => [...prevGuesses, numGuess]);

    setNumbers(numbers.map(num => {
      if (numGuess > number && num.value >= numGuess) return { ...num, enabled: false };
      if (numGuess < number && num.value <= numGuess) return { ...num, enabled: false };
      return num;
    }));
    
    if (numGuess > number) {
      setMessage('Too high!');
    } else if (numGuess < number) {
      setMessage('Too low!');
    } else {
      setMessage(`Correct! The number was ${number}. 🎉`);
      const newCount = guessCount + 1;
      if (newCount < highScore || highScore === Infinity) {
        setHighScore(newCount);
      }
      resetGame();
    }
  };

  const resetGame = () => {
    setNumber(Math.floor(Math.random() * 100) + 1);
    setMessage('Guess a number between 1 and 100');
    setGuessCount(0);
    setLastGuess(null);
    setPreviousGuesses([]);
    setNumbers(Array.from({ length: 100 }, (_, i) => ({ value: i + 1, enabled: true })));
  };

  const getHint = () => {
    if (!lastGuess) return 'Make your guess! 🤔';
    const hintDistance = Math.abs(lastGuess - number);
    const hint = hintDistance < 10 ? 'Hot! 🔥' : hintDistance < 20 ? 'Warm. 🌡️' : 'Cold. ❄️';
    return `${lastGuess}: ${hint}`;
  };

  const messageType = (msg) => {
    if (msg.includes('high') || msg.includes('low')) {
      return { class: 'warning', emoji: msg.includes('high') ? '📈' : '📉' };
    } else if (msg.includes('Correct')) {
      return { class: 'success', emoji: '🎉' };
    }
    return { class: 'info', emoji: '' };
  };

  const { class: msgClass, emoji } = messageType(message);
  
  return (
    <div className="game-box">
      <p className={`message-${msgClass}`}>{message} {emoji}</p>
      {lastGuess !== null && <p className="message-info">{getHint()}</p>}
      {highScore !== Infinity && <p className="message-success">High Score: {highScore} guesses 🏆</p>}
      <div className="numbers">
        {numbers.map((num) => (
          <button
            key={num.value}
            disabled={!num.enabled}
            onClick={() => checkGuess(num.value)}
            className={`number ${!num.enabled ? 'disabled' : ''}`}
          >
            {num.value}
          </button>
        ))}
      </div>
      <button onClick={resetGame}>Reset</button>
    </div>
  );
}

export default GuessTheNumberGame;
