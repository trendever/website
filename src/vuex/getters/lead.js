import { userID } from 'vuex/getters/user.js';

export const getTab = ( { leads } ) => {
  if ( getIsTab( { leads } ) ) {
    return leads.tab;
  }
  if ( leads.seller.length > 0 ) {
    return 'seller';
  }
  return 'customer';
};

export const getLengthList = ( { leads } ) => {

  return leads.lengthList;

};

export const getLeads = ( { leads } ) => {

  return leads[ getTab( { leads } ) ];

};

export const getLeadByConversationId = (function() {

  const memoize = {};

  return ( state, conversation_id ) => {

    if ( memoize.hasOwnProperty( conversation_id ) ) {

      return memoize[ conversation_id ];

    }

    const leadGroup = [ 'seller', 'customer' ];
    const finder    = ( { chat } ) => {
      if ( chat !== null ) {
        return chat.id === conversation_id;
      }
    };

    for ( let i = leadGroup.length; i; i-- ) {

      const result = state.leads[ leadGroup[ i - 1 ] ].find( finder );

      if ( result ) {

        memoize[ conversation_id ] = result;
        return result;

      }

    }

    return null;

  }

})();

export const getLeadById = ( state, id ) => {
  const leads = getLeads( state );
  for ( let i = leads.length; i; i-- ) {
    if ( leads[ i - 1 ].id === id ) {
      return leads[ i - 1 ];
    }
  }
  return null;
};

export const getOlderLead = ( state ) => {
  const leads = getLeads( state );
  const times = [];
  for ( let i = leads.length; i; i-- ) {
    times.push( leads[ i - 1 ].updated_at );
  }
  return Math.min.apply( Math, times );
};

export const getIsTab = ( { leads } ) => {
  return (leads.seller.length > 0) && (leads.customer.length > 0);
};

export const getTitle = ( state ) => {
  if ( getIsTab( state ) ) {
    return;
  }
  return {
    seller: 'Чаты с покупателями',
    customer: 'Шопинг-чаты'
  }[ getTab( state ) ];
};

export const getLastMessage = ( state ) => {
  const messages = {};
  const leads    = getLeads( state );

  for ( let i = leads.length; i; i-- ) {
    const { id, chat } = leads[ i - 1 ];

    if ( chat !== null ) {

      if ( chat.hasOwnProperty( 'recent_message' ) ) {

        if ( chat.recent_message.hasOwnProperty( 'parts' ) ) {

          const mime = chat.recent_message.parts[ 0 ].mime_type;
          const data = chat.recent_message.parts[ 0 ].content;

          let user_name = '';

          if ( chat.recent_message.user ) {

            if ( chat.recent_message.user.name ) {

              user_name = chat.recent_message.user.name;

            }

          }

          if ( mime === 'text/plain' ) {
            messages[ id ] = {
              message: data,
              user_name
            };
          }
          if ( mime === 'text/json' ) {

            const res   = JSON.parse( data );
            const title = res.title ? res.title : '';

            messages[ id ] = {
              message: `товар: ${title}`,
              user_name
            };
          }

        }

      }

    } else {
      messages[ id ] = '';
    }

  }

  return messages;
};

export const getGlobalNotifyCount = state => state.leads.global_notify_count;

export const getNotifyCountList = state => state.leads.notify_count;

export const isEmptyLeads = ( { leads } ) => (leads.seller.length === 0) && (leads.customer.length === 0);

export const isDone = ( state ) => state.leads.done;

export const getGroup = ( state, lead ) => lead.customer_id === userID( state ) ? 'customer' : 'seller';

export const getLeadHeight = () => {

  if ( window.matchMedia( '(max-width: 750px)' ).matches ) {
    return 230
  }

  return 134;

};

export const getLengthListOnBody = () => Math.round( document.body.offsetHeight / getLeadHeight() );
