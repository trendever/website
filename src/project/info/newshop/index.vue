<style src="./style.pcss"></style>
<template lang="jade">
scroll-component
  .section__content
    .section.header
      .section__content.header__content.u-fixed
        .header__arrow(v-if='!isAuth', @click='goBack()')
          i.header__arrow__ic.ic-arrow-left
        .header__title Брендам

    .section.top
     .section.top__header Хочешь быть успешним в Instagram?
     .section.top__logo
     .section.top__info-block
      .section.top__info-block__title Преврати #[br.break_1] свой Instagram #[br] в удобный магазин
      .section.top__info-block__paragraph Скачай приложение Trendever и оно #[br] мгновенно интегрируется с твоим #[br.break_2] Instagram
      .section.top__info-block__paragraph Теперь, стоит клиенту написать #[br.break_3] @wantit #[br.break_4] в комментариях под твоим #[br.break_5] постом, в твоем Trendever #[br.break_6] появится #[br.break_7] шопинг-чат с ним
      .section.top__info-block__slide
      .section.top__info-block__title.get Общайся и получай деньги в чате
      .section.top__info-block__advant-box
       span.orders Согласовывай заказы,
       span.money принимай #[br] 
       span деньги и 
       span.delivery назначай доставку #[br] 
       span во встроенном чате Trendever.
      .section.top__info-block__slide-2
       .section.top__info-block__slide-2__comment-2
      .section.top__info-block__desc Деньги будут моментально #[br] зачислены на карту получателя
      .section.top__info-block__title Заказывай фото #[br] и рекламу у блогеров
      .section.top__info-block__paragraph Проверенные блогеры #[br] сфотографируют и покажут #[br] твой товар своей аудитории
      .section.top__info-block__paragraph Вечная проблема нехватки трендовых и виральных фоток для ленты решена ;)
      .section.top__info-block__slide-3
       .section.top__info-block__slide-3__comment-3
      .section.top__info-block__desc Найти блогера можно по кнопке #[br] в профиле своего магазина
      .section.top__info-block__title Сколько стоит твой #[br] магазин в Trendever?
      .section.top__info-block__paragraph Плати только за результат, #[br] а остальное бесплатно
      .section.top__info-block__paragraph Оплачивай услуги #[br] Trendever внутренней валютой - #[br]трендкоинами
        i.ic-trendcoin-grey 
        span .Коины можно #[br] получить или купить в магазине
        .section.top__info-block__paragraph__comment-4
      .section.top__info-block__prices-block
       .section.top__info-block__prices-block__box
        .section.top__info-block__prices-block__box__price 0
           i.ic-trendcoin-green
          .top__info-block__prices-block__box__description размещение #[br] на Trendever
       .section.top__info-block__prices-block__box
        .section.top__info-block__prices-block__box__price 0
           i.ic-trendcoin-green
          .top__info-block__prices-block__box__description помощь и #[br] сопровождение
       .section.top__info-block__prices-block__box
        .section.top__info-block__prices-block__box__price 0
           i.ic-trendcoin-green
          .top__info-block__prices-block__box__description интеграция #[br] с Instagram
       .section.top__info-block__prices-block__box
        .section.top__info-block__prices-block__box__price 3
           i.ic-trendcoin-green
          .top__info-block__prices-block__box__description чат с новым #[br] клиентом
       .section.top__info-block__prices-block__box
        .section.top__info-block__prices-block__box__price 5
         i.percent %
        .top__info-block__prices-block__box__description комиссия за #[br] успешную сделку
       .section.top__info-block__prices-block__box
        .section.top__info-block__prices-block__box__price 9
           i.ic-trendcoin-green
          .top__info-block__prices-block__box__description поиск #[br] блогера
      .section.top__info-block__desc.present Регистрируйся сейчас и получишь #[br] бонус - 
       span.bonus еще 30
        i.ic-trendcoin-green
       span.bonus на счет.
      .section.top__info-block__title Как начать продавать?
      .section.top__info-block__sub-title Выполни 3 простых шага:
      .section.top__info-block__list-title 1. Cкачай приложение
      .section.top__info-block__list-description.download Для регистрации укажи #[br] название своего Instagram - #[br] аккаунта и номер телефона
      .section.top__info-block__list-title 2. Добавь свои товары
      .section.top__info-block__list-description.add-goods Напиши @savetrend в описании #[br] или комментариях к фото своих #[br] товаров, чтобы они попали на #[br] твою витрину в Trendever
      .section.top__info-block__list-title 3. Расскажи клиентам
      .section.top__info-block__list-description.tell-clients Теперь твои товары можно #[br] купить, используя тег @wantit. Не забудь рассказать об этой #[br]возможности своим клиентам #[br] в описании фото или в профиле
      .section.top__info-block__download-btn 
       button(v-if="isMobile") СКАЧАТЬ ПРИЛОЖЕНИЕ

</template>
<script>
  import settings from 'settings'

  import ScrollComponent from 'base/scroll/scroll.vue'
  import HeaderComponent from 'base/header/header.vue';

  import { setCallbackOnSuccessAuth } from 'vuex/actions';
  import { createLead } from 'vuex/actions/lead';
  import { isAuth } from 'vuex/getters/user.js';
  import * as leads from 'services/leads';

  export default {
    data(){
      return {
      }
    },

    vuex: {
      getters: {
        isAuth,
      },
      actions: {
        createLead,
        setCallbackOnSuccessAuth,
      }
    },

    computed:{

      isMobile(){
        return window.browser.mobile;
      }

    },

    methods: {
      goBack(){
        history.back();
      },
      onBuyPromoProduct() {
        if ( !this.isAuth ) {

          this.$router.go( { name: 'signup' } );
          this.setCallbackOnSuccessAuth(this.onBuyPromoProduct.bind(this))

        } else {

          this.createLead( settings.promoProductID )
          .then(
            ( lead ) => {
              if (lead !== undefined && lead !== null){
                this.$router.go( { name: 'chat', params: { id: lead.id } } );
              }
            }
          );

        }
      },
    },

    components: {
      ScrollComponent,
      HeaderComponent
    }

  }
</script>
