export const isAuth = ( { user } ) => {

  return user.isAuth;

};

export const isDone = ( { user }) => {
  
  return user.done;
  
};

export const user = ( { user } ) => {

  if ( user.all.hasOwnProperty( user.id ) ) {

    return user.all[ user.id ];

  } else {

    console.warn( `[ GET USER ] - profile with id: ${user.id}, not found`, user );

  }

  return user.all[ user.myId ];

};

export const userID = ( state ) => {

  return user( state ).id;

};

export const gerUserName = ( state ) => {

  const { instagram_username, name } = user( state );

  if ( typeof instagram_username === 'string' ) {
    return instagram_username;
  }

  if ( typeof name === 'string' ) {
    return name;
  }

  return null;

};

export const getUserPhoto = ( state ) => {

  const { instagram_avatar_url } = user( state );

  if ( typeof instagram_avatar_url === 'string' ) {
    return instagram_avatar_url;
  }

};

export const getUserCaption = ( state ) => {

  const {instagram_caption} = user( state );

  if ( typeof instagram_caption === 'string' ) {
    return instagram_caption;
  }

};

export const getProfile = ( { user }, id = null ) => {

  if ( id !== null ) {
    if ( user.all.hasOwnProperty( id ) ) {
      return user.all[ id ];
    }
  }
  return null;

};

export const getPhotoConfig = ( { user } ) => {

  if ( user.photoConfigs.hasOwnProperty( user.id ) ) {

    return user.photoConfigs[ user.id ];

  } else {

    console.warn( `[ GET PHOTO CONFIG FOR PROFILE ] - profile with id: ${user.id}, not found`, user );

  }

  return user.photoConfigs[ user.myId ];

};