import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log(
  '%cThe more you fight the stronger you\'ll be.\nThe more you dig the bigger the hole will be.\nIf you have a purpose there is no wasted effort.',
  'color: #e8a0bf; font-size: 14px; font-style: italic; padding: 8px 0;'
);

console.log(
  '  ____  _   ___   ______  _____ ____  \n |  _ \\| | | \\ \\ / /  _ \\| ____|  _ \\ \n | |_) | |_| |\\ V /| | | |  _| | |_) |\n |  _ <|  _  | | | | |_| | |___|  _ < \n |_| \\_\\_| |_| |_| |____/|_____|_| \\_\\'
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

