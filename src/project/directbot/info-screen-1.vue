<style src="./styles/info-screen.pcss"></style>
<template lang="jade">
.info-screen
  i.ic-close(@click='closePage', v-if="isMobile")
  p.description.1 Наш опытный оператор, вооружившись Directbot-ом, обслужит всех ваших клиентов быстро и в #[br(v-if="isMobile")] любое время дня и ночи. #[br(v-if="isMobile")] Он вежливо поговорит #[br(v-if="isMobile")] с покупателем прямо #[br(v-if="isMobile")] в Instagram Direct, #[br(v-if="isMobile")] как консультант от #[br(v-if="isMobile")] имени вашего магазина. #[br(v-if="isMobile")] Вы не тратите время #[br(v-if="isMobile")] на клиентов, которые #[br(v-if="isMobile")] не покупают
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
