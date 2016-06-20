<style src='./footer.pcss'></style>
<template lang="jade">
footer.section.footer
  .section__content.footer__content
    .footer__content__links
      a.footer__content__link.link(
        @click="onBuyPromoProduct()") Блогерам
      a.footer__content__link.link(
        v-link='{name: "info-user"}') Покупателям
      a.footer__content__link.link(
        @click="onBuyPromoProduct()") Магазинам
      a.footer__content__link.link(
        v-link='{name: "info-agreement"}') Условия

    .footer__content__copyright © Trendever {{ year }}
      .footer__content__img
</template>

<script>
import settings from 'settings'
import { setCallbackOnSuccessAuth } from 'vuex/actions';
import { createLead } from 'vuex/actions/lead';
import { isAuth } from 'vuex/getters/user.js';
import * as leads from 'services/leads';

export default {
  computed: {
    year() {
      return new Date().getFullYear()
    },
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

  methods: {
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
  }
}
</script>
