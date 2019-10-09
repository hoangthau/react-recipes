export default (state = [], action) => {
  switch (action.type) {
    case "GET_RECIPES":
      return state = [...action.payload];
    default:
      return state;
  }
};