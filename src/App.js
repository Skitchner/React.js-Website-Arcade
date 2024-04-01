import React, { Suspense, lazy } from 'react'; // Import Suspense and lazy here
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
