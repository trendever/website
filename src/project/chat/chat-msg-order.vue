<style src='./styles/chat-msg-date.pcss'></style>
<template lang="jade">
  .chat-row.__center
    .chat-msg-date
      template(v-if='msg.user.user_id === $store.state.user.myId')
        span 
         | Вы отправили запрос на получение {{getAmmount | curency_spaces}}
         i.ic-currency-rub
      template(v-else)
        span 
         | {{getUsernameRaw}} отправил запрос на получение {{getAmmount | curency_spaces}}
         i.ic-currency-rub
    
</template>

<script type='text/babel'>
  import { getCurrentMember, getShopName, getLastMessageId, getLeadId } from 'vuex/getters/chat.js';
  import {setConversationAction} from 'vuex/actions/chat.js'
  import { user } from 'vuex/getters/user.js';
  import * as service from 'services/chat';
  import * as leads from 'services/leads';
  import { formatTime, formatDatetime, escapeHtml, wrapLink } from './utils';


  export default{
    data() {
      return {
        payid : 0,
        ammount: 0
      }
    },
    props: {
      msg: {
        type: Object,
        required: true
      }
    },
    watch: {
        msg : (val) => {
          let _payid = JSON.parse(val.parts[0].content).pay_id;
          let _ammount = JSON.parse(val.parts[0].content).amount;
          this.$set('payid',_payid);
          this.$set('ammount',_ammount);
          this.setConversationAction({type:'pay'});
        }
    },
    vuex: { 
      actions: {
        setConversationAction
      },
      getters: {
        getShopName,
        getCurrentMember,
        getLastMessageId,
        user,
        getLeadId
      }
    },
    computed: {
      payId(){
        return this.payid
      },
      getAmmount(){
        let ammount = this.ammount;
        return ammount/100;
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

      getUsernameRaw() {
        if (this.isCustomer) {
          return `${this.msg.user.name}`
        }
        if (this.msg.user.role === leads.USER_ROLES.SUPPLIER.key) {
          return `${this.getShopName}`
        }
        if ( this.getCurrentMember !== null ) {
          if(this.getCurrentMember.role === leads.USER_ROLES.CUSTOMER.key){
            return `${this.getShopName}`
          }
        }
        return `${this.getShopName} (${this.msg.user.name})`
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
