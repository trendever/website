<style src='./styles/chat-msg-order.pcss'></style>
<template lang="jade">

.chat-row(:class='getSide')
  span(class='bubble_info bubble_info_time') {{ datetime }}
  .bubble_info.bubble_info_status(v-if='isOwnMessage')
    i(:class='{"ic-check": isLoaded && !isRead, "ic-check-double": isRead, "ic-clock": !isLoaded}')
  .chat-msg.bubble(:class='{"chat-msg-closest":isClosest, "chat-msg-not-closest":!isClosest && !isAfterServiceMessage }')
    .chat-msg_t(
        v-if='!isOwnMessage && !isClosest',
        :class='{"chat-msg_t-customer-color":isCustomer}'
        v-link='{name: "user", params: {id: getUserNameLink}}',
      )
      | {{{ getUsername }}}
    .chat-msg-wrap
      p(@click="pay", v-if="getCurrentMember.role === 1;").chat-msg_order
        | Вам высталвен счет #[br] Кликните чтобы оплатить
      p(v-else)
        | Счет выставлен #[br] Ожидайте оплату



</template>

<script type='text/babel'>
  import { getCurrentMember, getShopName, getLastMessageId, getLeadId } from 'vuex/getters/chat.js';
  import { user } from 'vuex/getters/user.js';
  import * as service from 'services/chat';
  import * as leads from 'services/leads';
  import { formatTime, formatDatetime, escapeHtml, wrapLink } from './utils';
  import * as cardService from 'services/card';

  export default{
    props: {
      msg: {
        type: Object,
        required: true
      }
    },
    vuex: {
      getters: {
        getShopName,
        getCurrentMember,
        getLastMessageId,
        user,
        getLeadId
      }
    },
    methods:{
      pay(){
        cardService.createPayment({
          id: this.payId,
          lead_id: this.getLeadId
        }).then(path=>{
          window.location = path.redirect_url;
        });
      }
    },
    computed: {
      payId(){
        return JSON.parse(this.msg.parts[0].content).pay_id;
      },
      isLoaded(){
        if( 'loaded' in this.msg){
          return this.msg.loaded;
        }
        return true;
      },
      isAfterServiceMessage(){
        return !!this.msg.afterServiceMessage;
      },
      datetime() {
        return formatTime(this.msg.created_at);
      },
      getUserNameLink() {
        if (this.isCustomer) {
          return this.msg.user.name;
        }
        return this.getShopName;
      },
      getUsername() {
        if (this.isCustomer) {
          return `<b>${this.msg.user.name}</b>`
        }
        if (this.msg.user.role === leads.USER_ROLES.SUPPLIER.key) {
          return `<b>${this.getShopName}</b>`
        }
        if ( this.getCurrentMember !== null ) {
          if(this.getCurrentMember.role === leads.USER_ROLES.CUSTOMER.key){
            return `<b>${this.getShopName}</b>`
          }
        }
        return `<b>${this.getShopName}</b> (${this.msg.user.name})`
      },

      isCustomer(){
        return this.msg.user.role === leads.USER_ROLES.CUSTOMER.key;
      },
      isClosest(){
        return this.msg.closestMessage;
      },
      isOwnMessage() {

/*        if(this.msg.addDateStatus !== null){

          console.log(formatDatetime(this.msg.addDateStatus));

        }*/

        if ( this.getCurrentMember !== null ) {
          return this.getCurrentMember.user_id === this.msg.user.user_id;
        }
        return false;
      },
      isSending() {
        return false;
      },
      isSent() {
        return !this.isRead
      },
      isRead() {
        return this.getLastMessageId >= this.msg.id
      },
      getSide() {
        return this.isOwnMessage ? '__right' : '__left';
      },
    },

  }
</script>
