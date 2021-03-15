import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import StateRouter from './StateRouter';
import './App.scss';

function App() {
  return (
    <Provider store={store}>
      <StateRouter />
    </Provider>
  );
}

export default App;
