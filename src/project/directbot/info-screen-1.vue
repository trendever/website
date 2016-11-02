<style src="./styles/info-screen.pcss"></style>
<template lang="jade">
.info-screen
  i.ic-close(@click='closePage')
  p.description.1 Directbot, как самый #[br] ответственный продавец, #[br] всегда на чеку для ваших #[br] клиентов в Instagram и может #[br] многое. Он вежливо поговорит #[br] с покупателем прямо в Instagram Direct, как бот-консультант. #[br] Вы не тратите время на #[br] клиентов, которые #[br] не покупают
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
