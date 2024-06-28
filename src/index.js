import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Debug from './debugging';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Debug/>
  </React.StrictMode>
);

