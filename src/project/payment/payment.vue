<style src='./style.pcss' scoped></style>
<template lang="jade">
.payment(v-if="setOpen")
  a(@click="close").close
    i.ic-close
  .bottom-margin
    .payment-wrapper
      .payment-head Выставите счет на оплату
      .payment-summ
        .payment-summ-text Введите сумму к оплате
        .payment-summ-input-wrapper
          input(type='text' placeholder='0' v-model="billPrice").payment-summ-input
          //- span. &#x20bd
          i.ic-currency-rub

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
               v-if="!currentCardId && !errorMessage",
               v-model="currentCardNumber").check-card-input
          h1(v-if="errorMessage") {{ errorMessage }}
          h1(v-if="currentCardId && !errorMessage") **** **** **** {{ currentCardNumber }}
      p.payment-note 
        | Деньги будут перечислены#[br]  прямо вам на карту с помощью#[br]  платежного сервиса Payture.ru
        img(src='img/pay_cards.svg')

  .btn-container
    button(@click="leadOrder").btn.btn_primary.__orange.__xl.fast__big__btn.btn_fixed-bottom Отправить

</template>
<script>
import * as cardService from 'services/card';
import channel from 'services/channel/channel';
import { getShopId, getLeadId, getId } from 'vuex/getters/chat';
import { setShowMenu } from 'vuex/actions/chat';
import { getCurrentMember } from 'vuex/getters/chat';
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
      getCurrentMember,
      getShopId,
      getLeadId
    }
  },
  data(){
    return {
      //error
      errorMessage: '',
      //card logic
      billPrice: '',
      cardNumber: '',
      currentCardNumber: '',
      currentCardId: '',
      userCards: [],
    }
  },
  methods: {

    leadOrder(){

      if(!this.currentCardNumber){
        this.setMessage('Карта не выбрана');
        return;
      }

      let newCardNumber = null;

      //если нету карт
      if(!this.userCards.length && this.currentCardNumber.length === 16){
        newCardNumber = this.currentCardNumber;
        this.setMessage('Новая карта')
      }

      //если есть карты, проверям является ли карта новой
      if(this.userCards.length && this.currentCardNumber.length === 16){

        let oldCard = this.userCards.find(card=>{
          return card.number === getlastFour(this.currentCardNumber);
        })

        if(!oldCard){
          newCardNumber = this.currentCardNumber;
        } else {
          this.setMessage('Карта уже зарегистрированна');
          return;
        }

      }

      //если новая карта
      if(newCardNumber !== null && this.currentCardNumber.length === 16) {

        //создаем новую карту
        cardService.create({
            card_number: this.currentCardNumber,
            shop_id: this.shopId
        })

        .then(data=>{
          if(data.success){

            this.setMessage('Создана новая карта');
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
        },err=>{

          console.log(err);

        })

        .then(card=>{

          if(!card) {
            this.setMessage('Не валидный RPC')
            return null;
          }

          this.currentCardNumber = card.number;
          this.currentCardId = card.id;
          return true;

        })

        .then( action => {

          if(action !== null){

            this.makeOrder();

          }

        });

      } else {

        if(newCardNumber === null && !this.currentCardId){
          this.setMessage('Не валидная карта');
          return;
        }

        if(!this.currentCardId){
          this.setMessage('Карта не выбрана');
          return;
        }

        this.makeOrder();

      }
    },

    setMessage(message){
      this.$set('errorMessage', message);

      setTimeout(()=>{
        this.$set('errorMessage', '');
      },3000);

    },
    close(){
      this.setOpen = false;
      this.setShowMenu(false);
    },
//сумма которую мы транслируем в Payture равна "сумма которую написал продавец" разделить на "1+процент комиссии"
    makeOrder(){
      console.log("Bill price"+this.billPrice);
      let _trueprice = this.billPrice/1.015;
      console.log("Order price to payture"+_trueprice);
      cardService.createOrder({
        amount: +_trueprice,
        card: this.currentCardId,
        currency: 0,//0 - рубли
        lead_id: this.getLeadId
      }).then((order)=>{
        this.setMessage('Счет выставлен');

        //закрываем компонент
        this.setOpen = false;
        this.setShowMenu(false);

      },err=>{
        this.setMessage('Укажите цену');
      });
    },
    //метод не используется в компоненте
    deleteCard(cardId){
      return cardService.deleteCard({
        card_id: cardId
      }).then(()=>{
        console.log('карта удалена');
      });
    },
    _getCards(){
      return cardService.retrieve({
        shop_id: this.shopId
      })
    }
  },
  filters:{
    rub:{
      read(val) {
        return + val + ' ₽';
      },
      write(val) {
        var number = +val.replace(/[^\d.]/g, '')
        return isNaN(number) ? 0 : parseFloat(number.toFixed(2))
      }
    }
  },
  computed:{
    shopId(){
      //если простой покупатель
      if(this.getCurrentMember.role === 1){
        return 0;
      }
      //если селлер или shop
      return this.getShopId;
    }
  },
  watch:{
    cardNumber(val){

      let currentCard = this.userCards.find(card=>{
        return card.number === val;
      });

      this.$set('currentCardId',currentCard.id);
      this.$set('currentCardNumber',currentCard.number);

    },
    setOpen(val){
      if(val === true){
        this._getCards().then(data=>{

          if(data !== null){
            this.$set('userCards', data);
          }

        });
      }
    }
  }
}
//helpers
function getlastFour(string){
  return string.split('').slice(12,16).join('');
}
</script>