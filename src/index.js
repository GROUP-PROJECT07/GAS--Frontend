import React from 'react';
import ReactDOM from 'react-dom/client';
import './styleshome.css';
import MainApp from './MainApp';
import reportWebVitals from './reportWebVitals';

// Don't import supabase here - only import it where you use it

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);

reportWebVitals();
