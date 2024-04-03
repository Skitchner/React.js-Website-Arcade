import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import gameFolders from '../gameList'; // Import the generated list of games

const formatGameName = (s) => {
  if (typeof s !== 'string') return '';
  const newS = s.replace("_", " ");
  return newS.toUpperCase();
};

const Home = () => {
  return (
    <div className="game-list">
    <ul>
    {gameFolders.map((gameFolder, index) => (
      <li key={index} className="game-item grow">
      <Link to={`/${gameFolder.toLowerCase()}`}>
      <img
      src={`${process.env.PUBLIC_URL}/${gameFolder}/coverimage.png`}
      alt={`${gameFolder} cover`}/>
      <span>{formatGameName(gameFolder)}</span>
      
      </Link>
      </li>
      ))}
      </ul>
      </div>
      );
    };
    
    export default Home;
    