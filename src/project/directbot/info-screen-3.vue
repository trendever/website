<style src="./styles/info-screen.pcss"></style>
<template lang="jade">
.info-screen
  i.ic-close(@click='closePage', v-if="isMobile")
  p.description.third Мы знаем как много сейчас разных #[br(v-if="!isMobile")] CRM для управления продажами. #[br(v-if="!isMobile")] Бот хорош тем, #[br(v-if="isMobile")] что работает #[br(v-if="!isMobile")] на вас, а не вы #[br(v-if="isMobile")] в нем. #[br(v-if="!isMobile")] Нужно просто нажать #[br(v-if="isMobile")] на кнопку, #[br(v-if="!isMobile")] а не разбираться #[br(v-if="isMobile")] в новых #[br(v-if="!isMobile")] приложениях #[br(v-if="isMobile")] и программах
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
