<style src='./styles/hero-directbot.pcss'></style>
<template lang="jade">
.section.hero(v-if='!isAuth',
            :class="{'cnt_app_hero': isStandalone}")

  .section__content.hero__content(:class="{'cnt_app': isStandalone}", v-el:hero-one)
    .profile-header
      .profile-header__center
      button(v-link='{ name: "signup" }').profile-header__auth-btn.btn-smaller ВХОД
     .hero__content__logo__mobile(:class="{'logo_app': isStandalone}")
    .hero__content__description Искусственный интеллект для Instagram-магазинов
    button.btn.btn_primary.__orange.__xl.enter__btn.fast__big__btn( v-link="{ name: 'signup' }" v-if="isStandalone") ВХОД И РЕГИСТРАЦИЯ
    button.btn.btn_primary.__orange.__xl.enter__btn.fast__big__btn( v-link="{ name: 'app' }" v-else) СКАЧАТЬ ПРИЛОЖЕНИЕ
  .hero__content__2(:class="{'cnt2_app': isStandalone}", v-el:hero-two)
   a.how-btn(@click='scrollAnchor()') КАК ЭТО РАБОТАЕТ?
   .hero__content__2__title ПРОБЛЕМА
   .hero__content__2__paragraph
     p Вопросы клиентов Instagram #[br] теряются среди спама #[br] в комментах, директ, вотсап, #[br] вайбер, email...
   .hero__content__2__paragraph
     p Большинство клиентов #[br] спрашивают одно и тоже, #[br] а потом перестают отвечать
   .hero__content__2__paragraph
     p Неактивная ссылка #[br] под постом в Instagram
   .hero__content__2__title.bot РЕШЕНИЕ
   .hero__content__2__paragraph
     p Directbot автоматически #[br] отвечает всем клиентам #[br] в Instagram-директ
  button(@click="scrollAnchorTags()" id="lookinside").shopping_trends МОЖНО ПОДРОБНЕЕ?
  .hero__content__landing
   .section.header.section__content
      .header__content.u-fixed.directbot-header(v-show='is_visible')
        .wrapper
          .header__center
            .header__text Подробнее о Directbot
    .hero__content__landing__title Почему Directbot?
</template>

<script type='text/babel'>
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
import * as commonService from 'services/common';
import HeaderComponent from 'base/header/header.vue';

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
    HeaderComponent
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
    if(this.$els.heroOne && this.$els.heroTwo) {

      let heroOne = new Hammer(this.$els.heroOne,{touchAction: 'none'});
      heroOne.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });

      heroOne.on('swipeup', ()=> {
        this.scrollAnchor()
      });

      heroOne.on('swipedown', ()=> {
        //JQuery('.scroll-cnt').animate({scrollTop: window.innerHeight},400);
      });

      let heroTwo = new Hammer(this.$els.heroTwo,{touchAction: 'none'});
      heroTwo.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });

      heroTwo.on('swipeup', ()=> {
        this.scrollAnchorTags();
      });

      heroTwo.on('swipedown', ()=> {
        JQuery('.scroll-cnt').animate({scrollTop: 0 },450);
      });

    }

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
          yaCounter35346175.reachGoal('get_link');
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
      JQuery('.scroll-cnt').animate({scrollTop: window.innerHeight},450);
    },

    scrollAnchorTags() {
      JQuery('.scroll-cnt').animate({scrollTop: 2 * window.innerHeight},450);
    }
  },
};
</script>
