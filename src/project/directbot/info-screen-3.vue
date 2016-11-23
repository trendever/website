<style src="./styles/info-screen.pcss"></style>
<template lang="jade">
.info-screen
  i.ic-close(@click='closePage', v-if="isMobile")
  p.description.third Мы знаем как много сейчас разных CRM для управления продажами. Наш сервис #[br(v-if="isMobile")] хорош тем, что работает #[br(v-if="isMobile")] на вас, а не вы в нем. Нужно просто нажать на кнопку, #[br(v-if="isMobile")] а не разбираться в новых приложениях и программах
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
