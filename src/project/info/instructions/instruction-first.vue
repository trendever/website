<style src="./style.pcss"></style>
<template lang="jade">
.instruction
 a(@click="close").close
  i.ic-close
 .instruction__header
  p Добавь товары #[br] на свою витрину в Trendever
 .instruction__sub-header Просто напиши:
 .instruction__bold-title Покупай по комментарию @wantit
 .instruction__txt в описании своих постов в Instagram #[br] и они попадут на твою новую витрину
 .instruction__screen
  img(src="./img/screen-1.png")
 .instruction__txt Также твои товары можно будет #[br] покупать прямо из Instagram #[br] по комментарию
  span.want  @wantit
 .instruction__continue-btn
  button(v-link='{ name: "info-instructions-2" }') ЧТО ДАЛЬШЕ?
</template>

<script>
export default {
  data () {
    return {}
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
