<style src="./style.pcss"></style>
<template lang="jade">
.instruction
 a(@click="close").close
  i.ic-close
 .instruction__header
  p Укажи в Instagram ссылку #[br] на свою витрину
 .instruction__sub-header Вот короткая ссылка:
 .instruction__bold-title {{authUser.name}}.tndvr.com
 .instruction__txt на твою витрину товаров #[br] в приложении и на сайте Trendever
 .instruction__screen
  img(src="./img/screen-2.png")
 .instruction__txt Нажми на кнопку ниже и ссылка #[br] на витрину скопируется для вставки #[br] в твой Instagram-профиль
 .instruction__continue-btn
  button
   a(href="instagram://profile", target="_blank") ПЕРЕЙТИ В INSTAGRAM
</template>

<script>
export default {
  data () {
    return {
      authUser: this.$store.state.user.all[this.$store.state.user.myId]
    }
  },
  computed: {},
  mounted () {},
  methods: {
    close(){
      this.$router.go(window.history.back());
    },
  },
  components: {}
}
</script>
