<style src="./style.pcss"></style>
<template lang="jade">
scroll-component
  .section__content
    .section.header
      .section__content.header__content.u-fixed
        .wrapper
          .header__arrow(v-if='!isAuth', @click='goBack()')
            i.header__arrow__ic.ic-arrow-left
          .header__logo
            a(v-link='{ name: "home" }', v-if="!isMobile")
              img(src='../../../base/img/logo-main.svg' alt='')
          .header__title Брендам
          right-nav-component(current="feed", v-if="!isMobile")

    .section.top
     .section.top__header(:class="{'header_app': isStandalone}") Хочешь быть успешным в Instagram?
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
      .section.top__info-block__desc Первый месяц бесплатно  
      .section.top__info-block__title.how-sell Как начать продавать?
      .section.top__info-block__sub-title Выполни 3 простых шага:
      .section.top__info-block__list-title 1. Cкачай приложение
      .section.top__info-block__list-description.download Не важно какой телефон у тебя или твоих клиентов, #[br.break_mob]Trendever доступен на iPhone и Android устройствах
       .section.top__info-block__list-description.download-btns
        a(href="#").app_store
        a(href="#").g_play
      .section.top__info-block__list-title 2. Расскажи клиентам
      .section.top__info-block__list-description.add-goods Добавь текст в профиль #[br.break_desk.mob] своего Instagram: #[br]
        .wantit Напиши  
         span.want @wantit 
         span и товар #[br.break_desk.mob] попадет #[br.break_mob] в шопинг- #[br.break_desk.mob]приложение по ссылке ниже #[br.break_mob] 
        span.block Укажи в профиле ссылку #[br.break_desk] на свою витрину #[br.break_mob] в Trendever
      .section.top__info-block__add-goods-slide
      .section.top__info-block__list-title 3. Добавляй описание #[br.break_desk.mob] 
       span.padding к товарам
      .section.top__info-block__list-description.tell-clients При размещении #[br.break_desk.mob] новых товаров в Instagram, #[br] напиши в начале описания:
        .wantit2 Покупай по комментарию #[br]
         span.want @wantit #[br]
        span Товар с 
         span.want @wantit 
         span в описании #[br.break_desk.mob] попадает #[br.break_mob] в твою Trendever-витрину и виден всем
      .section.top__info-block__tell-clients-slide
      .section.top__info-block__desc.done Готово! #[br] Принимай заказы #[br.break_desk.mob] в одном приложении #[br] и получи доступ к клиентам #[br.break_desk.mob] всех Instagram-магазинов
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
  import RightNavComponent from 'base/right-nav/index';

  export default {
    data(){
      return {
        isStandalone: browser.standalone
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
      },
      isStandalone(){
        //alert(navigator.standalone)
        return browser.standalone
        //return navigator.standalone
      },

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
      isStandalone(){
      return browser.standalone
    }
    },

    components: {
      ScrollComponent,
      HeaderComponent,
      RightNavComponent
    }

  }
</script>
