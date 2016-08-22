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
          input(type='text' placeholder='0' v-model="billPrice").payment-summ-input 
          //- span. &#x20bd

      .check-card
        div(v-if="userCards.length")
          .check-card-text Выберите карту, #[br] куда будут зачислены деньги
          .check-card-select-wrap
            i.ic-check-card
              img(src='icons/card_1.png').ic-card_1
            select(v-model="cardNumber" v-if="userCards.length").check-card-select
              option(v-for="card in userCards") {{ card.number }}
        .check-card-input-wrap
          i.ic-card-new
            img(src='icons/card_2.png')
          input(type='text' placeholder='0000 0000 0000 0000' v-model="currentCardNumber").check-card-input
      p.payment-note Деньги будут перечислены#[br]  прямо вам на карту с помощью#[br]  платежного сервиса Payture.ru

  .btn-container
    button.btn.btn_primary.__orange.__xl.fast__big__btn.btn_fixed-bottom Отправить
</template>
<script>
import * as cardService from 'services/card';
import channel from 'services/channel/channel';     
import { getShopId } from 'vuex/getters/chat';
import * as product from 'services/products';

export default{
  props:{
    setOpen:{
      default: true
    }
  },
  vuex:{
    getters: {
      getShopId
    }
  },
  data(){
    return {
      billPrice: '',
      cardNumber: '',
      currentCardId: '',
      userCards: [],
    }
  },
  methods: {
    leadOrder(){

      let newCardNumber = null;

      this.userCards.forEach(card=>{
        if(card.number !== this.currentCardNumber){
          let newCardNumber = this.currentCardNumber;
        }
      });

      if(newCardNumber !== null){
        //создаем новую карту
        cardService.create({
            card_number: this.cardNumber,
            shop_id: this.shopId
        })

        .then(data=>{
          if(data.success){
            //получаем карты пользователя
            return this.getCard().then(data=>{
              if(data !== null){
                let cardToMakeOrder = data.filter(card=>{
                  return card.number === this.currentCardNumber.split('').slice(0,11).join('');

                })
                return cardToMakeOrder;
                
              }
            })
          }
        })

        .then(card=>{

          this.currentCardId = card.id;
          this._makeOrder();

        });

        return;

      }

      this._makeOrder();
    },

    close(){
      this.setOpen = false;
    },

    _makeOrder(){
      cardService.createOrder({
        amount: this.billPrice, 
        card: this.currentCardId,
        currency: 0,
        lead_id: this.getLeadId
      }).then(()=>{
        alert('Счет выставлен');
        this.setOpen = false;
      });
    },

    _getCard(){
      return cardService.retrieve({
        shop_id: this.getShopId
      })
    }
  },
  watch:{
    cardNumber(val){

      let currentCard = this.userCards.filter(card=>{
        return card.number === val;
      });

      this.$set('currentCardId',currentCard[0].id);
      this.$set('currentCardNumber',currentCard[0].number);

      //console.log(JSON.parse(JSON.stringify(currentCard)));

    },
    setOpen(val){
      if(val === true){

        this._getCard().then(data=>{
          console.log(JSON.parse(JSON.stringify(data)));
          if(data !== null){
            this.$set('userCards', data);
          }

        });

        console.log('shop id: ' + this.getShopId);
      }
    }
  }
}
</script>
