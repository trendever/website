import * as userService from 'services/user';
import * as profile from 'services/profile.js';
import * as types from '../mutation-types';


export const authenticateUser = ({ dispatch }, user, token) => {
  if (!profile.saveToken(token)) {
    return;
  }
  dispatch(types.USER_AUTHENTICATED, token);

  if (user) {
    // Note: If without user, need reload user data: loadUser()
    dispatch(types.RECEIVE_CURRENT_USER, user);
    profile.saveUser(user);
  }
};

export const loadUser = ({ dispatch }) => {
  let _profile = profile.getProfile();
  if (_profile.token) {
    dispatch(types.USER_AUTHENTICATED, _profile.token);
  }
  if (_profile.user) {
    dispatch(types.RECEIVE_CURRENT_USER, _profile.user);
  }
};

export const openProfile = ({ dispatch, state }, { user_id, instagram_name }) => {
  return new Promise((resolve, reject) => {
    let openedProfile = state.user.openedProfile;

    if (!user_id && !instagram_name) {
      // Open profile current user
      if (state.user.instagram_username) {
        // instagram_name have more priority, for get shop if exist.
        instagram_name = state.user.instagram_username
      } else {
        // get user only
        user_id = state.user.id
      }
    }

    if (openedProfile) {
      if (user_id && openedProfile.User) {
        if (openedProfile.User.id === user_id) {
          resolve(state.user.openedProfile);
          return;
        }
      }
      if (instagram_name && openedProfile.Shop) {
        if (openedProfile.Shop.instagram_username === instagram_name) {
          resolve(openedProfile);
          return;
        }
      }
      if (instagram_name && openedProfile.User) {
        if (openedProfile.User.instagram_username === instagram_name) {
          resolve(openedProfile);
          return;
        }
      }
    }

    // Otherwise get from server
    userService.get({ user_id, instagram_name })
               .then( data => {
                 dispatch(types.RECEIVE_OPENED_PROFILE, data);
                 resolve(data);
                 return;
               })
               .catch( error => {
                 reject(error);
               });

  });
};
// export const closeUser = () => {
//   dispatch(types.CLEAR_OPENED_USER);
// };
