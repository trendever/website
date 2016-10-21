<style src="./style.pcss"></style>
<template lang="jade">
.instruction
 a(@click="close").close
  i.ic-close
 .instruction__header
  p Укажи в Instagram ссылку #[br] на свою витрину
 .instruction__sub-header Вот короткая ссылка:
 .instruction__bold-title(v-el:title) {{authUser.name}}.tndvr.com
 .instruction__txt на твою витрину товаров #[br] в приложении и на сайте Trendever
 .instruction__screen
  img(src="./img/screen-2.png")
 .instruction__txt Нажми на кнопку ниже и ссылка #[br] на витрину скопируется для вставки #[br] в твой Instagram-профиль
 .instruction__continue-btn
  button(@click="goInstgram").copy-trigger
    a ПЕРЕЙТИ В INSTAGRAM
   //-a(href="instagram://profile", target="_blank") ПЕРЕЙТИ В INSTAGRAM
</template>

<script>
import clipboard from 'clipboard';
export default {
  data () {
    return {
      authUser: this.$store.state.user.all[this.$store.state.user.myId],
      copyError: false
    }
  },
  computed: {},
  ready () {
    let self = this;
    self.copy =  new clipboard('.copy-trigger',{
        text(trigger){
          return self.$els.title.textContent;
        }
      })
      self.copy.on('success',()=>{
        window.location = 'https://www.instagram.com/' + this.authUser.name;
      })

      self.copy.on('error', () =>{
        alert('К сожалению скопировать в буфер не удалось. Сделайте это вручную');
        copyError = true;
        self.copy.destroy();
        self.copy = false;
      });

  },
  methods: {
    goInstgram(){
      console.log(this.copy);
      if(this.copyError || this.copy){
        return;
      }
      window.location = 'https://www.instagram.com/' + this.authUser.name;
    },
    close(){
      this.$router.go(window.history.back());
    },
  },
  components: {}
}
</script>
