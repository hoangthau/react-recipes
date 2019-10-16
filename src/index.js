import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import './styles.css';

import RecipesOverview from './components/RecipesOverview';
import { recipesReducers } from './reducers/recipes';

//This is just a demo for Redux. For this case I think we don't need Redux.
//But if we want to use recipes list in others components rather than RecipesOverview component, 
//we can embrace Redux like that.
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
