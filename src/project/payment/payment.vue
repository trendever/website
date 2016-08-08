<style src='./style.pcss' scoped></style>
<template lang="jade">
.payment
  a(href='#').close
    i.ic-close
  .bottom-margin
    .payment-wrapper
      .payment-head Выставите счет на оплату
      .payment-summ
        .payment-summ-text Введите сумму к оплате
        .payment-summ-input-wrapper
          i.ic-rouble
          input(type='text' placeholder='0' value="0 ₽").payment-summ-input 
          //- span. &#x20bd

      .check-card
        .check-card-text Выберите карту, куда будут зачислены деньги
        .check-card-select-wrap
          i.ic-check-card
            img(src='icons/card_1.png').ic-card_1
          select.check-card-select
            option Новая карта
            option Новая карта 2
        .check-card-input-wrap
          i.ic-card-new
            img(src='icons/card_2.png')
          input(type='text' placeholder='0000 0000 0000 0000').check-card-input
      p.payment-note Деньги будут перечислены#[br]  прямо вам на карту с помощью#[br]  платежного сервиса Payture.ru

  .btn-container
    button.btn.btn_primary.__orange.__xl.fast__big__btn.btn_fixed-bottom Отправить
</template>
<script>
    export default{

    }
</script>
