export const getList = ( { products } ) => {

  if ( products.lists.hasOwnProperty( products.listId ) ) {

    return products.lists[ products.listId ];

  }

  return null;

};

export const getProduct = ( { products } ) => {

  const list = getList( { products } );

  if ( list !== null ) {

    if ( list.products.hasOwnProperty( products.productId ) ) {

      return list.products[ products.productId ];

    }

  }

  return null;

};

export const getScrollTop = ( state ) => {

  const list = getList( state );

  if ( list !== null ) {

    return list.scrollTop;

  }

  return 0;

};

export const getLengthList = ( state ) => {

  const list = getList( state );

  if ( list !== null ) {

    return list.lengthList;

  }

  return 9; // Количество элементов которое я буду вынимать из массива

};

export const hasMore = ( state ) => {

  const list = getList( state );

  if ( list !== null ) {

    return list.hasMore;

  }

  return null;

};

export const isInfinity = ( state ) => {

  const list = getList( state );

  if ( list !== null ) {

    return list.isInfinity;

  }

  return null;

};

export const getColumnCount = ( { products } ) => {

  return products.columnCount;

};

export const isLoading = ( { products } ) => {

  return products.loading;

};

export const isAnimateShow = ( { products } ) => {

  return products.animateShow;

};
