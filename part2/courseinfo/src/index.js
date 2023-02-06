/* import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(
  <App />, 
  document.getElementById('root')
) */

// use this in React version 18

import React from 'react';
import {createRoot}  from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById("root"))
root.render
  (
    <App />
  )