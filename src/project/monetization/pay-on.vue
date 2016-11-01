<style src='./pay-on.pcss'></style>
<template lang="jade">
.payment.pay-on
  a(href='#').close
    i.ic-close
  .bottom-margin
    .payment-wrapper
      .payment-head Оплата подписки
      span.transaction Cумма в месяц
      .payment-result
        | 1990
        i.ic-rub

      .check-card
        .check-card-text Выберите карту,#[br]  с которой будут списаны деньги
        .check-card-select-wrap
          i.ic-check-card
            img(src="icons/new-card.png")
          select.check-card-select
            option Новая карта
            option Новая карта 2
        .check-card-input-wrap.card-number
            .check-card-input.card
              i.ic-user-navbar
                img(src='icons/card-number.png')
              input(name='name' placeholder='Номер карты' type='text').name
        .check-card-input-wrap
          .check-card-input.info
            i.ic-card-new
              img(src="icons/card_2.png")
            input(name='date' placeholder='MM   /   YY' type='text').date
            input(name='cvc' placeholder='CVC' type='text').cvc
        .check-card-input-wrap.user-name
            .check-card-input
              i.ic-user-navbar
                img(src='icons/person.png')
              input(name='name' placeholder='Имя и фамилия как на карте' type='text').name


      p.payment-note Оплата осуществляется #[br] через платежный сервис Payture.ru #[br] Данные защищены
      img.payment-image(src="./img/payment-image.png")

  .btn-container
    button.btn.btn_primary.__orange.__xl.fast__big__btn.btn_fixed-bottom Оплатить
</template>
<script>
    export default{

    }
</script>
