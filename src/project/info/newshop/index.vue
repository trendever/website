<style src="./style.pcss"></style>
<template lang="jade">
scroll-component
  header-component(
    :title='"Брендам"',
    :center-text-link="centerTextLink",
    :page="info",
    :back-link='{name: "home"}',
    :show-desktop-arrow="false")
    right-nav-component(slot="content", current="")
  .section__content.infonewshops
    .section.top
     .section.top__header Ты инста-шоп? #[br(v-if="isMobile")] Готов стать #[br] интернет-магазином? #[br(v-if="isMobile")] и даже больше
     .section.top__header-small Trendever решает все проблемы #[br(v-if="isMobile")] Instagram-магазинов, под-ключ
     .section.top__header Наши преимущества
     .section.top__wrap
      .section.top__advantages.chats Шопинг-чат, куда #[br(v-if="!isMobile")] автоматичеcки #[br(v-if="isMobile")] попадают #[br(v-if="!isMobile")] заказы из Instagram
      .section.top__advantages.pay Онлайн-платежи #[br(v-if="!isMobile")] на карту, #[br(v-if="isMobile")] не выходя #[br(v-if="!isMobile")] из чата
      .section.top__advantages.grow Увеличение продаж #[br(v-if="!isMobile")] через #[br(v-if="isMobile")] рекламу #[br(v-if="!isMobile")] у блогеров
      .section.top__advantages.photos Создание стильных #[br(v-if="!isMobile")] фотографий #[br(v-if="isMobile")] для инста-#[br(v-if="!isMobile")]ленты через блогеров
      .section.top__advantages.shops Своя витрина внутри #[br(v-if="!isMobile")] сайта и аппа #[br(v-if="isMobile")] Trendever, #[br(v-if="!isMobile")] где все инста-шоперы
      .section.top__advantages.sellers Подключение и контроль #[br] за несколькими #[br(v-if="!isMobile")] продавцами
     .section.top.install
      p Прокачай свой инста-шоп за 5 мин #[br(v-if="isMobile")] - просто установи приложение!
     .section.top__more ПОДРОБНЕЕ
      img(src="./img/more.svg")
     .section.top__logo
     .section.top__info-block
      .section.top__info-block__title Преврати #[br.break_1] свой Instagram #[br.break_2] в настоящий магазин
      .section.top__info-block__paragraph Скачай приложение Trendever и оно #[br.break_desk] мгновенно #[br.break_mob]интегрируется с твоим #[br.break_desk] Instagram
      .section.top__info-block__paragraph Теперь, стоит клиенту написать #[br.break_desk]
       span.want @wantit #[br.break_mob]
       span в комментариях под твоим #[br.break_desk] постом, в приложении #[br.break_mob] Trendever #[br.break_desk] появится #[br.break_desk] шопинг-чат с ним
      .section.top__info-block__slide
      .section.top__info-block__title.get Общайся и получай деньги в чате
      .section.top__info-block__advant-box
      .section.top__info-block__slide-2
      .section.top__info-block__title.blog Заказывай фото #[br] и рекламу у блогеров
      .section.top__info-block__paragraph Проверенные блогеры #[br.break_desk] сфотографируют #[br.break_mob] и покажут #[br.break_desk.mob] твой товар своей аудитории
      .section.top__info-block__paragraph Вечная проблема нехватки трендовых #[br.break_mob] и виральных фоток для ленты решена;)
      .section.top__info-block__slide-3
      .section.top__info-block__title.cost Выбери, как тебе #[br.break_desk] выгоднее #[br.break_mob] оплачивать #[br.break_desk] услуги Trendever
      .section.top__info-block__prices-block
       .section.top__info-block__prices-block__box
        .section.top__info-block__prices-block__box__price 5.5
         i.percent %
         span  за сделку #[br.break_desk.mob]
         span или #[br.break_desk.mob]
         span 1 990
         i.ic-rub
         span   в месяц
      .section.top__info-block__desc Первые 7 дней бесплатно
    .section.top__header(v-if="!isMobile") Скачай приложение, #[br] чтобы начать продавать
    .section.top__header-small(v-if="!isMobile") Сначала зарегистрируйся в приложении #[br] и сможешь обслуживать заказы также на ноутбуке
    .section.top__bot-txt
      p * подробнее об остальных функциях #[br(v-if="isMobile")]
       span внутри приложения
    button(v-if="isAuth", v-link='{ name: "info-instructions-1" }').how-to-sell КАК НАЧАТЬ ПРОДАВАТЬ?
  fast-signup(v-if="!isAuth")
</template>
<style scoped>
  #lp{
    position: relative;
  }
</style>
<script>
  import settings from 'settings'

  import ScrollComponent from 'base/scroll/scroll.vue'
  import HeaderComponent from 'base/header/header.vue';

  import { setCallbackOnSuccessAuth } from 'vuex/actions';
  import { createLead } from 'vuex/actions/lead';
  import { isAuth } from 'vuex/getters/user.js';
  import * as leads from 'services/leads';
  import RightNavComponent from 'base/right-nav/index';
  import FastSignup from 'base/auth-popup/fast-signup';

  export default {
    data(){
      return {}
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
      },
      isStandalone(){
        return true;
        return browser.standalone
      },
    },

    methods: {
      dlapp(){
        window.location = "https://itunes.apple.com/ru/app/trendever/id1124212231";
      },
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
      }
    },

    components: {
      FastSignup,
      ScrollComponent,
      HeaderComponent,
      RightNavComponent
    }

  }
</script>
