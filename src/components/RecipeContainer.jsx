import React from 'react';
import { connect } from 'react-redux';

import Pagination from './Pagination';
import List from './List';

const apiHost = 'http://localhost:8081';

class RecipeContainer extends React.Component {
  state = {
    busy: true,
    error: {},
    currentPage: 1,
    pages: [],
    searchText: ''
  };

  async componentDidMount() {
    try {
      const res = await fetch(`${apiHost}/recipes?page=1&pageSize=5`);
      const data = await res.json();
      const pages = this.getTotalPages(data.totalPages);
      this.props.setRecipes(data.recipes);
      this.setState({ pages, busy: false });
    } catch (error) {
      this.setState({ error, busy: false });
    }
  }

  getTotalPages = number => {
    const pages = [];
    for (let i = 1; i <= number; i++) {
      pages.push(i);
    }
    return pages;
  };

  onDeleteItem = async item => {
    const confirm = window.confirm('Do you want to delete this recipe');
    if (confirm) {
      try {
        const res = await fetch(`${apiHost}/recipes/${item.id}`, {
          method: 'DELETE'
        });
        const { recipes } = this.state;
        const index = recipes.findIndex(i => i.id === item.id);
        recipes.splice(index, 1);
        this.setState({ recipes });
      } catch (error) {
        this.setState({ error, busy: false });
      }
    }
  };

  goTo = async page => {
    try {
      const res = await fetch(
        `${apiHost}/recipes?page=${page}&pageSize=5&search=${this.state.searchText}`
      );
      const data = await res.json();
      this.props.setRecipes(data.recipes);
      this.setState({ currentPage: page, busy: false });
    } catch (error) {
      this.setState({ error, busy: false });
    }
  };

  onSearch = async e => {
    this.setState({ searchText: e.target.value });
    try {
      const res = await fetch(`${apiHost}/recipes?search=${e.target.value}`);
      const data = await res.json();
      this.props.setRecipes(data.recipes);
      this.setState({ busy: false });
    } catch (error) {
      this.setState({ error, busy: false });
    }
  };

  render() {
    if (this.state.busy) {
      return <h2>Loading...</h2>;
    }

    const { recipes } = this.props;

    return (
      <>
        <h1>Recipes Overview</h1>
        {this.state.error.message && (
          <div>Error occurred: {this.state.error.message}</div>
        )}
        <input
          className="search"
          placeholder="Input to search"
          type="text"
          value={this.state.searchText}
          onChange={this.onSearch}
        />
        {!recipes.length && <p>There is no recipes</p>}
        <List items={recipes} onDeleteItem={this.onDeleteItem} />
        {!!recipes.length && (
          <Pagination
            currentPage={this.state.currentPage}
            pages={this.state.pages}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeContainer);
