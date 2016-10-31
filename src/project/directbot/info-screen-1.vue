<style src="./styles/info-screen.pcss"></style>
<template lang="jade">
.info-screen
  i.ic-close(@click='closePage')
  img(src="./img/info-screen.svg")
  p.description Directbot, как самый ответственный продавец, всегда на чеку для ваших клиентов в Instagram и может многое. Он вежливо поговорит с покупателем прямо в Instagram Direct, как бот-консультант. Вы не тратите время на клиентов, которые не покупают
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
