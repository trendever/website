<style src='./styles/chat-msg-date.pcss'></style>
<template lang="jade">
  .chat-row.__center(v-if="isHide")
    .chat-msg-date
      span {{text}}

</template>

<script>
  import { getCurrentMember } from 'vuex/getters/chat.js';
  import * as leads from 'services/leads';

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

        if ( type === 'lead.state.changed' ) {

          let name = '';

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
