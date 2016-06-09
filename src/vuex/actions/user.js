import * as userService from 'services/user';
import * as profile from 'services/profile.js';
import * as types from '../mutation-types';
import { getUserName, getProfile } from 'vuex/getters/user.js';

export const getValidUserObject = ( user, user_id ) => {

  if ( user.hasOwnProperty( 'id' ) ) {
    return user
  }

  if ( user.hasOwnProperty( 'User' ) ) {
    return user.User;
  }

  if ( user.hasOwnProperty( 'Shop' ) ) {
    return user.Shop;
  }

  return { id: user_id }

};

export const authUser = ( { dispatch }, user, token ) => {

  return new Promise( ( resolve, reject ) => {

    const { user: cookieUser } = profile.getProfile();

    if ( typeof token === 'string' && user ) {

      const user_id = profile.saveToken( token );

      profile.saveUser( getValidUserObject( user, user_id ) );

      dispatch( types.USER_AUTHENTICATED, token );
      dispatch( types.USER_RECEIVE_PROFILE, profile.getProfile( true ).user );
      dispatch( types.USER_SET_MY_ID, user_id );

      resolve();

      return null;

    }

    if ( typeof token === 'string' ) {

      const user_id = profile.saveToken( token );

      if ( Number.isFinite( user_id ) ) {

        if ( user_id === cookieUser.id ) {

          const { user } = profile.getProfile( true );

          profile.saveUser( getValidUserObject( user, user_id ) );

          dispatch( types.USER_AUTHENTICATED, token );
          dispatch( types.USER_RECEIVE_PROFILE, user );
          dispatch( types.USER_SET_MY_ID, user_id );

          resolve();

          return null;

        } else {

          return userService
            .get( { user_id } )
            .then( ( user ) => {

              profile.saveUser( getValidUserObject( user, user_id ) );

              dispatch( types.USER_AUTHENTICATED, token );
              dispatch( types.USER_RECEIVE_PROFILE, profile.getProfile( true ).user );
              dispatch( types.USER_SET_MY_ID, user_id );

              resolve();

            } )
            .catch( ( error ) => {
              if ( error === 1 ) {
                console.error( '[ USER_NOT_FOUND ]', { user_id } );
              } else {
                console.error( '[ USER_UNDEFINED_ERROR ]', error );
              }
              reject( error );
            } );

        }

      } else {

        console.warn( '[ TOKEN IS NOT CORRECT ]', { token } );

        reject( '[ TOKEN IS NOT CORRECT ]', { token } );

        return null;

      }

    } else {

      const { user, token } = profile.getProfile();

      if ( user && token ) {

        dispatch( types.USER_AUTHENTICATED, token );
        dispatch( types.USER_RECEIVE_PROFILE, user );
        dispatch( types.USER_SET_MY_ID, user.id );

      }

      resolve();

      return null;

    }

  } );

};

export const openProfile = ( { dispatch, state }, id ) => {

  return new Promise( ( resolve, reject ) => {

    if ( typeof id === 'undefined' ) {

      dispatch( types.USER_SET_PROFILE, id );

    }

    const requestData = {
      user_id: null,
      instagram_name: null
    };

    const photosConfig = {
      listId: 'profile',
      photosFilter: {
        user_id: null,
        instagram_name: getUserName( state )
      }
    };

    if ( typeof id === 'string' ) {

      if ( id.indexOf( 'id' ) !== -1 ) {

        requestData.user_id                      = +id.split( 'id' )[ 1 ];
        photosConfig.listId                      = `profile_id_${ requestData.user_id }`;
        photosConfig.photosFilter.user_id        = requestData.user_id;
        photosConfig.photosFilter.instagram_name = null;

      } else if ( id.length > 0 ) {

        requestData.instagram_name               = id;
        photosConfig.listId                      = `profile_${ id }`;
        photosConfig.photosFilter.instagram_name = id;

      }

    }

    if ( requestData.user_id !== null || requestData.instagram_name !== null ) {

      const cacheProfile = getProfile( state, id );

      if ( cacheProfile !== null ) {

        dispatch( types.USER_SET_PHOTOS_CONFIG, photosConfig.listId, photosConfig.photosFilter, id );
        dispatch( types.USER_SET_PROFILE, id );
        resolve();

      } else {

        userService
          .get( requestData )
          .then( ( user ) => {
            dispatch( types.USER_RECEIVE_PROFILE, getValidUserObject( user, id ), id );
            dispatch( types.USER_SET_PHOTOS_CONFIG, photosConfig.listId, photosConfig.photosFilter, id );
            dispatch( types.USER_SET_PROFILE, id );
            resolve();
          } )
          .catch( error => {
            reject( error );
            console.error(
              new Error( 'User doesn`t exists or opened incorect url' ),
              {
                extra: { errorData: error, username: id }
              }
            );
          } );

      }

    } else {

      dispatch( types.USER_SET_PROFILE );
      dispatch( types.USER_SET_PHOTOS_CONFIG, photosConfig.listId, photosConfig.photosFilter );
      resolve();
    }

  } );

};

export const closeProfile = ( { dispatch } ) => {

  dispatch( types.USER_CLOSE_PROFILE );

};
