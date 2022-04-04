import './App.css';
import './MergedPull.js'
import './PullPlot.js'
import MergedList from './MergedPull.js';
import PullPlot from './PullPlot.js';
import React from 'react';

import axios from 'axios';

function App() {
  return (
    <div className="App">
      <PullPlot></PullPlot>
      <MergedList></MergedList>
    </div>
  );
}

export default App;