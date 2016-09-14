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
      .section.top__info-block__title Преврати свой Instagram #[br] в удобный магазин
      .section.top__info-block__paragraph Скачай приложение Trendever и оно #[br] мгновенно интегрируется с твоим #[br] Instagram
      .section.top__info-block__paragraph Теперь, стоит клиенту написать #[br] @wantit в комментариях под твоим #[br] постом, в твоем Trendever появится #[br] шопинг-чат с ним
      .section.top__info-block__slide
       .section.top__info-block__slide__comment ВСЕГО 1 #[br]КОММЕНТАРИЙ #[br] ДЛЯ ЗАКАЗА
      .section.top__info-block__title Общайся и получай деньги в чате
      .section.top__info-block__advant-box
       span.orders Согласовывай заказы,
       span.money принимай #[br] деньги и
       span.delivery назначай доставку #[br] во встроенном чате Trendever.
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
