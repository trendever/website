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
  .wrap-instruction-img
    first-img(:username="getAuthUser.name")
 .instruction__txt Также твои товары можно будет #[br] покупать прямо из Instagram #[br] по комментарию
  span.want  @wantit
 .instruction__continue-btn
  button(v-link='{ name: "info-instructions-2" }') ЧТО ДАЛЬШЕ?
</template>

<script>
import FirstImg from './components/first-img';
import { getAuthUser } from 'vuex/getters/user';
export default {
  vuex: {
    getters: {
      getAuthUser
    }
  },
  components:{
    FirstImg
  },
  data () {
    return {}
  },
  computed: {},
  mounted () {},
  methods: {
    close(){
      this.$router.go(window.history.back());
    },
  }
}
</script>
