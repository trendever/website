<style src='./styles/chat-msg.pcss'></style>
<template lang="jade">

.chat-row(:class='getSide')
  span(class='bubble_info bubble_info_time') {{ datetime }}
  .bubble_info.bubble_info_status(v-if='isOwnMessage')
    i(:class='{"ic-check": isLoaded && !isRead, "ic-check-double": isRead, "ic-clock": !isLoaded}')
  .chat-msg.bubble(:class='{"chat-msg-closest":isClosest, "chat-msg-not-closest":!isClosest && !isAfterServiceMessage }')
    .chat-msg_t(
        v-if='!isOwnMessage && !isClosest && !directbot',
        :class='{"chat-msg_t-customer-color":isCustomer}',
        v-link='{name: "user", params: {id: getUserNameLink}}'
      )
      | {{{ getUsername }}}
    .chat-msg_t(
        v-if='!isOwnMessage && !isClosest && directbot',
        :class='{"chat-msg_t-customer-color":isCustomer}',
        v-on:click="goInstagramProfile"
      )
      | {{{ getUsername }}}
    .chat-msg-wrap
      p.chat-msg_txt
        | {{{ getMessage }}}



</template>

<script type='text/babel'>
  import { navigateTolink } from 'utils';
  import { getCurrentMember, getShopName, getLastMessageId } from 'vuex/getters/chat.js';
  import { user } from 'vuex/getters/user.js';
  import * as service from 'services/chat';
  import * as leads from 'services/leads';
  import { formatTime, formatDatetime, escapeHtml, wrapLink } from './utils';

  export default{
    props: {
      directbot: {
        type: Boolean,
        default: false
      },
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
        user
      }
    },
    methods:{
      goInstagramProfile(){
        navigateTolink(`http://instagram.com/${this.getUserNameLink}`, true);
      }
    },
    computed: {
      isLoaded(){
        if( 'loaded' in this.msg){
          return this.msg.loaded;
        }
        return true;
      },
      isAfterServiceMessage(){
        return !!this.msg.afterServiceMessage;
      },
      getMessage() {
       return wrapLink(escapeHtml(this.msg.parts[0].content).replace(/\n/g, '<br />')).replace(/₽/g, '&nbsp;<i class="ic-currency-rub"></i> ');
      },
      datetime() {
        return formatTime(this.msg.created_at);
      },
      getUserNameLink() {
        //серисные сообшения
        if(this.msg.user.name === 'trendever'){
          return 'trendevercom';
        }
        if (this.isCustomer) {
          return this.msg.user.name;
        }
        return this.getShopName;
      },
      getUsername() {
        //сервисные сообщения
        if(this.msg.user.name === 'trendever'){
          return '<b>trendever</b>';
        }
        if (this.isCustomer) {
          if (this.msg.user.name.indexOf("customer_") >= 0){
            return `<b>${this.msg.user.name.replace("customer_","client")}</b>`
          }
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
