<style src="./styles/info-screen.pcss"></style>
<template lang="jade">
.info-screen
  i.ic-close(@click='closePage', v-if="isMobile")
  p.description.second Узнает для вас телефон покупателя, отправит ему ссылку на ваш сайт #[br(v-if="isMobile")] и товар. Потом узнает размеры, сверит #[br(v-if="isMobile")] с наличием. Спросит адрес доставки или запишет #[br(v-if="isMobile")] в шоу-рум. Клиент доволен быстрой реакцией, а у вас останется больше времени #[br(v-if="isMobile")] на личное общение
</template>

<script>
export default {
  data () {
    return {
      isMobile: window.browser.mobile
    }
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
