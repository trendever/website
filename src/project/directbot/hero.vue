<style src='./styles/hero-directbot.pcss'></style>
<template lang="jade">
.section.hero(v-if='!isAuth')

  .section__content.hero__content(v-el:hero-one)
    .profile-header
      .profile-header__center
      button(v-link='{ name: "signup" }').profile-header__auth-btn.btn-smaller ВХОД И РЕГИСТРАЦИЯ
     .hero__content__logo__mobile
    .hero__content__left-logo
      a(href="#")
        img(src="./img/directbot-logo-txt.svg")
    .hero__content__center-logo(v-if="!isMobile")
      img(src="./img/directbot-main-logo.png")
    .hero__content__description
      span.bold Бот-консультант #[br]
      span.light для Instagram-магазинов
    .hero__content__set-up
      button.set-up-btn(v-if="isMobile") ПОДКЛЮЧИТЬ ЗА 0
        i.ic-rub
      button.set-up-btn(v-if="!isMobile") ПОДКЛЮЧИТЬ БЕСПЛАТНО
    button.btn.btn_primary.__orange.__xl.enter__btn.fast__big__btn( v-link="{ name: 'signup' }") ВХОД И РЕГИСТРАЦИЯ
    //-button.btn.btn_primary.__orange.__xl.enter__btn.fast__big__btn( v-link="{ name: 'app' }" v-else) СКАЧАТЬ ПРИЛОЖЕНИЕ
  .hero__content__2(v-el:hero-two)
   a.how-btn(@click='scrollAnchor()') КАКИЕ ПРОБЛЕМЫ РЕШАЕТ?
   .wrap-box
     .hero__content__2__title.main 2 часа ожидания
     .hero__content__2__paragraph
       p.top нужно в среднем, чтобы #[br] получить ответ от инста-шопа
   .wrap-box
     .hero__content__2__title 9 из 10 покупателей
     .hero__content__2__paragraph
       p узнают про товар в комментариях #[br] или Instagram Direct, а не на сайте
   .wrap-box
     .hero__content__2__title 10 из 10 инста-шопам
     .hero__content__2__paragraph
       p нужны Интернет-магазин и активные #[br] ссылки на постах в Instagram
   .wrap-box
     .hero__content__2__title.bot РЕШЕНИЕ
     .hero__content__2__paragraph
       p.last Directbot сам ответит клиентам #[br] в Instagram Direct и, если нужно, #[br] создаст сайт
  button(@click="scrollAnchorTags()" id="lookinside").shopping_trends КАК ЭТО РАБОТАЕТ?
  .hero__content__landing
   .section.header.section__content(id="header", v-if="isMobile")
      .header__content.u-fixed.directbot-header(v-show='is_visible')
        .wrapper.directbot-wrap
          .header__center
            .header__text.head Подробнее о Directbot
    .hero__content__landing__title Directbot сам отвечает #[br(v-if="isMobile")] в Instagram Direct
    .wrapper
      .info-box
        .hero__content__landing__icon-1
          img(src="./img/icon-1.png")
        .hero__content__landing__sub-title Отвечает всем #[br] клиентам сразу
        .hero__content__landing__caption Играюче уделит внимание каждому, #[br] быстро ответит.
          a.link-info(v-link="{name: 'info-screen-1'}")  Ни один клиент #[br] не успеет передумать
      .info-box
        .hero__content__landing__icon-2
          img(src="./img/icon-2.png")
        .hero__content__landing__sub-title Выполняет #[br] «мартышкин труд»
        .hero__content__landing__caption Больше не нужно отвечать #[br(v-if="isMobile")] и спрашивать #[br(v-if="!isMobile")] одно и то же. #[br(v-if="isMobile")]
          a.link-info(v-link="{name: 'info-screen-2'}") Бот даст ссылку на сайт, #[br(v-if="!isMobile")] уточнит #[br(v-if="isMobile")] наличие, узнает размеры и адрес
      .info-box
        .hero__content__landing__icon-3
          img(src="./img/icon-3.png")
        .hero__content__landing__sub-title Подключается быстро, #[br] работает самостоятельно
        .hero__content__landing__caption Подключи бота и следи за чатами #[br(v-if="isMobile")] в своем #[br(v-if="!isMobile")] Instagram Direct. #[br(v-if="isMobile")] Ничего не надо скачивать. #[br]
          a.link-info(v-link="{name: 'info-screen-3'}") Будущее наступило
    .hero__content__landing__title.mid Откуда бот знает, #[br(v-if="isMobile")] кому и что отвечать?
    .hero__content__landing__screen-1
      img(src="./img/screen-1.png")
    .hero__content__landing__sub-title.questions Бот понимает #[br] вопросы покупателей
    .hero__content__landing__caption Не важно, задан вопрос #[br(v-if="!isMobile")] в комментариях #[br(v-if="isMobile")] или личном сообщении, #[br] бот распознает его и поймет, #[br] что нужно ответить клиенту
    .hero__content__landing__toggle
      .hero__content__landing__toggle__title У ТЕБЯ ЕСТЬ ИНТЕРНЕТ-МАГАЗИН?
      button.yes ДА
      button.no НЕТ
    .toggle-box
      .wrap-yes
        .hero__content__landing__screen-2
          img(src="./img/screen-2-yes.png")
        .hero__content__landing__sub-title.info Есть сайт? Укажи артикул #[br] товара под постом
        .hero__content__landing__caption Бот узнает о деталях и наличии товара #[br] по артикулу в описании поста. #[br] Ссылка на сайт должна быть #[br] в «био» инста-профиля
      .wrap-no(v-if="false")
        .hero__content__landing__screen-2
          img(src="./img/screen-2-no.png")
        .hero__content__landing__sub-title.info Нет сайта? Ответь #[br] на вопросы о товарах
        .hero__content__landing__caption Бот увидит новые посты, уточнит детали #[br] и наличие товаров. Потом добавит их #[br] в твой
          a.link-info(v-link="{name: 'info-screen-4'}")  новый Интернет-магазин #[br] по ссылке
            span.bold  xxxx.drbt.io
      .info-wrap
        .hero__content__landing__screen-3
          img(src="./img/screen-3.png")
        .hero__content__landing__sub-title Бот даст ссылку на товар #[br] и ответит на вопросы
        .hero__content__landing__caption Клиенты быстро получат ответы, #[br] без опечаток. Следи за диалогом #[br] прямо в своем Instagram #[br] и отвечай сам, если нужно
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
    },


  },
};
</script>
