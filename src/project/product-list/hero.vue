<style src='./styles/hero.pcss'></style>
<template lang="jade">
.section.smallHero(v-if='isAuth')
  .profile-header__menu
    .profile-header__menu-btn
      .profile-header__menu-btn-label
      .profile-header__menu-btn-icon(@click='menuOpened=!menuOpened')
        i(class='ic-info')
  .profile-header__menu-links(v-show='menuOpened', v-bind:class="{ '__normal': isAuth }")
    a(class='profile-header__menu-link profile-header__close-menu',
      @click='menuOpened=false') Отмена
    a(class='profile-header__menu-link',
      v-link='{name: "info-user"}') Покупателям
    a(class='profile-header__menu-link',
      v-link='{name: "info-shop"}') Магазинам
    a(class='profile-header__menu-link',
      @click="onBuyPromoProduct()") Блогерам
    a(class='profile-header__menu-link',
      v-link='{name: "info-mission"}') Наша миссия
    a(class='profile-header__menu-link',
      v-link='{name: "info-agreement"}') Условия
  a(v-link='{ name: "info-user" }')
    i.smallHero__logo
      img(src='../../base/img/logo-beta.png')

.section.hero(v-if='!isAuth')
  .section__content.hero__content
    .profile-header
      .profile-header__menu
        .profile-header__menu-btn
          .profile-header__menu-btn-label
          .profile-header__menu-btn-icon(@click='menuOpened=true')
            i(class='ic-info')
        .profile-header__menu-links(v-show='menuOpened')
          a(class='profile-header__menu-link profile-header__close-menu',
           @click='menuOpened=false') Отмена
          a(class='profile-header__menu-link',
           v-link='{name: "info-user"}') Покупателям
          a(class='profile-header__menu-link',
            v-link='{name: "info-shop"}') Магазинам
          a(class='profile-header__menu-link',
            @click="onBuyPromoProduct()") Блогерам
          a(class='profile-header__menu-link',
            v-link='{name: "info-mission"}') Наша миссия
          a(class='profile-header__menu-link',
            v-link='{name: "info-agreement"}') Условия
      .profile-header__center
        a(href='https://www.fb.com/trendevercom', class='profile-header__center__ic')
          i(class='ic-facebook-icon')
        a(href='https://www.instagram.com/trendevercom', class='profile-header__center__ic')
          i(class='ic-instagram-new-icon')
        a(href='https://vk.com/trendever', class='profile-header__center__ic')
          i(class='ic-vkontakte-icon')
    .hero__content__logo
    .hero__content__description Шопинг в Instagram стал проще
      span(@click='scrollAnchor()').scroll-to-anchor
</template>

<script type='text/babel'>
import listener from 'event-listener'
import settings from 'settings'
import { setCallbackOnSuccessAuth } from 'vuex/actions'
import { createLead } from 'vuex/actions/lead'
import { isAuth } from 'vuex/getters/user.js'
import * as leads from 'services/leads'

export default {
  data(){
    return {
      menuOpened: false,
      isStandalone: browser.standalone
    }
  },

  ready() {
    this.scrollCnt = document.querySelector( '.scroll-cnt' );
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
        this.setCallbackOnSuccessAuth( this.onBuyPromoProduct.bind( this ) )

      } else {

        this.createLead( settings.promoProductID )
            .then(
              ( lead ) => {
                if ( lead !== undefined && lead !== null ) {
                  this.$router.go( { name: 'chat', params: { id: lead.id } } );
                }
              }
            );

      }
    },

    scrollAnchor() {
      var block = document.querySelector( "#how-it-work" );
      if ( block !== null ) {
        var scrollBlock = this.scrollCnt;

        if ( !timer ) {
          var timer = setInterval( function() {
            if ( block.getBoundingClientRect().top < 80 ) {
              clearInterval( timer );
            }
            scrollBlock.scrollTop = scrollBlock.scrollTop + 30;
          }, 20 );
        }
      }
    }
  },
};
</script>
