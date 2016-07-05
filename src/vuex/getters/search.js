export const searchValue = ( { search } ) => search.value;

export const tags = ( { search } ) => {
  
  return search.selected.concat( search.tags );

};

export const selectedTagsId = ( { search } ) => {

  return tags({ search }).filter( ( { active } ) => {

    if ( active ) {

      return true;

    }

  } ).map( ( { id } ) => {

    return id;

  } );

};

export const selectedCount = ( { search } ) => {

  let count = 0;

  tags({ search }).forEach( ( { active } ) => {

    if ( active ) {

      count++;

    }

  } );

  return count;

};

export const getPendingStatus = ( { search } ) => {

  return search.pending;

};
