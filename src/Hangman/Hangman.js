import React, { useState, useEffect } from 'react';
import './Hangman.css';

function Hangman() {
  const [word, setWord] = useState('');
  const [displayWord, setDisplayWord] = useState('');
  const [guesses, setGuesses] = useState(6);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [difficulty, setDifficulty] = useState('easy');
  
  const difficultySettings = {
    easy: { minWordLength: 6, maxWordLength: 9, commonalityDivider: 80, guessesAllowed: 8 },
    medium: { minWordLength: 7, maxWordLength: 11, commonalityDivider: 55, guessesAllowed: 7 },
    hard: { minWordLength: 8, maxWordLength: 13, commonalityDivider: 25, guessesAllowed: 6 }
  };
  
  const generateQuery = (minLength, maxLength) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength - 1;
    return randomChar + '?'.repeat(length);
  };
  
  
  const isValidWord = (word) => /^[A-Z]+$/.test(word);
  
  const fetchWord = async (difficultyLevel = difficulty) => {
    const { minWordLength, maxWordLength, commonalityDivider } = difficultySettings[difficultyLevel];
    setGuessedLetters([]);
  
    let validWordFound = false;
    let randomWord = '';
  
    while (!validWordFound) {
      const query = generateQuery(minWordLength, maxWordLength);
      const response = await fetch(`https://api.datamuse.com/words?sp=${query}&max=1000&md=f`);
      const words = await response.json();
  
      const _ = require('lodash');
      const sortedWords = _.orderBy(words, [
        word => {
          const fTag = word.tags?.find(tag => tag.startsWith('f:'));
          return fTag ? parseFloat(fTag.split(':')[1]) : 0;
        }
      ], ['desc', 'asc']);    
  
      const commonWords = sortedWords.slice(0, sortedWords.length / commonalityDivider);
  
      for (const wordObj of commonWords) {
        randomWord = wordObj.word.toUpperCase();
  
        // Check if the word contains only alphabet characters
        if (!isValidWord(randomWord)) {
          continue; // Skip to the next word if it contains non-alphabet characters
        }
  
        try {
          const dictResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord.toLowerCase()}`);
          if (dictResponse.ok) {
            const dictData = await dictResponse.json();
            if (!dictData.title || dictData.title !== "No Definitions Found") {
              validWordFound = true;
              break;
            }
          }
        } catch (error) {
          console.error('Error fetching word from dictionary:', error);
        }
      }
    }
  
    if (validWordFound) {
      setWord(randomWord);
      setDisplayWord('_ '.repeat(randomWord.length));
      setGuesses(difficultySettings[difficultyLevel].guessesAllowed);
    } else {
      console.error('No valid word found within the given parameters.');
    }
  };
  
  
  
  useEffect(() => {
    fetchWord();
  }, [difficulty]);
  
  useEffect(() => {
    const onKeyDown = (event) => {
      const letter = event.key.toUpperCase();
      if (event.keyCode >= 65 && event.keyCode <= 90 && !guessedLetters.includes(letter) && guesses > 0 && word) {
        handleGuess(letter);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [guessedLetters, guesses, word, displayWord]);
  
  const handleGuess = (letter) => {
    if (guessedLetters.includes(letter)) {
      return;
    }
    let newDisplay = displayWord.split(' ');
    let wrongGuess = true;
    
    for (let i = 0; i < word.length; i++) {
      if (word[i] === letter) {
        newDisplay[i] = letter;
        wrongGuess = false;
      }
    }
    
    setDisplayWord(newDisplay.join(' '));
    setGuessedLetters(prevLetters => [...prevLetters, letter]);
    
    if (wrongGuess) {
      setGuesses(prevGuesses => prevGuesses - 1);
    }
  };
  
  const resetGame = (newDifficulty) => {
    setDifficulty(newDifficulty);
    setGuessedLetters([]);
    setGuesses(difficultySettings[newDifficulty].guessesAllowed);
    fetchWord(newDifficulty);
  };
  
  
  const getHangmanImage = () => {
    const totalGuesses = difficultySettings[difficulty].guessesAllowed;
    const imageIndex = totalGuesses - guesses;
    return `/Hangman/hangman ${imageIndex}.svg`;
  }
  
  return (
    <div className="hangman">
    <div className="game-box">
    <p className="guesses-left">{guesses}</p>
    <img src={getHangmanImage()} alt="Hangman" className={`hangman-image`} />
    <p className={`word`}>{displayWord}</p>
    <p className="guessed-letters">{guessedLetters.join(' ')}</p>
    {guesses === 0 ? (
      <p className="result loss-message">You lost! The word was {word}.</p>
      ) : null}
      {!displayWord.includes('_') && guesses > 0 ? (
        <p className="result win-message">You won! Click a new difficulty to play again.</p>
        ) : null}
        {(guesses === 0 || (!displayWord.includes('_') && guesses > 0)) && (
          <div>
          <div className="difficulty">
          <button onClick={() => resetGame('easy')}>EASY</button>
          <button onClick={() => resetGame('medium')}>MEDIUM</button>
          <button onClick={() => resetGame('hard')}>HARD</button>
          </div>
          </div>
          )}
          </div>
          </div>
          );
          
          
        }
        
        export default Hangman;
        