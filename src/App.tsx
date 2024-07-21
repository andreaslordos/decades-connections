import Grid from './components/Grid';
import Header from './components/Header';
import Explainer from './components/Explainer';
import React from 'react';

function App() {
  return (
    <div className="text-center mx-auto space-y-8">
      <Header/>
      <Explainer/>
      <Grid/>
    </div>
  );
}

export default App;