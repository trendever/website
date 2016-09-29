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
     .section.top__header Хочешь быть успешним в Instagram?
     .section.top__logo
     .section.top__info-block
      .section.top__info-block__title Преврати свой Instagram в настоящий магазин
      .section.top__info-block__paragraph Скачай приложение Trendever и оно #[br] мгновенно интегрируется с твоим #[br.break_2] Instagram
      .section.top__info-block__paragraph Теперь, стоит клиенту написать #[br.break_3] 
       span.want @wantit #[br.break_4] 
       span в комментариях под твоим #[br.break_5] постом, в приложении Trendever #[br.break_6] появится #[br.break_7] шопинг-чат с ним
      .section.top__info-block__slide
      .section.top__info-block__title.get Общайся и получай деньги в чате
      .section.top__info-block__advant-box
      .section.top__info-block__slide-2
      .section.top__info-block__title Заказывай фото #[br] и рекламу у блогеров
      .section.top__info-block__paragraph Проверенные блогеры #[br] сфотографируют и покажут #[br] твой товар своей аудитории
      .section.top__info-block__paragraph Вечная проблема нехватки трендовых и виральных фоток для ленты решена;)
      .section.top__info-block__slide-3
      .section.top__info-block__title.cost Оплачивай #[br] услуги Trendever, #[br] как выгоднее тебе
      .section.top__info-block__prices-block
       .section.top__info-block__prices-block__box
        .section.top__info-block__prices-block__box__price 5.5
         i.percent %
         span  за сделку #[br]
         span или #[br]
         span 1 990
         i.ic-currency-rub
         span  в месяц
      .section.top__info-block__desc Первый месяц бесплатно  
      .section.top__info-block__title.how-sell Как начать продавать?
      .section.top__info-block__sub-title Выполни 3 простых шага:
      .section.top__info-block__list-title 1. Cкачай приложение
      .section.top__info-block__list-description.download Не важно какой телефон у тебя или твоих клиентов, Trendever доступен на iPhone и Android устройствах
       .section.top__info-block__list-description.download-btns
        a(href="#").app_store
        a(href="#").g_play
      .section.top__info-block__list-title 2. Расскажи клиентам
      .section.top__info-block__list-description.add-goods Добавь текст в профиль #[br] своего Instagram: #[br]
        .wantit Напиши  
         span.want @wantit 
         span и товар #[br] попадет в шопинг- #[br]приложение по ссылке ниже
        span Укажи в профиле ссылку #[br] на свою витрину в Trendever
      .section.top__info-block__add-goods-slide
      .section.top__info-block__list-title 3. Добавляй описание #[br] 
       span.padding к товарам
      .section.top__info-block__list-description.tell-clients При размещении #[br] новых товаров в Instagram, #[br] напиши в начале описания:
        .wantit2 Покупай по комментарию #[br]
         span.want @wantit
        span Кстати, товар с 
         span.want @wantit #[br] 
         span в описании попадет в твой #[br] Trendever
      .section.top__info-block__tell-clients-slide
      .section.top__info-block__desc.done Готово! #[br] Принимай заказы #[br] в одном приложении #[br] и получи доступ к клиентам #[br] всех Instagram-магазинов
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
      HeaderComponent,
      RightNavComponent
    }

  }
</script>
