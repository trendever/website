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
          input(type='text' placeholder='0' v-model="billPrice | rub").payment-summ-input 
          //- span. &#x20bd

      .check-card
        div(v-if="userCards.length")
          .check-card-text Выберите карту, #[br] куда будут зачислены деньги
          .check-card-select-wrap
            i.ic-check-card
              img(src='icons/card_1.png').ic-card_1
            select(v-model="cardNumber" v-if="userCards.length").check-card-select
              option(v-for="card in userCards") {{ card.number }}
        .check-card-input-wrap()
          i.ic-card-new
            img(src='icons/card_2.png')
          input(type='text',
               v-if="!currentCardId",
               v-model="currentCardNumber").check-card-input
          h1(v-if="currentCardId") **** **** **** {{ currentCardNumber }}
      p.payment-note Деньги будут перечислены#[br]  прямо вам на карту с помощью#[br]  платежного сервиса Payture.ru

  .btn-container
    button(@click="leadOrder").btn.btn_primary.__orange.__xl.fast__big__btn.btn_fixed-bottom Отправить
</template>
<script>
import * as cardService from 'services/card';
import channel from 'services/channel/channel';     
import { getShopId, getLeadId, getId } from 'vuex/getters/chat';
import { setShowMenu } from 'vuex/actions/chat';
import * as product from 'services/products';

export default{
  props:{
    setOpen:{
      default: true
    }
  },
  vuex:{
    actions: {
      setShowMenu
    },
    getters: {
      getShopId,
      getLeadId
    }
  },
  data(){
    return {
      billPrice: '',
      cardNumber: '',
      currentCardNumber: '',
      currentCardId: '',
      userCards: [],
      cardName: '',
    }
  },
  methods: {
    leadOrder(){

      let newCardNumber = null;

      //если нету карт
      if(!this.userCards.length && this.currentCardNumber.length === 16){
        newCardNumber = this.currentCardNumber;
        alert("новая карта: " + this.currentCardNumber);
      }

      //если нету карт
      if(!this.userCards.length && this.currentCardNumber.length === 16){
        newCardNumber = this.currentCardNumber;
        alert("новая карта: " + this.currentCardNumber);
      }

      //если есть карты проверям является ли карта новой
      if(this.userCards.length){
        this.userCards.forEach(card=>{
          if(card.number !== getlastFour(this.currentCardNumber) && this.currentCardNumber.length === 16){
            newCardNumber = this.currentCardNumber;
            alert("новая карта не из массива: " + this.currentCardNumber);
          }
        });
      }

      //если новая карта
      if(newCardNumber !== null && this.currentCardNumber.length > 4){
        //создаем новую карту
        cardService.create({
            card_number: this.currentCardNumber,
            shop_id: this.getShopId})
        .then(data=>{
          if(data.success){
            alert("карта создана");
            //получаем карты пользователя
            return this
              ._getCards()
              .then(cards=>{
                if(cards !== null){
      
                  let cardToMakeOrder = cards.filter(card=>{
                    return card.number === getlastFour(this.currentCardNumber);
                  })

                  this.userCards = cards;
                  return cardToMakeOrder[0];
                }

              })
          }
        })

        .then(card=>{

          this.currentCardId = card.id;

        })

        .then(()=>{

          this.makeOrder();

        });

      } else {

        if(!this.currentCardId){
          alert('Карта не выбрана');
          return;
        }

        this.makeOrder();

      }

      }
    },

    close(){
      this.setOpen = false;
      this.setShowMenu(false);
    },

    makeOrder(){
      cardService.createOrder({
        amount: +this.billPrice, 
        card: this.currentCardId,
        currency: 0,
        lead_id: this.getLeadId
      }).then((order)=>{

        alert('Счет выставлен');
        
        this.setOpen = false;
        this.setShowMenu(false);

      });

    },
    deleteCard(cardId){
      return cardService.deleteCard({
        card_id: cardId 
      }).then(()=>{
        alert('карта удалена');
      });
    },
    _getCards(){
      return cardService.retrieve({
        shop_id: this.getShopId
      })
    }
  },
  filters:{
    rub:{
      read(val) {
        return + val + ' ₽';
      },
      // view -> model
      // formats the value when writing to the data.
      write(val, oldVal) {
        var number = +val.replace(/[^\d.]/g, '')
        return isNaN(number) ? 0 : parseFloat(number.toFixed(2))
      }
    }
  },
  watch:{
    cardNumber(val){
      let currentCard = this.userCards.filter(card=>{
        return card.number === val;
      });
      this.setShowMenu(false);
      this.$set('currentCardId',currentCard[0].id);
      this.$set('currentCardNumber',currentCard[0].number);
    },
    setOpen(val){
      if(val === true){
        this._getCard().then(data=>{
          if(data !== null){
            this.$set('userCards', data);
          }
        });
      }
    }
  }
}
function getlastFour(string){
  return string.split('').slice(12,16).join('');
}