<style src='./styles/hero.pcss'></style>
<template lang="jade">
.header__menu__overlay(v-show='menuOpened && isMobile', @click='menuOpened=false', :class="{'color-green': !isAuth, 'color-black': isAuth}")

.section.smallHero(v-if='isAuth', :class="{ 'header-glued': !isMobile }")

  .input__container(v-if="!isMobile")
    i.ic-search(@click="openInput")
    input(
      v-el:input,
      @keyup='search()',
      :value='searchValue',
      type='text',
      placeholder='Ищи текстом или жми теги...',
      v-if="inputOpened || searchValue")

  .profile-header__menu
    .profile-header__menu-btn
      .profile-header__menu-btn-label
      .profile-header__menu-btn-icon(v-if="!getComeBack", @click.stop='menuOpened=!menuOpened')
        i(class='ic-info')
      .profile-header__menu-btn-icon(v-if="getComeBack", @click='goBack')
        i(class='ic-arrow-left')
  .profile-header__menu-links(v-show='menuOpened', v-bind:class="{ '__normal': isAuth, '__desktop': !isMobile }")
    a(class='profile-header__menu-link profile-header__close-menu first',
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
    a(class='profile-header__menu-link',
      href="https://trendever.payture.com/",
      target="_blank") Денежный перевод
    a(class='profile-header__menu-link', @click="logout") Выход
  a(v-link='{ name: "info-user" }')
    i.smallHero__logo
      img(src='../../base/img/logo-main.svg')

  right-nav-component(current="feed")

.section.hero(v-if='!isAuth',
            :class="{'cnt_app_hero': isStandalone}",
            @touchmove="touchMove($event)",
            v-el:hero)
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

  .section__content.hero__content(:class="{'cnt_app': isStandalone}")
    .profile-header
      .profile-header__center
      button(v-link='{ name: "info-shop" }').profile-header__sellers-btn МАГАЗИНАМ И БРЕНДАМ
      button(v-link='{ name: "signup" }').profile-header__auth-btn ВХОД И РЕГИСТРАЦИЯ
      .profile-header__mobile-slider
       .profile-header__mobile-slider-slide
        slider
     .hero__content__logo__mobile
    .hero__content__description Шопинг в Instagram стал проще!
    button.btn.btn_primary.__orange.__xl.enter__btn.fast__big__btn( v-link="{ name: 'signup' }") ВХОД И РЕГИСТРАЦИЯ
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
      button.hero__content__get-link(@click="getLink()" v-bind:disabled="disableButton") {{getLinkTitle}}
     .hero__content__dwnld-btns
      a(href="https://itunes.apple.com/ru/app/trendever/id1124212231", class="app_store")
       i(class="ic-appstore")
      //a(href="#", class="g_play")
       //i(class="ic-google_play")
  .hero__content__2(:class="{'cnt2_app': isStandalone}")
   a.how-btn(@click='scrollAnchor()') КАК ЭТО РАБОТАЕТ?
   p(id="how-it-work") Находи и покупай #[br] трендовые товары здесь #[br] или прямо в Instagram
   .caption__play__mobile(v-link='{name: "main-video"}')
     i.ic-play
    .caption__description__mobile(v-link='{name: "main-video"}') (смотреть видео)
    button(v-link='{ name: "info-newshop" }').sellers_auth_btn МАГАЗИНАМ И БРЕНДАМ
  button(@click="scrollAnchorTags()").shopping_trends ЗАГЛЯНУТЬ ВНУТРЬ
</template>

<script type='text/babel'>
import Hammer from 'hammerjs';

import listen from 'event-listener'
import settings from 'settings'
import { setCallbackOnSuccessAuth } from 'vuex/actions'
import { createLead } from 'vuex/actions/lead'
import { isAuth } from 'vuex/getters/user.js'
import { logOut } from 'vuex/actions/user.js'
import { getComeBack } from 'vuex/getters/products.js'
import * as leads from 'services/leads'
import RightNavComponent from 'base/right-nav/index';
import Slider from './slider.vue';
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
    Slider,
    RightNavComponent
  },

  ready() {

    this.scrollCnt = document.querySelector( '.scroll-cnt' );


    this.outerCloseMenu = listen(this.scrollCnt, 'click',(event)=>{

        targetClass(event, 'profile-header__menu-links',()=>{
            if(this.menuOpened){
              this.menuOpened = false;
            }
        });
    })



    //SWIPE LOGIC
    if(this.$els.hero) {

      let swipeAction = new Hammer(this.$els.hero,{touchAction: 'auto'});
      swipeAction.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
      swipeAction.on('swipeup swipedown', ()=> {
        if(this.scrollCnt.scrollTop < window.innerHeight){
          this.scrollAnchor();
        }
        if(this.scrollCnt.scrollTop >= window.innerHeight && this.scrollCnt.scrollTop < 2 * window.innerHeight){
          this.scrollAnchorTags();
        }
      });


    }

  },
  computed: {
      isStandalone(){
        //alert(navigator.standalone)
        return browser.standalone
        //return navigator.standalone
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
        this.$els.input.focus()
      });
    },
    search() {
      this.setSearchValue(this.$els.input.value);
    },
    logout(){

      this.$set('menuOpened', false);
      this.logOut();
      window.location = '/';

    },
    goBack(){
      window.history.back();
    },
    onBuyPromoProduct() {
      if ( !this.isAuth ) {
        this.setCallbackOnSuccessAuth( this.onBuyPromoProduct.bind( this ) );
        this.$router.go( { name: 'signup' } );


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
    getLink(){

      commonService.marketSms({phone: this.phoneNumber }).then(data=>{
          this.$set('smsSent', true);
          this.$set('phoneNumber','');
          setTimeout( () => this.$set('smsSent', false), 3000);
        },err=>{
          this.$set('phoneError',true);
          setTimeout( () => this.$set('phoneError', false), 3000);
        }
      );
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

            for (let i = 1; i < 80; i++){
              if(scrollBlock.scrollTop >= window.innerHeight) {
                break;
              }
              scrollBlock.scrollTop += 1;
            }

          }, 10 );
        }
      }
    },

    scrollAnchorTags() {
      var block = document.querySelector( "#tags" );
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
      }
    },

    isStandalone(){
      return browser.standalone
    }
  },
};
</script>
