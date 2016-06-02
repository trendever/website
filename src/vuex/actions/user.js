import * as userService from 'services/user';
import * as profile from 'services/profile.js';
import * as types from '../mutation-types';

export const authUser = ( { dispatch }, user, token ) => {

  const { token:cookieToken } = profile.getProfile();

  if ( token && cookieToken !== token ) {

    const user_id = profile.saveToken( token );

    if ( Number.isFinite( user_id ) ) {

      if ( user ) {

        profile.saveUser( user.User || user.Shop );

        dispatch( types.USER_AUTHENTICATED, token );
        dispatch( types.RECEIVE_CURRENT_USER, profile.getProfile(true).user );

      } else {

        userService
          .get( { user_id } )
          .then( ( user ) => {

            profile.saveUser( user.User || user.Shop );
            
            dispatch( types.USER_AUTHENTICATED, token );
            dispatch( types.RECEIVE_CURRENT_USER, profile.getProfile(true).user );

          } )
          .catch( ( error ) => {
            if ( error === 1 ) {
              console.error( '[ USER_NOT_FOUND ]', { user_id } );
            } else {
              console.error( '[ USER_UNDEFINED_ERROR ]', error );
            }
          } );

      }

    } else {

      console.warn( '[ TOKEN IS NOT CORRECT ]', { token } );

    }

  } else {

    const { user, token } = profile.getProfile();

    if ( cookieToken && user ) {
      dispatch( types.USER_AUTHENTICATED, token );
      dispatch( types.RECEIVE_CURRENT_USER, user );
    }

  }

};

export const openProfile = ( { dispatch, state }, { user_id, instagram_name } ) => {
  return new Promise( ( resolve, reject ) => {
    let openedProfile = state.user.openedProfile;

    if ( !user_id && !instagram_name ) {
      // Open profile current user
      if ( state.user.instagram_username ) {
        // instagram_name have more priority, for get shop if exist.
        instagram_name = state.user.instagram_username
      } else {
        // get user only
        user_id = state.user.id
      }
    }

    if ( openedProfile ) {
      if ( user_id && openedProfile.User ) {
        if ( openedProfile.User.id === user_id ) {
          resolve( state.user.openedProfile );
          return;
        }
      }
      if ( instagram_name && openedProfile.Shop ) {
        if ( openedProfile.Shop.instagram_username === instagram_name ) {
          resolve( openedProfile );
          return;
        }
      }
      if ( instagram_name && openedProfile.User ) {
        if ( openedProfile.User.instagram_username === instagram_name ) {
          resolve( openedProfile );
          return;
        }
      }
    }

    // Otherwise get from server
    userService.get( { user_id, instagram_name } )
               .then( data => {
                 dispatch( types.RECEIVE_OPENED_PROFILE, data );
                 resolve( data );
                 return;
               } )
               .catch( error => {
                 reject( error );
               } );

  } );
};
