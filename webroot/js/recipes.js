
const apiHost = 'http://localhost:8081';

const reducersRecipes = (state = [], action) => {
  switch (action.type) {
    case "SET_RECIPES":
      return action.payload;;
    default:
      return state;
  }
};

const store = Redux.createStore(reducersRecipes);

export const Pagination = ({ currentPage, pages, goTo }) => (
  <div className="pagination">
    {pages.map(item => (
      <button
        className={currentPage === item ? 'active-page' : ''}
        key={item}
        onClick={() => goTo(item)}
      >
        {item}
      </button>
    ))}
  </div>
);

const List = ({ items, onDeleteItem }) => (
  <div>
    {items.map(item => (
      <div className="item" key={item.id}>
        <div className="header-item">
          <h2>{item.title}</h2>
          <button className="btn-delete" onClick={() => onDeleteItem(item)}>
            Delete
          </button>
        </div>
        <p className="desc">{item.description}</p>
      </div>
    ))}
  </div>
);

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
      store.dispatch({ type: "SET_RECIPES", payload: data.recipes });
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
      store.dispatch({ type: "SET_RECIPES", payload: data.recipes });
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
      store.dispatch({ type: "SET_RECIPES", payload: data.recipes });
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
        {!recipes.length && (
           <p>There is no recipes</p>
        )}
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

const App = () => {
  const recipes = store.getState();
  console.log(store.getState());
  return <RecipeContainer recipes={recipes} />
}

const render = () => {
  ReactDOM.render(<App />, document.getElementById('react-container'));
}

render();

store.subscribe(render);