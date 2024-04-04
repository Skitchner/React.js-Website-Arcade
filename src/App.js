import React, { Suspense, lazy, useEffect } from 'react'; 
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


const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const DynamicGameComponent = () => {
  const { gameName } = useParams(); 
  
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
    
    const preventScroll = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
      }
    };
    
    
    window.addEventListener('keydown', preventScroll);
    
    
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
