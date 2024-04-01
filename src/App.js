import React, { Suspense, lazy, useEffect } from 'react'; // Import Suspense and lazy here
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  Navigate,
} from 'react-router-dom';

// Utility function to capitalize the first letter of a string
const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const DynamicGameComponent = () => {
  const { gameName } = useParams(); // Using useParams to extract parameters
  // Dynamically import the game component based on the URL path
  const GameComponent = lazy(() =>
    import(`./${capitalize(gameName)}/${capitalize(gameName)}`).catch(() =>
      import('./NotFound')
    ),
  );

  return (
    <Suspense fallback={<div>Loading game...</div>}>
      <GameComponent />
    </Suspense>
  );
};

function App() {
  useEffect(() => {
    // Function to prevent default action for up and down arrow keys
    const preventScroll = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
      }
    };
    
    // Add event listener when component mounts
    window.addEventListener('keydown', preventScroll);
    
    // Cleanup function to remove event listener when component unmounts
    return () => window.removeEventListener('keydown', preventScroll);
  }, []);


  return (
    <Router>
      <div className="App">
        <Header className="App-header" />
        <main className="App-main">
            <Routes>
              <Route path="/:gameName" element={<DynamicGameComponent />} />
              <Route path="/" element={<Navigate replace to="/home" />} />
            </Routes>
        </main>
        <Footer className="App-footer" /> 
      </div>
    </Router>
  );
}

export default App;
