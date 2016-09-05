<style src='./styles/hero.pcss'></style>
<template lang="jade">
.header__menu__overlay(v-show='menuOpened', @click='menuOpened=false', :class="{'color-green': !isAuth, 'color-black': isAuth}")

.section.smallHero(v-if='isAuth')
  .profile-header__menu
    .profile-header__menu-btn
      .profile-header__menu-btn-label
      .profile-header__menu-btn-icon(v-if="!getComeBack", @click='menuOpened=!menuOpened')
        i(class='ic-info')
      .profile-header__menu-btn-icon(v-if="getComeBack", @click='goBack')
        i(class='ic-arrow-left')
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
    a(class='profile-header__menu-link', @click="logout") Выход
  a(v-link='{ name: "info-user" }')
    i.smallHero__logo
      img(src='../../base/img/logo-main.svg')

.section.hero(v-if='!isAuth')
  .profile-header__menu(v-if='isAuth')
    .profile-header__menu-btn
    .profile-header__menu-btn-label
      .profile-header__menu-btn-icon(@click='menuOpened=true')
        i(class='ic-info')

  .profile-header__menu-links(v-show='menuOpened', v-if='!isAuth')
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

  .section__content.hero__content
    .profile-header
      .profile-header__center
      button(v-link='{ name: "info-shop" }').profile-header__sellers-btn МАГАЗИНАМ И БРЕНДАМ
      button(v-link='{ name: "signup" }').profile-header__auth-btn ВХОД И РЕГИСТРАЦИЯ
      .profile-header__mobile-slider
       .profile-header__mobile-slider-slide
        slider
        //.hero__content__logo
        //img(src="img/blue_slide.jpg")
    .hero__content__description Шопинг в Instagram стал проще!
     //span.hero__content__description.scroll-to-anchor
    .hero__content__footer
     a(href='https://www.fb.com/trendevercom', class='fb' target="_blank")
      i(class='ic-fb social')
     a(href='https://www.instagram.com/trendevercom', class='insta' target="_blank")
      i(class='ic-insta social')
     a(href='https://vk.com/trendever', class='vk' target="_blank")
      i(class='ic-vk social')
     .hero__content__input-wrap
      label Приложение для шопинга в Instagram
      input(type="text" placeholder="Номер телефона")
      button.hero__content__get-link ПОЛУЧИТЬ ССЫЛКУ
     .hero__content__dwnld-btns
      a(href="#", class="app_store")
       i(class="ic-appstore")
      a(href="#", class="g_play")
       i(class="ic-google_play")      
</template>

<script type='text/babel'>
import listener from 'event-listener'
import settings from 'settings'
import { setCallbackOnSuccessAuth } from 'vuex/actions'
import { createLead } from 'vuex/actions/lead'
import { isAuth } from 'vuex/getters/user.js'
import { logOut } from 'vuex/actions/user.js'
import { getComeBack } from 'vuex/getters/products.js'
import * as leads from 'services/leads'
import Slider from './slider.vue';

export default {
  data(){
    return {
      menuOpened: false,
      isStandalone: browser.standalone
    }
  },

  components :{
    Slider
  },

  ready() {
    this.scrollCnt = document.querySelector( '.scroll-cnt' );
  },

  vuex: {
    getters: {
      isAuth,
      getComeBack
    },
    actions: {
      logOut,
      createLead,
      setCallbackOnSuccessAuth,
    }
  },

  methods: {
    logout(){

      this.$set('menuOpened', false);
      this.logOut();

    },
    goBack(){
      window.history.back();
    },
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
