import {

  ACTION_SET_APPROVE

} from '../mutation-types';



let state = {
  approve: '',
  payment: ''
}


let mutations = {


  [ACTION_SET_APPROVE] ( state , value ) {

    state.approve = value;

  }
}



export default {

  state,
  mutations

}
