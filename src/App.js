import { BrowserRouter, HashRouter } from 'react-router-dom'
import Navbar from './components/Navbar'
import { createStore } from 'redux'
import reducer from './redux/reducer'
import { Provider } from 'react-redux'
import Layouts from './components/Layouts';
import React, { useState } from 'react';
import './App.css'


const initVal = {
  authentication: {},
  userData: {}
}

const store = createStore(reducer, initVal)

function App() {


  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <Layouts />
      </BrowserRouter>
    </Provider>
  );
}

export default App;

