import {
  LEAD_INIT,
  LEAD_RECEIVE,
  LEAD_UPDATE_LEAD_ITEM,
  LEAD_SET_TAB,
  LEAD_APPLY_STATUS,
  LEAD_INC_NOTIFY,
  LEAD_CLEAR_NOTIFY,
  LEAD_SET_LAST_MESSAGE,
  LEAD_INC_LENGTH_LIST
} from '../mutation-types';

// initial state
const state = {
  done: false,
  seller: [],
  customer: [],
  tab: 'customer',
  notify_count: {},
  global_notify_count: 0,
  lengthList: 12
};

function checkUnreadMessage( items ) {
  for ( let i = items.length; i; i-- ) {
    const { chat, id } = items[ i - 1 ];
    if ( chat !== null ) {
      if ( chat.hasOwnProperty( 'unread_count' ) ) {
        state.notify_count[ id ] = chat.unread_count;
      } else {
        state.notify_count[ id ] = 0;
      }
    }
  }
}

// mutations
const mutations = {
  [LEAD_INIT]( state, { seller, customer, countUnread, lengthList } ) {
    state.seller              = seller;
    state.customer            = customer;
    state.done                = true;
    state.global_notify_count = countUnread;
    state.lengthList          = lengthList;
    checkUnreadMessage( seller );
    checkUnreadMessage( customer );
  },
  [LEAD_RECEIVE] ( state, leads, tab ) {

    console.time( 'LEAD_RECEIVE' );

    if ( !state.hasOwnProperty( tab ) ) {
      console.error( `${LEAD_RECEIVE}: передан таб который не поддерживается : ${tab}`, state );
    }

    const matchedId = [];

    for ( let i = state[ tab ].length; i; i-- ) {

      for ( let j = leads.length; j; j-- ) {

        if ( state[ tab ][ i - 1 ].id === leads[ j - 1 ].id ) {

          matchedId.push( leads[ j - 1 ].id );

        }

      }

    }

    if ( matchedId.length === 0 ) {

      state[ tab ] = state[ tab ].concat( leads );

    } else if ( matchedId.length !== leads.length ) {

      const newLeads = [];

      for ( let i = leads.length; i; i-- ) {

        let isNew = true;

        for ( let j = matchedId.length; j; j-- ) {

          if ( matchedId[ i - 1 ] === leads[ i - 1 ].id ) {

            isNew = false;
            break;

          }

        }

        if ( isNew ) {
          newLeads.push( leads[ i - 1 ] );
        }

      }

      state[ tab ] = state[ tab ].concat( newLeads );

    }

    console.timeEnd( 'LEAD_RECEIVE' );

  },
  [LEAD_UPDATE_LEAD_ITEM] ( state, newLead ) {
    let kik = false;
    [ state.seller, state.seller ].forEach( ( leads ) => {
      if ( kik ) {
        return;
      }
      for ( let i = leads.length; i; i-- ) {
        if ( leads[ i - 1 ].id === newLead.id ) {
          leads.$set( i - 1, newLead );
          kik = true;
          break;
        }
      }
    } );
  },
  [LEAD_SET_TAB] ( state, tab = 'customer', lengthList = 12 ) {
    state.tab        = tab;
    state.lengthList = lengthList;
  },
  [LEAD_INC_LENGTH_LIST] ( state, lengthList = 6 ){
    state.lengthList += lengthList;
  },
  [LEAD_SET_LAST_MESSAGE] ( state, conversation_id, messages ) {

    [ state.seller, state.customer ].forEach( ( leads, groupsIndex, groups ) => {

      leads.forEach( ( lead, index ) => {

        if ( lead.chat !== null ) {

          if ( conversation_id === lead.chat.id ) {

            lead.chat.recent_message.parts = messages[ 0 ].parts;
            lead.updated_at                = messages[ 0 ].created_at * 1e9;
            groups[ groupsIndex ].$set( index, lead );

          }

        }

      } );

    } );
  },
  [LEAD_APPLY_STATUS] ( state, conversation_id, statusCode, members, created_at ) {
    const leads = { seller: state.seller, customer: state.customer };
    let kik     = false;

    for ( const key in leads ) {

      if ( leads.hasOwnProperty( key ) ) {

        if ( kik ) {
          break;
        }

        leads[ key ] = leads[ key ].map( ( lead ) => {

          if ( lead.chat !== null ) {
            if ( lead.chat.id === conversation_id ) {
              kik = true;

              lead.status       = statusCode;
              lead.chat.members = members;
              lead.updated_at   = created_at * 1e9;

              return lead;
            }
          }

          return lead;

        } );

      }
      state = Object.assign( {}, leads );
    }

  },
  [LEAD_INC_NOTIFY] ( state, lead_id ) {
    if ( lead_id !== null ) {
      if ( !state.notify_count.hasOwnProperty( lead_id ) ) {
        state.notify_count = Object.assign( {}, state.notify_count, { [ lead_id ]: 1 } );
      } else {
        state.notify_count = Object.assign( {}, state.notify_count, { [ lead_id ]: state.notify_count[ lead_id ] + 1 } );
      }
    }
    state.global_notify_count++;
  },
  [LEAD_CLEAR_NOTIFY] ( state, lead_id ) {
    if ( state.notify_count.hasOwnProperty( lead_id ) ) {
      const globalCount         = state.global_notify_count - state.notify_count[ lead_id ];
      state.global_notify_count = globalCount >= 0 ? globalCount : 0;
    }
    state.notify_count = Object.assign( {}, state.notify_count, { [ lead_id ]: 0 } );
  },
};

export default {
  state,
  mutations
};
