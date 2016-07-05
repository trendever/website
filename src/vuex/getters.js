// Auth
export const authData = state => {
  return {
    phone: state.auth.phone,
    username: state.auth.username,
    instagram: state.auth.instagram,
  };
};
export const callbackOnSuccessAuth = state => state.auth.callbackOnSuccess
