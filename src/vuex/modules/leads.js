import {
  LEAD_RECEIVE,
  LEAD_UPDATE_LEAD_ITEM,
  LEAD_SET_TAB,
  LEAD_APPLY_STATUS,
  LEAD_INIT_GLOBAL_NOTIFY,
  LEAD_INC_NOTIFY,
  LEAD_CLEAR_NOTIFY,
  LEAD_SET_LAST_MESSAGE,
  LEAD_CLOSE
} from '../mutation-types';

// initial state
const state = {
  init: false,
  done: false,
  seller: [],
  customer: [],
  tab: 'customer',
  notify_count: {},
  global_notify_count: 0,
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
  [LEAD_RECEIVE] ( state, { seller, customer } ) {
    if ( seller !== undefined ) {
      state.seller = state.seller.concat( seller );
      checkUnreadMessage( seller );
    }
    if ( customer !== undefined ) {
      state.customer = state.customer.concat( customer );
      checkUnreadMessage( customer );
    }
    state.done = true;
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
  [LEAD_SET_TAB] ( state, tab = 'customer', leads ) {
    state.tab          = tab;
    state.notify_count = {};

    if ( leads !== undefined ) {
      state[ tab ] = leads;
      checkUnreadMessage( leads );
    }
  },
  [LEAD_SET_LAST_MESSAGE] ( state, conversation, messages ) {

    state[ state.tab ].forEach( ( lead, index ) => {

      if ( lead.chat !== null ) {

        if ( conversation.id === lead.chat.id ) {

          lead.chat.recent_message.parts = messages[ 0 ].parts;
          lead.updated_at                = messages[ 0 ].created_at * 1e9;
          state[ state.tab ].$set( index, lead );

        }

      }

    } );
  },
  [LEAD_APPLY_STATUS] ( { seller, customer }, lead, status_key = 0 ) {
    const leads = { seller, customer };
    let kik     = false;
    for ( const key in leads ) {
      if ( leads.hasOwnProperty( key ) ) {
        if ( kik ) {
          break;
        }
        for ( let i = leads[ key ].length; i; i-- ) {
          const oldLead = leads[ key ][ i - 1 ];
          if ( oldLead.id === lead.id ) {
            oldLead.status     = status_key;
            oldLead.updated_at = lead.updated_at;
            kik                = true;
            break;
          }
        }
      }
    }
  },
  [LEAD_INIT_GLOBAL_NOTIFY] ( state, count ) {
    state.global_notify_count = count;
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
  [LEAD_CLOSE] ( state ){
    state.done = false;
  },
};

export default {
  state,
  mutations
};
