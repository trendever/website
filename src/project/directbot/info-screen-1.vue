<style src="./styles/info-screen.pcss"></style>
<template lang="jade">
.info-screen
  i.ic-close(@click='closePage', v-if="isMobile")
  p.description.1 Directbot, как самый #[br(v-if="isMobile")] ответственный продавец, #[br(v-if="isMobile")] всегда на чеку для ваших #[br] клиентов в Instagram и может #[br(v-if="isMobile")] многое. Он вежливо поговорит #[br(v-if="isMobile")] с покупателем прямо в Instagram Direct, как #[br(v-if="!isMobile")] бот-консультант. #[br(v-if="isMobile")] Вы не тратите время на #[br(v-if="isMobile")] клиентов, которые #[br] не покупают
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
