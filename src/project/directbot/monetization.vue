<style src="./styles/monetization.pcss"></style>
<template lang="jade">
 .monetization

  i.ic-close(@click='closePage')
  .monetization__days-to-end(:class="{is__end: getUseDays === 0}") {{ getUseDays }} 3
  .monetization__text
    | дня осталось до конца #[br.first-br] пробного периода
  .monetization__text.bot
    | Выбери подходящий #[br] тарифный план
  .monetization__btn(@click="dealType = 'month-type'")
   button(:class="{make__choice: dealType === 'month-type'}")
     span.bold 1390
       i.ic-currency-rub
     span.bold  ЗА 7 ДНЕЙ #[br]
     span.light 5940
       i.ic-currency-rub
     span.light  ЦЕНА В МЕСЯЦ
  .monetization__btn(@click="dealType = 'percent-type'")
   button(:class="{make__choice: dealType === 'percent-type'}")
     span.bold 4990
       i.ic-currency-rub
     span.bold  ЗА 30 ДНЕЙ #[br]
     span.light САМЫЙ ПОПУЛЯРНЫЙ ТАРИФ
   .monetization__btn(@click="dealType = 'percent-type'")
    button(:class="{make__choice: dealType === 'percent-type'}")
      span.bold 8990
        i.ic-currency-rub
      span.bold  ЗА 90 ДНЕЙ #[br]
      span.light 2990
        i.ic-currency-rub
      span.light  ЦЕНА В МЕСЯЦ
  .monetization__accept-btn(:class="{ dark__yellow: getUseDays === 0 && !dealType}")

   button(v-if="getUseDays !== 0 && !dealType", @click="closePage") ПОКА НЕ УВЕРЕН
   button(v-if="getUseDays === 0 || dealType", @click="accept") ПОДТВЕРДИТЬ

</template>

<script>
import { getUseDays } from 'vuex/getters/user';
export default {
  data(){
    return {
      dealType: ''
    }
  },
  vuex: {
    getters: {
      getUseDays
    }
  },
  methods:{
    closePage(){
      if(window.history.length > 3){
        window.history.back();
        return;
      }
      this.$router.go({name: 'home'})
    },
    accept(){
      if(!this.dealType){
        return;
      }
      alert('Подтверждаю');
    }
  }
}
</script>
