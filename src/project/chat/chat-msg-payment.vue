<style src='./styles/chat-msg-date.pcss'></style>
<template lang="jade">
.chat-row.__center
  .chat-msg-date
    span(v-if="succes")
     | {{getPaymentNames.from}} отправил {{getAmmount | curency_spaces}}
     i.ic-currency-rub
     |  на карту {{getPaymentNames.to}}
    span(v-else)
     | Перевод не удался
      
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
      succes(){
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
