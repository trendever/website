<style src='./style.pcss' scoped></style>
<template lang="jade">
.payment(v-if="setOpen")
  a(href='#').close
    i(@click="close").ic-close
  .bottom-margin
    .payment-wrapper
      .payment-head Выставите счет на оплату
      .payment-summ
        .payment-summ-text Введите сумму к оплате
        .payment-summ-input-wrapper
          i.ic-rouble
          input(type='text' placeholder='0' value=" 0 ₽" v-model="billPrice").payment-summ-input 
          //- span. &#x20bd

      .check-card
        .check-card-text Выберите карту, #[br] куда будут зачислены деньги
        .check-card-select-wrap
          i.ic-check-card
            img(src='icons/card_1.png').ic-card_1
          select(v-model="cardName").check-card-select
            option Новая карта
            option Новая карта 2
        .check-card-input-wrap
          i.ic-card-new
            img(src='icons/card_2.png')
          input(type='text' placeholder='0000 0000 0000 0000' v-model="cardNumber").check-card-input
      p.payment-note Деньги будут перечислены#[br]  прямо вам на карту с помощью#[br]  платежного сервиса Payture.ru

  .btn-container
    button.btn.btn_primary.__orange.__xl.fast__big__btn.btn_fixed-bottom Отправить
</template>
<script>
import channel from 'services/channel/channel';
import { getShopId } from 'vuex/getters/chat';
export default{
  props:['setOpen'],
  vuex:{
    getters: {
      getShopId
    }
  },
  data(){
      return {
        cardName: '',
        cardNumber: '',
        billPrice: ''
      }

  },
  methods: {
    close(){
      this.setOpen = false;
    },
    cardCreate(){
      channel.req('card','create',{
          card_name: this.cardName,
          card_number: this.cardNumber,
          shop_id: this.shopId
      })
    },
    cardRetrieve(){
      channel.req('card','retrieve',{
        shop_id: this.shopId
      })
    }
  }
}
</script>
