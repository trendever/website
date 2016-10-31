<style src="./styles/info-screen.pcss"></style>
<template lang="jade">
.info-screen
  i.ic-close(@click='closePage')
  img(src="./img/info-screen.svg")
  p.description Мы знаем как много сейчас разных CRM для управления продажами. Бот хорош тем, #[br] что работает на вас, а не вы #[br] в нем. Нужно просто нажать #[br] на кнопку, а не разбираться #[br] в новых приложениях #[br] и программах
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
