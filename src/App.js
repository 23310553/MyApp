import React from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Tester
        </h1>
      </header>
    </div>
  );
}

export default App;
