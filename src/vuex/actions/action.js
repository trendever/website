import {

  ACTION_SET_APPROVE

} from '../mutation-types';



export const setApprove = ( { dispatch }, value )=>{

  dispatch( ACTION_SET_APPROVE , value );

}
