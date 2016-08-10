<style src="./style.pcss"></style>
<template lang="jade">
.subscribe
  a(href='#').subscribe-close
   i.ic-close(@click="exitSubscribe")
  .subscribe-wrapper
   .subscribe-head Вы на тестовом сайте
   .subscribe-note ...и бывают баги, о которых мы #[br] просим писать на hello@trendever.com #[br]#[br]Хотите помочь сделать шопинг #[br] в инсте таким же удобным как #[br] в магазине? Тогда оставьте свой email #[br] – no spam 
   .subscribe-input-wrapper
   i.subscribe-ic-mail
    img(src="icons/subscribe-mail.png")
   input(type="text" placeholder="Введите email...").subscribe-input
   .btn-container
   button.btn.btn_primary.__orange.__xl.fast__big__btn.btn_fixed-bottom Уговорили 
   #[br]

   a(href="#").subscribe-not-now Не сейчас
</template>




<script>
export default{
  methods:{
    exitSubscribe(){
      if(window.history.length > 2){
          window.history.back();
      } else {
        this.$router.go({name: 'home'});
      }
    }
  }
}
</script>




<!--  -->