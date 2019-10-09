import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import './styles.css';

import RecipeContainer from './components/RecipeContainer';
import { reducersRecipes } from './reducers/recipe';

const store = createStore(reducersRecipes);

const App = () => {
  return <RecipeContainer />;
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
