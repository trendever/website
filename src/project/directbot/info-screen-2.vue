<style src="./styles/info-screen.pcss"></style>
<template lang="jade">
.info-screen
  i.ic-close(@click='closePage')
  p.description Узнает для вас телефон покупателя, отправит ему #[br] ссылку на ваш сайт и товар. #[br] Потом узнает размеры, сверит #[br] с наличием. Спросит адрес #[br] доставки или запишет в шоу-рум. #[br] Клиент доволен быстрой #[br] реакцией, а у вас останется #[br] больше времени на личное #[br] общение
</template>

<script>
export default {
  data () {
    return {}
  },
  computed: {},
  mounted () {},
  methods: {
    closePage(){
      if(window.history.length > 3){
        window.history.back();
        return;
      }
      this.$router.go({name: 'home'})
    }
  },
  components: {}
}
</script>

<style lang="css">
</style>
