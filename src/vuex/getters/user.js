export const isAuth = state => state.user.isAuth;
export const user = state => state.user;
export const userID = state => state.user.id;
export const userName = state => {
  if (state.user.name) {
    return state.user.name;
  }
  return state.user.instagram_username;
};
export const openedProfile = state => state.user.openedProfile;
