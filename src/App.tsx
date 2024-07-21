import Grid from './components/Grid';
import Header from './components/Header';
import Explainer from './components/Explainer';
import React from 'react';

function App() {
  return (
    <div className="text-center mx-auto pt-safe">
      <Header/>
      <div className="space-y-8 mt-8">
        <Explainer/>
        <Grid/>
        <div className="h-8"/>
      </div>
    </div>
  );
}

export default App;