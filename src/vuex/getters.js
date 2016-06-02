export const authData = state => {
  return {
    phone: state.auth.phone,
    username: state.auth.username,
    instagram: state.auth.instagram,
  };
};

// Search
export const searchValue = state => state.search.value;
export const tags = state => state.search.tags;
export const selectedTags = state => state.search.selectedTags;

// Popups
export const isShowPopupSignup = state => state.popups.showSignup;
export const isShowPopupFastSignup = state => state.popups.showFastSignup;
