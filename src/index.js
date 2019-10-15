import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import './styles.css';

import RecipesOverview from './components/RecipesOverview';
import { recipesReducers } from './reducers/recipes';

const store = createStore(recipesReducers);

const App = () => {
  return <RecipesOverview />;
};

const render = () => {
  const rootElement = document.getElementById('root');
  ReactDOM.render(
    <div className="App">
      <Provider store={store}>
        <App />
      </Provider>
    </div>,
    rootElement
  );
};

render();
