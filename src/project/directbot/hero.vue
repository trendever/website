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
   a.how-btn(@click='scrollAnchor()') КАКИЕ ПРОБЛЕМЫ РЕШАЕТ?
   .hero__content__2__title.main(:class="{'cnt2_app_title': isStandalone}") 2 часа ожидания
   .hero__content__2__paragraph
     p нужно в среднем, чтобы #[br] получить ответ от инста-шопа
   .hero__content__2__title 9 из 10 покупателей
   .hero__content__2__paragraph
     p в начале спрашивают про цену #[br] или наличие товара
   .hero__content__2__title 10 из 10 инста-шопов
   .hero__content__2__paragraph
     p хотели бы добавлять активную #[br] ссылку в подпись своих постов
   .hero__content__2__title.bot РЕШЕНИЕ
   .hero__content__2__paragraph
     p Directbot автоматически #[br] отвечает клиентам #[br] в Instagram Direct
  button(@click="scrollAnchorTags()" id="lookinside").shopping_trends КАК ЭТО РАБОТАЕТ?
  .hero__content__landing
   .section.header.section__content(:class="{'cnt2_app_header': isStandalone}")
      .header__content.u-fixed.directbot-header(v-show='is_visible')
        .wrapper.directbot-wrap
          .header__center
            .header__text.head Подробнее о Directbot
    .hero__content__landing__title Что умеет Directbot?
    .hero__content__landing__icon-1
      img(src="./img/icon-1.png")
    .hero__content__landing__sub-title Отвечает всем клиентам сразу
    .hero__content__landing__caption Играюче уделит внимание каждому, #[br] быстро ответит. На реальных покупателей останется больше времени
    .hero__content__landing__icon-2
      img(src="./img/icon-2.png")
    .hero__content__landing__sub-title Выполняет «мартышкин труд»
    .hero__content__landing__caption Больше не нужно бесконечно #[br] копировать/вставлять. Бот даст ссылку #[br] на сайт, расскажет про цены, наличие
    .hero__content__landing__icon-3
      img(src="./img/icon-3.png")
    .hero__content__landing__sub-title Подключается быстро #[br] и работает в фоне
    .hero__content__landing__caption Просто подключи свой Instagram #[br] и наслаждайся результатом. Ничего #[br] не надо скачивать. Будущее наступило
    .hero__content__landing__title.mid Откуда бот знает, #[br] кому и что отвечать?!
    .hero__content__landing__screen-1
      img(src="./img/screen-1.png")
    .hero__content__landing__sub-title.questions Бот понимает вопросы покупателей
    .hero__content__landing__caption Не важно, где задан вопрос, #[br] бот сразу отправит персональное #[br] сообщение в директ и приветливо #[br] ответит на вопросы
    .hero__content__landing__screen-2
      img(src="./img/screen-2.png")
    .hero__content__landing__sub-title.info Бот спросит у тебя все, что нужно
    .hero__content__landing__caption Бот уточнит всю информациюпо #[br] товарам в чате (по ссылке в sms). #[br] Есть сайт? Укажи ссылку на товарв #[br] описании поста
    .hero__content__landing__title.how-cost Сколько стоят услуги #[br] Directbot?
    .hero__content__landing__price
      span.numb 4 990
      i.ic-rub-directbot
      span  в месяц
    .hero__content__landing__free Первые 3 дня бесплатно
a(class='profile-header__menu-link', @click="logout", v-if="isAuth") Выход
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
