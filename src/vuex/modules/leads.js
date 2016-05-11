import {
  RECEIVE,
  SET_TAB,
  APPLY_STATUS,
  PENDING,
  INIT_GLOBAL_NOTIFY,
  INC_NOTIFY,
  CLEAR_NOTIFY,
  SET_LAST_MESSAGE
} from '../mutationTypes/lead';

// initial state
const state = {
  seller: [],
  customer: [],
  tab: "customer",
  pending: false,
  notify_count: {},
  global_notify_count: 0
};

// mutations
const mutations = {
  [RECEIVE] ( state, { seller, customer } ) {

    if(seller !== undefined){
      state.seller   = state.seller.concat( seller );
      checkUnreadMessage( seller );
    }
    if(customer !== undefined){
      state.customer = state.customer.concat( customer );
      checkUnreadMessage( customer );
    }
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
  },
  [SET_TAB] ( state, tab = 'customer' ) {
    state.tab = tab;
  },
  [APPLY_STATUS] ( { seller, customer }, lead_id, status_key = 0 ) {
    const leads = { seller, customer };
    let kik = false;
    for ( const key in leads ) {
      if ( leads.hasOwnProperty( key ) ) {
        if (kik) {
          break;
        }
        for ( let i = leads[key].length; i; i-- ) {
          const lead = leads[key][ i - 1 ];
          if ( lead.id === lead_id ) {
            lead.status = status_key;
            kik = true;
            break;
          }
        }
      }
    }
  },
  [PENDING] ( state, pending = false ) {
    state.pending = pending;
  },
  [INIT_GLOBAL_NOTIFY] ( state, count ) {
    state.global_notify_count = count;
  },
  [INC_NOTIFY] ( state, lead_id ) {
    if ( !state.notify_count.hasOwnProperty( lead_id ) ) {
      state.notify_count = Object.assign( {}, state.notify_count, { [ lead_id ]: 1 } );
    } else {
      state.notify_count = Object.assign( {}, state.notify_count, { [ lead_id ]: state.notify_count[ lead_id ] + 1 } );
    }
    state.global_notify_count++;
  },
  [CLEAR_NOTIFY] ( state, lead_id ) {
    if ( state.notify_count.hasOwnProperty( lead_id ) ) {
      state.global_notify_count -= state.notify_count[ lead_id ];
    }
    state.notify_count = Object.assign( {}, state.notify_count, { [ lead_id ]: 0 } );
  },
  [SET_LAST_MESSAGE] ( state, conversation, messages ) {
    const lead = state[state.tab].find(({id}) => id === conversation.id );
    //Такие длинные пути мне не нравятся( 
    lead.chat.recent_message.parts = messages[0].parts;
  }
};

export default {
  state,
  mutations
};