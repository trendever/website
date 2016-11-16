<style src='./styles/chat-msg-status.pcss'></style>
<style src='./styles/chat-bar.pcss'></style>
<template lang="jade">
.chat-row.__center
  .chat-msg-status
    span
     | {{getUsernameRaw}} отправил запрос на получение {{getAmmount | curency_spaces}}
     i.ic-currency-rub

.chat-approve-btn(v-if='showPayButton' )
  .btn-payment(@click="pay")
    span ОТПРАВИТЬ {{getAmmount | curency_spaces}} ₽
  .btn-cancel(@click="cancel") <i class="ic-close"></i>

.chat-pending-btn(v-if='showPendingButton' )
  .btn-payment
    span ЗАПРОШЕНО {{getAmmount | curency_spaces}} ₽
  .btn-cancel(@click="cancel") <i class="ic-close"></i>

iframe.payment-window(v-if='showPayButton', id="paymentIframe" v-bind:src="payLink" v-show="showPaymentWindow")

</template>

<script type='text/babel'>
  import { getCurrentMember, getShopName, getLastMessageId, getLeadId, getCustomerName,getCustomerId,getAction} from 'vuex/getters/chat.js';
  import {setConversationAction,setConversationActionData} from 'vuex/actions/chat.js'
  import { user } from 'vuex/getters/user.js';
  import * as service from 'services/chat';
  import * as leads from 'services/leads';
  import { formatTime, formatDatetime, escapeHtml, wrapLink } from './utils';
  import * as cardService from 'services/card';
  import { getPaymentAmmount } from 'project/payment/functions.js';

  export default{
    data() {
      let _payid = JSON.parse(this.msg.parts[0].content).pay_id;
      this.showPaymentWindow = false;

      window.onmessage = (msg) => {
        var fra = document.getElementById("paymentIframe");
        if(msg.data && msg.data.name=="Close" && msg.source == fra.contentWindow) {
          if (msg.data.redirect_url){
            this.showPaymentWindow = false;
            window.location = msg.data.redirect_url;
          }else{
            this.cancel();
            this.showPaymentWindow = false;
          }
        }
      };

      if (!this.msg.parts[1]){
        //Если выставил покупатель
        if (this.msg.user.role === 1){
          if (this.getCurrentMember.user_id !== this.getCustomerId){
            this.setConversationAction("pay");
            this.setConversationActionData({id: _payid});
          }else{
            this.setConversationAction("pendingpayment");
            this.setConversationActionData({id: _payid})
          }
        //Иначе выставили со стороны магазина
        }else{
          if (this.getCurrentMember.user_id === this.getCustomerId){
            this.setConversationAction("pay");
            this.setConversationActionData({id: _payid});
          }else{
            this.setConversationAction("pendingpayment");
            this.setConversationActionData({id: _payid})
          }
        }
      }
      return {
        canceled: false,
        payLink: "",
        showPaymentWindow: false
      }
    },
    props: {
      msg: {
        type: Object,
        required: true
      }
    },
    vuex: {
      actions: {
        setConversationAction,
        setConversationActionData
      },
      getters: {
        getAction,
        getShopName,
        getCurrentMember,
        getLastMessageId,
        getCustomerName,
        getCustomerId,
        user,
        getLeadId
      }
    },
    methods:{
      pay(){
        cardService.createPayment({
          id: +this.payId,
          lead_id: +this.getLeadId
        }).then(path=>{
          this.$set("payLink",path.redirect_url);
          this.$set("showPaymentWindow",true);
        });
      },
      cancel(){
        cardService.cancelPayment({
          lead_id: +this.getLeadId,
          id: +this.payId
        }).then(data=>{
          this.$set('canceled', true);
          this.setConversationAction("base");
        });
      }
    },
    computed: {
      isDone(){
        if (this.msg.parts[1] || this.canceled){
          return true;
        }else{
          return false;
        }
      },
      payId(){
        let _payid = JSON.parse(this.msg.parts[0].content).pay_id;
        return _payid;
      },
      getAmmount(){
        return getPaymentAmmount(this.msg);
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
      succes(){
        if (this.msg.parts[1]){
          var object = JSON.parse(this.msg.parts[1].content);
          if (object.success){
            return object.success
          }
        }
        return false;
      },
      getPaymentNames(){
        var _from, _to;
        if (this.msg.user.role === 1){
          _from = this.getShopName;
          _to = this.msg.user.name;
        }else{
          _from = this.getCustomerName;
          _to = this.getShopName;
        }
        return {from: _from,to: _to};
      },
      showPayButton(){
        if (this.getAction == 'pay'){
          if (this.msg.user.role === 1){
            return this.msg.user.user_id !== this.$store.state.user.myId && !this.isDone;
          }else{
            return this.getCustomerId === this.$store.state.user.myId && !this.isDone;
          }
        }
      },
      showPendingButton(){
        if (this.getAction == 'pendingpayment'){
          if (this.msg.user.role === 1){
            return this.msg.user.user_id === this.$store.state.user.myId && !this.isDone;
          }else{
            return this.getCustomerId !== this.$store.state.user.myId && !this.isDone;
          }
        }
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
