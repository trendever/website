<style src="./style.pcss"></style>
<template lang="jade">
 .monetization

  i.ic-close(@click='closePage', v-if="getUseDays")
  .monetization__days-to-end(:class="{is__end: getUseDays === 0}") {{ getUseDays }}
  .monetization__text
    | дней осталось до конца #[br.first-br] пробного периода
  .monetization__text.bot
    | Выбери, как тебе выгоднее #[br.second-br] оплачивать услуги Trendever
  .monetization__btn(@click="dealType = 'month-type'")
   button(:class="{make__choice: dealType === 'month-type'}") 1990 В МЕСЯЦ
  .monetization__i.ic-monetization-icon
  .monetization__btn(@click="dealType = 'percent-type'")
   button(:class="{make__choice: dealType === 'percent-type'}") 5.5% ЗА СДЕЛКУ
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

      this.$router.push({name: 'home'})
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
