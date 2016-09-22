<style src='./style.pcss' scoped></style>
<template lang="jade">
.payment.pay-fixed(v-if="setOpen")
  a(@click="close").close
    i.ic-close
  .bottom-margin
    .payment-wrapper
      .payment-head Запрос на получение денег
      .error-message
      //(v-if="errorMessage") {{ errorMessage }}
      .payment-summ
        .payment-summ-text Введите сумму к получению
        .payment-summ-input-wrapper
          .phantom-input(v-if="!activateInput" @click="startInput")
            span(v-if="!billPrice") 0
            span.bill-price(v-if="billPrice") {{ billPrice }}
            i.ic-currency-rub
          input(type='number',
                v-el:price,
                v-model="billPrice",
                v-if="activateInput",
                @blur="activateInput=false").payment-summ-input
          //- span. &#x20bd
          //-i.ic-currency-rub

      .check-card
        div
          .check-card-text Выберите карту, куда будут зачислены деньги
          .check-card-select-wrap
            i.ic-check-card
              img(src='icons/card_1.png').ic-card_1
            select(v-model="selectedCardId").check-card-select
              option(v-for="card in userCards" v-bind:value="card.id") {{card.name}} {{ card.number }}
              option(value="0") Новая карта
        .check-card-input-wrap()
          i.ic-card-new
            img(src='icons/card_2.png')
          input(type='text',
               maxlength="22",
               v-if="selectedCardId == 0",
               v-on:input="onChangeNumber").check-card-input
          h1(v-if="selectedCardId > 0 && !errorMessage") **** **** **** {{ currentCardNumber }}
      p.payment-note
        | Деньги будут перечислены на#[br(v-if="isMobile")] твою карту за вычетом#[br(v-if="!isMobile")]комиссии -#[br(v-if="isMobile")] 1.48%, но не менее 50 руб. Payture.ru
      img.note-img(src='img/pay_cards.svg' v-if="isMobile")

  .btn-container
    button(@click="leadOrder").btn.btn_primary.__orange.__xl.fast__big__btn.btn_fixed-bottom Отправить
    div
      img.note-img(src='img/pay_cards.svg' v-if="!isMobile")

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
      isMobile: window.browser.mobile,
      activateInput: false,
      //error
      errorMessage: '',
      //card logic
      billPrice: '',
      cardNumber: '',
      currentCardNumber: '',
      currentCardId: '',
      userCards: [],
      selectedCardId: 0
    }
  },
  methods: {
    onChangeNumber(e){
      e.target.value = e.target.value.replace(/\s+/g, '');
      this.$set('currentCardNumber',e.target.value);
        var result = '';
        var last_one = 0;
        for (var i = 0; i < e.target.value.length; i++){
          var input_number = 0;
          var temp_result = "";
          if (i%4 === 0 && i >0 && i < 14){
            temp_result += e.target.value.slice(i-4,i) + " ";
            last_one = i;
            input_number++;
          }
          result += temp_result;
        }
        e.target.value = result + e.target.value.slice(last_one,e.target.value.length);
    },
    startInput(){
      this.activateInput = true;

      this.$nextTick(()=>{
        this.$els.price.focus();
      });

    },
    leadOrder(){
      console.log("HJAHAHA");
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
      let _trueprice = Math.round(this.billPrice/1.015);

      if ( this.billPrice - _trueprice < 50){
        _trueprice = (this.billPrice > 50) ? this.billPrice - 50 : this.billPrice;
      }

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
    isDigit:{
      read(val) {
        if(!val){
          return '';
        }
        return val;
      },
      write(val) {
        var number = +val.replace(/[^\d.]/g, '')
        return isNaN(number) ? '' : parseFloat(number.toFixed(2))
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
    selectedCardId(val){
      if (val > 0){
        let currentCard = this.userCards.find(card=>{
          return card.id === val;
        });
        this.$set('currentCardId',currentCard.id);
        this.$set('currentCardNumber',currentCard.number);
      }else{
        this.$set('currentCardId','');
        this.$set('currentCardNumber','');
      }
    },
    setOpen(val){
      let fixed = document.querySelector('.u-fixed');

      if(val === true){
        fixed.style.zIndex = 0;
        this._getCards().then(data=>{

          if(data !== null){
            console.log("userCards:");
            console.log(data);
            this.$set('userCards', data);
          }

        });
      } else {
        fixed.style.zIndex = 100;
      }

    }
  }
}
//helpers
function getlastFour(string){
  return string.split('').slice(12,16).join('');
}
</script>
