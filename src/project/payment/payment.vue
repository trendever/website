<style src='./style.pcss' scoped></style>
<template lang="jade">
.payment.pay-fixed
  a(@click="close").close
    i.ic-close
  .bottom-margin
    .payment-wrapper
      .payment-head Запрос на получение денег
      .payment-summ
        .payment-summ-text
          .error-message(v-if="errorMessage") {{ errorMessage }}
          .transparent(v-else)
            Введите сумму к получению
        .payment-summ-input-wrapper
          .phantom-input(v-if="!activateInput" @click="startInput")
            span(v-if="!billPrice") 0
            span.bill-price(v-if="billPrice") {{ billPrice }}
            i.ic-currency-rub
          input(type='tel',
                v-el:price,
                v-model="billPrice",
                v-if="activateInput",
                onkeypress='return event.charCode >= 48 && event.charCode <= 57',
                @blur="activateInput=false").payment-summ-input

      .check-card
        div
          .check-card-text Выберите карту#[br(v-if="isMobile")] куда будут зачислены деньги
          .check-card-select-wrap
            i.ic-check-card
              img(src='icons/card_1.png').ic-card_1
            select(v-model="selectedCardId").check-card-select
              option(v-for="card in userCards" v-bind:value="card.id") {{card.name}} {{ card.number }}
              option(value="0") Новая карта
        .check-card-input-wrap()
          i.ic-card-new
            img(src='icons/card_2.png')
          input(type='tel',
               maxlength="19",
               v-if="selectedCardId == 0",
               onkeypress='return event.charCode >= 48 && event.charCode <= 57',
               v-on:input="onChangeNumber").check-card-input
          h1(v-if="selectedCardId > 0") **** **** **** {{ currentCardNumber }}
      p.payment-note
        | Деньги будут перечислены на#[br(v-if="isMobile")] твою карту за вычетом#[br(v-if="!isMobile")] комиссии -#[br(v-if="isMobile")] 1.48%, но не менее 50 руб. Payture.ru
      img.note-img(src='img/pay_cards.svg' v-if="isMobile")

  .btn-container
    button(@click="leadOrder").btn.btn_primary.__orange.__xl.fast__big__btn.btn_fixed-bottom Отправить
    div
      img.note-img(src='img/pay_cards.svg' v-if="!isMobile")

</template>
<script>
import * as cardService from 'services/card';
import channel from 'services/channel/channel';
import { getPayment} from 'vuex/getters/user';
import * as product from 'services/products';
import store from 'vuex/store';

export default{
  props:{

  },
  vuex:{
    getters: {
      getPayment
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
  ready() {
    this.setOpen();
  },
  methods: {
    setOpen(){
      this._getCards().then(data=>{
        if(data !== null){
          this.$set('userCards', data);
        }
      });
    },
    onChangeNumber(e){
      e.target.value = e.target.value.replace(/\s+/g, '');
      this.$set('currentCardNumber',e.target.value);
      //если есть карты, проверям является ли карта новой
      if(this.userCards.length && e.target.value.length >= 15){
        let oldCard = this.userCards.find(card=>{
          return card.number === getlastFour(this.currentCardNumber);
        })

        if(oldCard){
          this.$set('selectedCardId',oldCard.id);
        } 

      }

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
      this.billPrice =+this.billPrice;
      if(!this.billPrice){
        this.setMessage('Введите сумму');
        return;
      }
      if(this.billPrice < 250){
        this.setMessage('Минимальная сумма - 250');
        return;
      }
      if(!this.currentCardNumber){
        this.setMessage('Карта не выбрана');
        return;
      }


      //если новая карта
      if(this.selectedCardId === 0 && this.currentCardNumber.length >= 16) {

        //создаем новую карту
        cardService.create({
            card_number: this.currentCardNumber,
            shop_id: this.getPayment.shopId
        })
        .then(data=>{
          if(data.success){
            this.currentCardId = data.id;
            this.makeOrder();
          }
        },err=>{
          this.setMessage('Не валидный RPC')
          console.log(err);
          return false;
        });

      }else{ 
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
      this.$router.go(window.history.back());
    },
    makeOrder(){
      let _trueprice = Math.round(this.billPrice/1.015);

      if ( this.billPrice - _trueprice < 50){
        _trueprice = (this.billPrice > 50) ? this.billPrice - 50 : this.billPrice;
      }

      cardService.createOrder({
        amount: +_trueprice,
        card: this.currentCardId,
        currency: 0,//0 - рубли
        lead_id: this.getPayment.leadId
      }).then((order)=>{
        this.$router.go(window.history.back());
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
        shop_id: this.getPayment.shopId
      })
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
    }
   
  }
}
//helpers
function getlastFour(string){
  return string.split('').slice(12,16).join('');
}
</script>
