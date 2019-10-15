import React from 'react';
import { connect } from 'react-redux';

import Pagination from './Pagination';
import RecipeList from './RecipeList';
import Error from './Error';

const apiHost = 'http://localhost:8081';
const pageSize = 5;

class RecipesOverview extends React.Component {
  state = {
    busy: true,
    error: {},
    currentPage: 1,
    pages: [],
    searchText: ''
  };

  async componentDidMount() {
    try {
      const res = await fetch(`${apiHost}/recipes?page=1&pageSize=${pageSize}`);
      const data = await res.json();
      const pages = this.getTotalPages(data.totalPages);
      this.props.setRecipes(data.recipes);
      this.setState({ pages, busy: false });
    } catch (error) {
      this.setState({ error, busy: false });
    }
  }

  onDeleteItem = async item => {
    const confirm = window.confirm('Do you want to delete this recipe?');
    if (confirm) {
      try {
        const res = await fetch(`${apiHost}/recipes/${item.id}`, {
          method: 'DELETE'
        });
        const deletedRecipe = await res.json();
        const { recipes } = this.props;
        const index = recipes.findIndex(i => i.id === deletedRecipe.id);
        recipes.splice(index, 1);
        this.props.setRecipes(recipes);
        this.goTo(1);
      } catch (error) {
        this.setState({ error, busy: false });
      }
    }
  };

  goTo = async page => {
    try {
      const res = await fetch(
        `${apiHost}/recipes?page=${page}&pageSize=${pageSize}&search=${this.state.searchText}`
      );
      const data = await res.json();
      const pages = this.getTotalPages(data.totalPages);
      this.props.setRecipes(data.recipes);
      this.setState({ currentPage: page, pages, busy: false });
    } catch (error) {
      this.setState({ error, busy: false });
    }
  };

  onSearch = async e => {
    this.setState({ searchText: e.target.value });
    try {
      const res = await fetch(`${apiHost}/recipes?search=${e.target.value}`);
      const data = await res.json();
      const pages = this.getTotalPages(data.totalPages);
      this.props.setRecipes(data.recipes);
      this.setState({ busy: false, currentPage: 1, pages });
    } catch (error) {
      this.setState({ error, busy: false });
    }
  };

  getTotalPages = number => {
    const pages = [];
    for (let i = 1; i <= number; i++) {
      pages.push(i);
    }
    return pages;
  };

  render() {
    if (this.state.busy) {
      return <h2>Loading...</h2>;
    }

    const { recipes } = this.props;
    const { searchText, currentPage, pages, error } = this.state;

    return (
      <>
        <h1>Recipes Overview</h1>
        {error.message && <Error message={error.message} />}
        <input
          className="search"
          placeholder="Input to search"
          type="text"
          value={searchText}
          onChange={this.onSearch}
        />
        {!recipes.length && <p>There is no recipes</p>}
        <RecipeList items={recipes} onDeleteItem={this.onDeleteItem} />
        {!!recipes.length && (
          <Pagination
            currentPage={currentPage}
            pages={pages}
            goTo={this.goTo}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
  recipes: state
});

const mapDispatchToProps = dispatch => ({
  setRecipes: payload => dispatch({ type: 'SET_RECIPES', payload })
});

export { RecipesOverview };
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipesOverview);
