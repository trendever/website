<style src='./styles/chat-msg-status.pcss'></style>
<template lang="jade">
  .chat-row.__center(v-if="isHide && text !== null")
    .chat-msg-status
      span {{text}} 
      
</template>

<script>
  import { getCurrentMember, getCustomerName } from 'vuex/getters/chat.js';
  import * as leads from 'services/leads';
  import { statusString } from './utils';

  export default{
    props: {
      msg: {
        type: Object,
        required: true
      }
    },
    vuex: {
      getters: {
        getCurrentMember,
        getCustomerName
      }
    },
    computed: {
      isHide(){

        if ( this.getCurrentMember !== null ) {

          const { type } = JSON.parse( this.msg.parts[ 0 ].content );

          return !( ( this.getCurrentMember.role === leads.USER_ROLES.CUSTOMER.key ) && ( type === 'suplier.called' ));

        }

      },
      date(){
        const { type, value } = JSON.parse( this.msg.parts[ 0 ].content );

        if (type === 'lead.state.date'){
          return true;
        }

        return false;
      },
      text(){

        const { type, value, reason, what } = JSON.parse( this.msg.parts[ 0 ].content );

        if(reason === 'Покупатель удалил чат' && what === 'lead_cancel') {

          return `${this.getCustomerName} удалил чат`;

        }

        return statusString(type, value, this.getCustomerName);

      },
      content(){
        return JSON.parse(this.msg.parts[ 0 ].content);
      }
    }
  }
</script>
