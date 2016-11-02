<style src="./styles/info-screen.pcss"></style>
<style>
  p.description.4{
    padding-top: 280px;
  }
</style>
<template lang="jade">
.info-screen
  i.ic-close(@click='closePage')
  p.description.4 Да, вы не ослышались, Directbot #[br] умеет создавать интернет- #[br] магазины и наполнять их #[br] товарами из вашего Instagram. #[br] Поможет поддерживать #[br] ассортимент актуальным, просто #[br] задавая вам вопросы в чате. #[br] А еще, в этом онлайн-магазине, #[br] вы сможете принимать оплату
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
