<style src="./style.pcss"></style>
<template lang="jade">
.instruction
 a(v-on:click="close").close
  i.ic-close
 .instruction__header
  p Укажи в Instagram ссылку #[br] на свою витрину
 .instruction__sub-header Вот короткая ссылка:
 .instruction__bold-title(v-el:title) {{getAuthUser.name}}.tndvr.com
 .instruction__txt на твою витрину товаров #[br] в приложении и на сайте Trendever
 .instruction__screen
  img(src="./img/screen-2.png")
  //-.wrap-instruction-img
    second-img(:username="getAuthUser.name")
 .instruction__txt Нажми на кнопку ниже и ссылка #[br] на витрину скопируется для вставки #[br] в твой Instagram-профиль
 .instruction__continue-btn
  button(v-on:click="goInstgram").copy-trigger
    a ПЕРЕЙТИ В INSTAGRAM
   //-a(href="instagram://profile", target="_blank") ПЕРЕЙТИ В INSTAGRAM
</template>

<script>

import { getAuthUser } from 'vuex/getters/user';
import clipboard from 'clipboard';
//import secondImg from './components/second-img';
export default {
  vuex:{
    getters:{
      getAuthUser
    }
  },
  data () {
    return {
      copyError: false
    }
  },

  ready () {

    let self = this;
    self.copy =  new clipboard('.copy-trigger',{
        text(trigger){
          return self.$els.title.textContent;
        }
      })
      self.copy.on('success',()=>{
        alert('Ссылка username.tndvr.com скопирована. Сейчас откроется ваш Instagram профиль и вы сможете ее вставить.');

        //window.location = 'https://www.instagram.com/' + this.getAuthUser.name;
        this.navigate('https://www.instagram.com/' + this.getAuthUser.name, true);
        this.$router.go({name: 'profile'})

      })

      self.copy.on('error', () =>{
        alert('К сожалению скопировать в буфер не удалось. Сделайте это вручную');
        self.copyError = true;
        self.copy.destroy();
        self.copy = false;
      });

  },
  methods: {
    goInstgram(){
      console.log(this.copy);
      if(this.copy || !this.copyError){
        return;
      }
      //window.location = 'https://www.instagram.com/' + this.getAuthUser.name;
      this.navigate('https://www.instagram.com/' + this.getAuthUser.name, true);
      this.$router.go({name: 'profile'})
    },
    close(){
      this.$router.go(window.history.back());
    },
    navigate(href, newTab) {
       let a = document.createElement('a');
       a.href = href;
       if (newTab) {
          a.setAttribute('target', '_blank');
       }
       a.click();
    }
  },


  components: {
    //secondImg
  }
}
</script>
