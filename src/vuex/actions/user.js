import * as userService from 'services/user';
import * as profile from 'services/profile.js';
import * as types from '../mutation-types';
import { gerUserName, getProfile } from 'vuex/getters/user.js';

export const authUser = ( { dispatch }, user, token ) => {

  const { token:cookieToken } = profile.getProfile();

  if ( token && cookieToken !== token ) {

    const user_id = profile.saveToken( token );

    if ( Number.isFinite( user_id ) ) {

      if ( user ) {

        profile.saveUser( user.User || user.Shop );

        dispatch( types.USER_AUTHENTICATED, token );
        dispatch( types.USER_RECEIVE_PROFILE, profile.getProfile( true ).user );
        dispatch( types.USER_SET_MY_ID, user_id );

      } else {

        userService
          .get( { user_id } )
          .then( ( user ) => {

            profile.saveUser( user.User || user.Shop );

            dispatch( types.USER_AUTHENTICATED, token );
            dispatch( types.USER_RECEIVE_PROFILE, profile.getProfile( true ).user );
            dispatch( types.USER_SET_MY_ID, user_id );

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
      dispatch( types.USER_RECEIVE_PROFILE, user );
      dispatch( types.USER_SET_MY_ID, user.id );

    }

  }

};

export const openProfile = ( { dispatch, state }, id ) => {

  return new Promise( ( resolve, reject ) => {

    const requestData  = { user_id: null, instagram_name: null };
    const photosConfig = {
      listId: 'profile',
      photosFilter: {
        user_id: null,
        instagram_name: gerUserName( state )
      }
    };

    if ( typeof id === 'string' ) {

      if ( id.indexOf( 'id' ) !== -1 ) {

        requestData.user_id               = +id.split( 'id' )[ 1 ];
        photosConfig.listId               = `profile_id_${ requestData.user_id }`;
        photosConfig.photosFilter.user_id = requestData.user_id;
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
            reject(error);
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
