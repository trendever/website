<style src='./styles/chat-msg-date.pcss'></style>
<template lang="jade">
  .chat-row.__center(v-if="isHide && text !== null")
    .chat-msg-date
      span {{text}}

</template>

<script>
  import { getCurrentMember } from 'vuex/getters/chat.js';
  import * as leads from 'services/leads';
  import { formatMonth } from './utils';

  export default{
    props: {
      msg: {
        type: Object,
        required: true
      }
    },
    vuex: {
      getters: {
        getCurrentMember
      }
    },
    computed: {
      isHide(){

        if ( this.getCurrentMember !== null ) {

          const { type } = JSON.parse( this.msg.parts[ 0 ].content );

          return !( ( this.getCurrentMember.role === leads.USER_ROLES.CUSTOMER.key ) && ( type === 'suplier.called' ));

        }

      },
      text(){

        const { type, value } = JSON.parse( this.msg.parts[ 0 ].content );

        console.log({ type, value });

        if(type === 'lead.state.date'){

          return formatMonth(value);

        }

        if ( type === 'lead.state.changed' ) {

          //return null;

          let name = null;

          switch ( value ) {
            case 'COMPLETED':
              name = 'Выполнен';
              break;
            case 'ON_DELIVERY':
              name = 'На доставке';
              break;
            case 'SUBMITTED':
              name = 'Подтверждён';
              break;
            case 'CANCELLED':
              name = 'Отменён';
              break;
          }

          if ( name === null ) {
            return name;
          }

          return `статус изменен на ${ name }`;

        }

        if ( type === 'suplier.called' ) {

          return `отправлено уведомление поставщику`;

        }

        if ( type === 'customer.called' ) {

          return `отправлено уведомление покупателю`;

        }

        if ( type === 'customer.phone.added' ) {

          return `добавлен номер телефона покупателя`;

        }

      }
    }
  }
</script>
