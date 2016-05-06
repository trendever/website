import { RECEIVE, SET_TAB, APPLY_STATUS, PENDING } from '../mutationTypes/lead';

// initial state
const state = {
  seller: [],
  customer: [],
  tab: "customer",
  pending: false,
};

// mutations
const mutations = {
  [RECEIVE] ( state, { seller, customer } ) {
    console.log({ seller, customer });
    if(seller !== undefined){
      state.seller   = state.seller.concat( seller );
    }
    if(customer !== undefined){
      state.customer = state.customer.concat( customer );
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
};

export default {
  state,
  mutations
};