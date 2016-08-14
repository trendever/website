<style src="./style.pcss"></style>
<template lang="jade">
.subscribe
  a(href='#').subscribe-close
   i.ic-close(@click="exitSubscribe")
  .subscribe-wrapper
   .subscribe-head Вы на тестовом сайте
   .subscribe-note ...и бывают баги, о которых пишите пжл на hello@trendever.com &#128549 #[br]#[br]Хотите помочь сделать шопинг в инсте таким же удобным как в магазине? Тогда оставьте свой email – no spam &#128567
   .subscribe-input-wrapper
    i.subscribe-ic-mail
     img(src="icons/subscribe-mail.png")
    input(type="email" placeholder="Введите email..." v-model="email").subscribe-input
   .btn-container
    a(@click.prevent="exitSubscribe").subscribe-not-now Не сейчас
    button.btn.btn_primary.__orange.__xl.fast__big__btn.btn_fixed-bottom(@click="subscribe") Поддержать

</template>




<script>
import {setEmail} from 'services/user';
export default{
  data(){
    return {
      email: ''
    }
  },
  methods:{
    exitSubscribe(){
      if(window.history.length > 2){
          window.history.back();
      } else {
        this.$router.go({name: 'home'});
      }
    },
    subscribe(){
      setEmail(this.email).then((success)=>{
        console.log(success);
        if(!success){
          alert('ошибка');
          return;
        }
        alert('Спасибо');
        this.$router.go({name: 'home'});
      })
    }
  }
}
</script>




<!--  -->