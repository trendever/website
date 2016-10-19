<style src="./style.pcss"></style>
<template lang="jade">
 .monetization
  i.ic-close(@click='closePage')
  .monetization__days-to-end 7
  .monetization__text дней осталось до конца #[br] пробного периода
  .monetization__text.bot Выбери, как тебе выгоднее #[br] оплачивать услуги Trendever
  .monetization__btn
   button 1990 В МЕСЯЦ
  .monetization__i.ic-monetization-icon
  .monetization__btn
   button 5.5% ЗА СДЕЛКУ
  .monetization__accept-btn
   button ПОКА НЕ УВЕРЕН
</template>

<script>
export default {
  data () {
    return {}
  },
  computed: {},
  mounted () {},
  methods: {},
  components: {}
}
</script>
