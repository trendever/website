<style src='./styles/hero.pcss'></style>
<template lang="jade">
#product-list-hero
  .header__menu__overlay(v-show='menuOpened && isMobile', v-on:click='menuOpened=false', :class="{'color-green': !isAuth, 'color-black': isAuth}")

  .section.smallHero(v-if='isAuth', :class="{ 'header-glued': !isMobile }")

    .input__container(v-if="!isMobile")
      i.ic-search(v-on:click="openInput")
      input(
        ref="input",
        v-on:keyup='search()',
        :value='searchValue',
        type='text',
        placeholder='Ищи текстом или жми теги...',
        v-if="inputOpened || searchValue")

    .profile-header__menu
      .profile-header__menu-btn
        .profile-header__menu-btn-label
        .profile-header__menu-btn-icon(v-if="!getComeBack", v-on:click.stop='menuOpened=!menuOpened')
          i(class='ic-info')
        .profile-header__menu-btn-icon(v-if="getComeBack", v-on:click='goBack')
          i(class='ic-arrow-left')
    .profile-header__menu-links(v-show='menuOpened', v-bind:class="{ '__normal': isAuth, '__desktop': !isMobile }")
      a(class='profile-header__menu-link profile-header__close-menu first',
        v-on:click='menuOpened=false') Отмена
      router-link(class='profile-header__menu-link',
        to='{name: "info-user"}') Покупателям
      router-link(class='profile-header__menu-link',
        to='{name: "info-newshop"}') Магазинам
      router-link(class='profile-header__menu-link',
        v-on:click="onBuyPromoProduct()") Блогерам
      router-link(class='profile-header__menu-link',
        to='{name: "info-mission"}') Наша миссия
      router-link(class='profile-header__menu-link',
        to='{name: "info-agreement"}') Условия
      router-link(class='profile-header__menu-link',
        href="https://trendever.payture.com/",
        target="_blank") Денежный перевод
      a(class='profile-header__menu-link', v-on:click="logout") Выход
    router-link(to='{ name: "info-user" }')
      i.smallHero__logo
        img(src='../../base/img/logo-main.svg')

    right-nav-component(current="feed")

  .section.hero(v-if='!isAuth',
              :class="{'cnt_app_hero': isStandalone}")
    .profile-header__menu(v-if='isAuth')
      .profile-header__menu-btn
      .profile-header__menu-btn-label
        .profile-header__menu-btn-icon(v-on:click='menuOpened=true')
          i(class='ic-info')

    .profile-header__menu-links(v-show='menuOpened', v-if='!isAuth')
      a(class='profile-header__menu-link profile-header__close-menu',
        v-on:click='menuOpened=false') Отмена
      router-link(class='profile-header__menu-link',
        to='{name: "info-user"}') Покупателям
      router-link(class='profile-header__menu-link',
        to='{name: "info-newshop"}') Магазинам
      a(class='profile-header__menu-link',
        v-on:click="onBuyPromoProduct()") Блогерам
      router-link(class='profile-header__menu-link',
        to='{name: "info-mission"}') Наша миссия
      router-link(class='profile-header__menu-link',
        to='{name: "info-agreement"}') Условия

    .section__content.hero__content(:class="{'cnt_app': isStandalone}", ref="heroOne")
      .profile-header
        .profile-header__center
        router-link(:to='{ name: "info-newshop" }')
          button.profile-header__sellers-btn МАГАЗИНАМ И БРЕНДАМ
        router-link(:to='{ name: "signup" }')
          button.profile-header__auth-btn.btn-smaller ВХОД
        .profile-header__mobile-slider
         .profile-header__mobile-slider-slide
          //-slider
       .hero__content__logo__mobile(:class="{'logo_app': isStandalone}")
      .hero__content__description Шопинг в Instagram #[br(v-if="isMobile")] стал проще!
      button.btn.btn_primary.__orange.__xl.enter__btn.fast__big__btn( to="{ name: 'signup' }" v-if="isStandalone") ВХОД И РЕГИСТРАЦИЯ
      button.btn.btn_primary.__orange.__xl.enter__btn.fast__big__btn( to="{ name: 'app' }" v-else) СКАЧАТЬ ПРИЛОЖЕНИЕ
      .hero__content__footer
       .hero__content__footer__social
        a(href='https://www.fb.com/trendevercom', class='fb' target="_blank")
         i(class='ic-fb social')
        a(href='https://www.instagram.com/trendevercom', class='insta' target="_blank")
         i(class='ic-insta social')
        a(href='https://vk.com/trendever', class='vk' target="_blank")
         i(class='ic-vk social')
       .hero__content__input-wrap
        p Приложение для шопинга в Instagram
        input(type="text" placeholder="Номер телефона" v-model="phoneNumber")
        button.hero__content__get-link(v-on:click="getLink()" v-bind:disabled="disableButton") {{getLinkTitle}}
       .hero__content__dwnld-btns
        a(href="https://itunes.apple.com/ru/app/trendever/id1124212231", class="app_store")
         i(class="ic-appstore")
        a(href="https://play.google.com/store/apps/details?id=com.trendever.app", class="g_play")
         i(class="ic-google_play")
    .hero__content__2(:class="{'cnt2_app': isStandalone}", ref="heroTwo")
     a.how-btn(v-on:click='scrollAnchor()') КАК ЭТО РАБОТАЕТ?
     p(id="how-it-work") Находи и покупай #[br] трендовые товары здесь #[br] или прямо в Instagram
     .caption__play__mobile(to='{name: "main-video"}')
       i.ic-play
      .caption__description__mobile(to='{name: "main-video"}') (смотреть видео)
      button(to='{ name: "info-newshop" }').sellers_auth_btn МАГАЗИНАМ И БРЕНДАМ
    button(v-on:click="scrollAnchorTags()" id="lookinside").shopping_trends ЗАГЛЯНУТЬ ВНУТРЬ
</template>

<script type='text/babel'>
import Vue from 'vue';
import Hammer from 'hammerjs';
import JQuery from 'jquery';
import listen from 'event-listener'
import settings from 'settings'
import { setCallbackOnSuccessAuth } from 'vuex/actions'
import { createLead } from 'vuex/actions/lead'
import { isAuth } from 'vuex/getters/user.js'
import { logOut } from 'vuex/actions/user.js'
import { getComeBack } from 'vuex/getters/products.js'
import * as leads from 'services/leads'
import RightNavComponent from 'base/right-nav/index';
//import Slider from './slider.vue';
import * as commonService from 'services/common';

//search logic
import { searchValue } from 'vuex/getters/search';
import { setSearchValue } from 'vuex/actions/search';

import { targetClass } from 'utils';

export default {
  data(){
    return {
      inputOpened: false,
      menuOpened: false,
      isStandalone: browser.standalone,
      isMobile: window.browser.mobile,
      phoneNumber: '',
      smsSent: false,
      phoneError: false
    }
  },

  components :{
    //Slider,
    RightNavComponent
  },

  mounted() {
    this.$nextTick(()=>{

      this.scrollCnt = document.querySelector( '.scroll-cnt' );


      this.outerCloseMenu = listen(this.scrollCnt, 'click',(event)=>{

          targetClass(event, 'profile-header__menu-links',()=>{
              if(this.menuOpened){
                this.menuOpened = false;
              }
          });
      })

      //SWIPE LOGIC
      if(this.$refs.heroOne && this.$refs.heroTwo) {

        let heroOne = new Hammer(this.$refs.heroOne,{touchAction: 'none'});
        heroOne.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });

        heroOne.on('swipeup', ()=> {
          this.scrollAnchor()
        });

        heroOne.on('swipedown', ()=> {
          //JQuery('.scroll-cnt').animate({scrollTop: window.innerHeight},400);
        });

        let heroTwo = new Hammer(this.$refs.heroTwo,{touchAction: 'none'});
        heroTwo.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });

        heroTwo.on('swipeup', ()=> {
          this.scrollAnchorTags();
        });

        heroTwo.on('swipedown', ()=> {
          JQuery('.scroll-cnt').animate({scrollTop: 0 },450);
        });

      }
    })

  },
  computed: {
      isStandalone(){
        return browser.standalone
      },
      getLinkTitle(){
        if (this.phoneError){
          return "НЕВЕРНЫЙ НОМЕР";
        }
        if (this.smsSent){
          return "ОТПРАВЛЕНО";
        }else{
          return "ПОЛУЧИТЬ ССЫЛКУ";
        }
      },
      disableButton(){
        if (this.phoneNumber.length >= 11 && !this.phoneError){
          return false;
        }else{
          return true;
        }
      }
    },
  beforeDestroy(){
    this.outerCloseMenu.remove();
  },

  vuex: {
    getters: {
      searchValue,
      isAuth,
      getComeBack
    },
    actions: {
      setSearchValue,
      logOut,
      createLead,
      setCallbackOnSuccessAuth,
    }
  },

  methods: {
    touchMove(e){
      if(this.scrollCnt.scrollTop < 2 * window.innerHeight ) {
        e.preventDefault();
      }
    },
    openInput(){
      this.inputOpened = !this.inputOpened;
      this.$nextTick(()=>{
        this.$refs.input.focus()
      });
    },
    search() {
      this.setSearchValue(this.$refs.input.value);
    },
    logout(){

      this.menuOpened = false;
      this.logOut();
      window.location = '/';

    },
    goBack(){
      window.history.back();
    },
    onBuyPromoProduct() {
      if ( !this.isAuth ) {
        this.setCallbackOnSuccessAuth( this.onBuyPromoProduct.bind( this ) );
        this.$router.push( { name: 'signup' } );


      } else {

        this.createLead( settings.promoProductID )
            .then(
              ( lead ) => {
                if ( lead !== undefined && lead !== null ) {
                  this.$router.push( { name: 'chat', params: { id: lead.id } } );
                }
              }
            );
      }
    },
    getLink(){

      commonService.marketSms({phone: this.phoneNumber }).then(data=>{
          yaCounter35346175.reachGoal('get_link');
          Vue.set('smsSent', true);
          Vue.set('phoneNumber','');
          setTimeout( () => Vue.set('smsSent', false), 3000);
        },err=>{
          Vue.set('phoneError',true);
          setTimeout( () => Vue.set('phoneError', false), 3000);
        }
      );
    },
    scrollAnchor() {
      JQuery('.scroll-cnt').animate({scrollTop: window.innerHeight},450);
/*      var block = document.querySelector( "#how-it-work" );
      if ( block !== null ) {
        var scrollBlock = this.scrollCnt;

        if ( !timer ) {
          var timer = setInterval( function() {
            if ( block.getBoundingClientRect().top < 80 ) {
              clearInterval( timer );
            }

            for (let i = 1; i < 80; i++){
              if(scrollBlock.scrollTop >= window.innerHeight) {
                break;
              }
              scrollBlock.scrollTop += 1;
            }

          }, 10 );
        }
      }*/
    },

    scrollAnchorTags() {
      JQuery('.scroll-cnt').animate({scrollTop: 2 * window.innerHeight},450);
/*      var block = document.querySelector( "#tags" );
      if ( block !== null ) {
        var scrollBlock = this.scrollCnt;

        if ( !timer ) {
          var timer = setInterval( function() {
            if ( block.getBoundingClientRect().top < 80 ) {
              clearInterval( timer );
            }

            for (let i = 1; i < 80; i++){
              if(scrollBlock.scrollTop >=  2 * window.innerHeight) {
                break;
              }
              scrollBlock.scrollTop += 1;
            }

          }, 1 );
        }
      }*/
    }
  },
};
</script>
