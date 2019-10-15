import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { RecipesOverview } from './RecipesOverview';
import RecipeList from './RecipeList';
import Pagination from './Pagination';

configure({ adapter: new Adapter() });

describe('RecipesOverview', () => {
  let component = null;
  beforeEach(() => {
    const props = {
      recipes: [],
      setRecipes: jest.fn()
    };

    component = shallow(<RecipesOverview {...props} />);
  });

  it('should show loading when loading data', () => {
    component.setState({ busy: true });
    expect(component.find('h2').text()).toEqual('Loading...');
  });

  it('should show title when we got data', () => {
    component.setState({ busy: false });
    expect(component.find('h1').text()).toEqual('Recipes Overview');
  });

  it('should show message when there is no recipes', () => {
    component.setState({ busy: false });
    expect(component.find('p').text()).toEqual('There is no recipes');
  });

  it('should show List and Pagination when we got recipes', () => {
    component.setState({ busy: false });
    component.setProps({ recipes: [{ title: 'Recipe 1'}] });

    expect(component.find(RecipeList).length).toEqual(1);
    expect(component.find(Pagination).length).toEqual(1);
  });

});
