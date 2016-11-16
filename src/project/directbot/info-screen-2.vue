<style src="./styles/info-screen.pcss"></style>
<template lang="jade">
.info-screen
  i.ic-close(@click='closePage', v-if="isMobile")
  p.description Узнает для вас телефон покупателя, отправит ему #[br(v-if="isMobile")] ссылку на ваш сайт #[br(v-if="!isMobile")] и товар. #[br(v-if="isMobile")] Потом узнает размеры, #[br(v-if="!isMobile")] сверит #[br(v-if="isMobile")] с наличием. Спросит адрес #[br] доставки или запишет в шоу-рум. #[br] Клиент доволен быстрой #[br(v-if="isMobile")] реакцией, #[br(v-if="!isMobile")] а у вас останется #[br(v-if="isMobile")] больше времени #[br(v-if="!isMobile")] на личное #[br(v-if="isMobile")] общение
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
