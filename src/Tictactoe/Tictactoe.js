import React, { useState, useEffect } from 'react';
import Board from './Board'; 

function TicTacToe() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, Ties: 0 });

  const winner = calculateWinner(squares);
  const tie = !winner && squares.every(square => square !== null);

  const handleClick = (i) => {
    if (winner || tie || squares[i]) return;
    const squaresCopy = squares.slice();
    squaresCopy[i] = xIsNext ? 'X' : 'O';
    setSquares(squaresCopy);
    setXIsNext(!xIsNext);
  };

  const handleReset = () => {
    if (winner) {
      setScores({ ...scores, [winner]: scores[winner] + 1 });
    } else if (tie) {
      setScores({ ...scores, Ties: scores.Ties + 1 });
    }
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };
  
  function resetScores() {
    setScores({ X: 0, O: 0, Ties: 0 });
  }
  
  const status = winner ? `Winner: ${winner}` : tie ? 'Tie Game!' : `Next player: ${xIsNext ? 'X' : 'O'}`;
  return (
    <div className="game">
      <Board squares={squares} onClick={handleClick} />
      <div className="game-info">
        <div>{status}</div>
        {(winner || tie) && (
          <button onClick={handleReset}>Reset Game</button>
        )}
        <div className="scores">
          <p>X Wins: {scores.X}</p>
          <p>O Wins: {scores.O}</p>
          <p>Ties: {scores.Ties}</p>
        </div>
        <button onClick={resetScores} className="reset-scores-button">Reset Scores</button>
      </div>
    </div>
  );
  
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default TicTacToe;
