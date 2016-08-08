<style src="./style.pcss"></style>
<template lang="jade">
.subscribe
  a(href='#').subscribe-close
   i.ic-close
  .subscribe-wrapper
   .subscribe-head Вы на тестовом сайте
   .subscribe-note ...и бывают баги, о которых пишите пжл на hello@trendever.com &#128549 #[br]#[br]Хотите помочь сделать шопинг в инсте таким же удобным как в магазине? Тогда оставьте свой email – no spam &#128567
   .subscribe-input-wrapper
    i.subscribe-ic-mail
     img(src="icons/subscribe-mail.png")
    input(type="text" placeholder="Введите email...").subscribe-input
   .btn-container
    a(href="#").subscribe-not-now Не сейчас
    button.btn.btn_primary.__orange.__xl.fast__big__btn.btn_fixed-bottom Поддержать

</template>




<script>
    export default{

    }
</script>




<!--  -->