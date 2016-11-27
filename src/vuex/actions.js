/* globals Raven */
import * as auth from 'services/auth';
import * as utils from 'utils';
import * as types from './mutation-types';

// Auth

/**
 * Save auth data
 * Need for registration
 * @param  {string} options.phone
 * @param  {string} options.username
 * @param  {boolean} options.instagram   username is instagram username?
 */
export const saveAuthData = ({ dispatch }, { phone, username, instagram }) => {
  phone = phone ? utils.formatPhone(phone, true) : '';
  dispatch(types.RECEIVED_AUTH_DATA, { phone, username, instagram });
};

/**
 * User registration (with sms confirmation)
 * Params must be saved with actions.saveAuthData
 */
export const signup = ({ dispatch, state }) => {
  return new Promise((resolve, reject) => {

    auth.signup(state.auth.phone, state.auth.username, state.auth.instagram)
    .then( () => {
      resolve(true);
    }).catch( error => {
      if (error === auth.ERROR_CODES.USER_ALREADY_EXISTS) {

        return auth.sendPassword(state.auth.phone).then( () => {
          resolve(true);
        }).catch( error => {
          console.log(error);
        });

      } else if (error === auth.ERROR_CODES.INCORRECT_PHONE_FORMAT) {
          return reject(error);
      }
      console.log(error);

    });

  });
};

export const signin = ({ dispatch, state }) => {
  return new Promise((resolve, reject) => {
    auth.sendPassword(state.auth.phone).then( () => {
      resolve(true);
    }).catch( error => {
      console.log(error);
    });
  });
};

export const setData = ({ dispatch, state }) => {
  return new Promise((resolve, reject) => {

    auth.setData(state.auth.phone, state.auth.username, state.auth.instagram)
    .then( () => {
      resolve(true);
    }).catch( error => {
      return reject(error);
      console.log(error);
    });

  });
};

export const setCallbackOnSuccessAuth = ({ dispatch }, callback) => {
  dispatch(types.SET_CALLBACK_ON_SUCCEESS_AUTH, callback);
};

export const executeCallbackOnSuccessAuth = ({ dispatch, state }) => {
  if (state.auth.callbackOnSuccess) {
    state.auth.callbackOnSuccess()
    dispatch(types.CLEAR_CALLBACK_ON_SUCCEESS_AUTH);
  }
};

