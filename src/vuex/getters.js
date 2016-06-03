// Auth
export const authData = state => {
  return {
    phone: state.auth.phone,
    username: state.auth.username,
    instagram: state.auth.instagram,
  };
};
export const callbackOnSuccessAuth = state => state.auth.callbackOnSuccess

// User
export const isAuth = state => state.user.isAuth;
export const user = state => state.user;
export const userID = state => state.user.id;
export const userName = state => {
  if (state.user.name) {
    return state.user.name;
  }
  return state.user.instagram_username;
};
export const openedUser = state => state.user.openedUser;

// Products
export const products = state => state.products.all;
export const openedProduct = state => state.products.opened;
export const isWaitReponseProducts = state => state.products.isWaitResponse;
export const hasMoreProducts = state => state.products.hasMore;
export const isInfinityProducts = state => state.products.isInfinity;
export const getColumnNumber = state => state.products.columnNumber;

// Search
export const searchValue = state => state.search.value;
export const tags = state => state.search.tags;
export const selectedTags = state => state.search.selectedTags;
