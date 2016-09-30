<style src='./styles/chat-msg-status.pcss'></style>
<template lang="jade">
.chat-row.__center
  .chat-msg-status
    template(v-if='donePayment')
      span(v-if="succes")
       | {{getPaymentNames.from}} отправил {{getAmmount | curency_spaces}}
       i.ic-currency-rub
       |  на карту {{getPaymentNames.to}}
      span(v-else)
       | Перевод не удался
    template(v-else)
      span
        | <b>{{getPaymentNames.from}}</b> отменил перевод
      
</template>

<script>
  import { getShopName, getCustomerName } from 'vuex/getters/chat.js';
  import { getPaymentAmmount } from 'project/payment/functions.js';

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
        getCustomerName
      }
    },
    computed: {
      donePayment(){
        return this.msg.parts[0].mime_type === 'json/payment';
      },
      succes(){
        let message = JSON.parse(this.msg.parts[0].content);
        if (message.succes){
          return true;
        }
        if (message.failure){
          return false;
        }
        return true;
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
      getAmmount(){
        return getPaymentAmmount(this.msg);
      },
    }
  }
</script>
