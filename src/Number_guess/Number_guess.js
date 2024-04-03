import React, { useState } from 'react';
import './Number_guess.css'; 

const NumberGuess = () => {
  const [targetNumber, setTargetNumber] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [range, setRange] = useState({min: 1, max: 100});

  const handleGuess = (number) => {
    setGuess(number);
    if (number === targetNumber) {
      setFeedback(`🎉 Correct! The number was ${number}.`);
    } else {
      const distance = Math.abs(number - targetNumber);
      let hotOrCold = distance <= 10 ? '🔥 Hot' : '❄️ Cold';
      if (number < targetNumber) {
        setFeedback(`📈 Too low! ${hotOrCold}`);
        setRange(prev => ({...prev, min: number + 1}));
      } else {
        setFeedback(`📉 Too high! ${hotOrCold}`);
        setRange(prev => ({...prev, max: number - 1}));
      }
    }
  };

  const resetGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setGuess(null);
    setFeedback('');
    setRange({min: 1, max: 100});
  };

  return (
    <div className="game-box">
      <h2>Guess the Number 🕵️‍♂️</h2>
      {feedback && <p>{feedback}</p>}
      <div className="grid">
        {Array.from({length: 100}, (_, i) => i + 1).map((number) => (
          <button key={number} disabled={number < range.min || number > range.max} onClick={() => handleGuess(number)}>
            {number}
          </button>
        ))}
      </div>
      <button className="reset-button" onClick={resetGame}>Reset Game</button>
    </div>
  );
};

export default NumberGuess;
