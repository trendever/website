import * as userService from 'services/user';
import * as profile from 'services/profile.js';
import * as types from '../mutation-types';
import { getUserName, getProfile } from 'vuex/getters/user.js';

export const authUser = ( { dispatch }, user, token ) => {

  return new Promise( ( resolve, reject ) => {

    const { token:cookieToken } = profile.getProfile();

    console.log( {token, cookieToken} );

    if ( token && cookieToken !== token ) {

      const user_id = profile.saveToken( token );

      if ( Number.isFinite( user_id ) ) {

        console.log( {user_id, token, cookieToken} );

        if ( user ) {

          console.log( {user_id, token, cookieToken, user} );

          debugger;

          profile.saveUser( user.User || user.Shop || {} );

          dispatch( types.USER_AUTHENTICATED, token );
          dispatch( types.USER_RECEIVE_PROFILE, profile.getProfile( true ).user );
          dispatch( types.USER_SET_MY_ID, user_id );

          resolve();

        } else {

          console.log( {user_id, token, cookieToken, user} );

          debugger;

          userService
            .get( { user_id } )
            .then( ( user ) => {

              console.log( {user_id, token, cookieToken, user} );

              debugger;

              profile.saveUser( user.User || user.Shop || {} );

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

      }

    } else {

      const { user, token } = profile.getProfile();

      console.log( {token, cookieToken, user} );

      debugger;

      if ( cookieToken && user ) {

        dispatch( types.USER_AUTHENTICATED, token );
        dispatch( types.USER_RECEIVE_PROFILE, user );
        dispatch( types.USER_SET_MY_ID, user.id );

        resolve();

      }

      resolve();

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
          .then( ( { User, Shop } ) => {
            dispatch( types.USER_RECEIVE_PROFILE, User || Shop, id );
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
