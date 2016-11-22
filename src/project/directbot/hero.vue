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
      span.bold Оператор вашего #[br] магазина в Instagram #[br]
      span.light 24 часа, 7 дней, 2990&nbsp
        i.ic-currency-rub
        | /мес
    .hero__content__set-up
      button.set-up-btn(v-if="isMobile", v-link='{ name: "signup" }') ПОПРОБОВАТЬ ЗА 0
        i.ic-rub
      button.set-up-btn(v-if="!isMobile", v-link='{ name: "signup" }') ПОДКЛЮЧИТЬ БЕСПЛАТНО
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
       p спрашивают про товары #[br] в комментариях или Instagram Direct
   .wrap-box
     .hero__content__2__title.middle 10 из 10 инста-шопов
     .hero__content__2__paragraph
       p хотят свой интернет-магазин и #[br] ставить активные ссылки под постами
   .wrap-box
     .hero__content__2__title.bot РЕШЕНИЕ
     .hero__content__2__paragraph
       p.last Наш оператор ответит #[br] вашим клиентам в Instagram Direct #[br] и, если нужно, создаст сайт
  button(@click="scrollAnchorTags()" id="lookinside").shopping_trends КАК ЭТО РАБОТАЕТ?
  .hero__content__landing
   .section.header.section__content(id="header", v-if="isMobile")
      .header__content.u-fixed.directbot-header(v-show='is_visible')
        .wrapper.directbot-wrap
          .header__center
            .header__text.head Как это работает?
    .hero__content__landing__top-scheme
      p СКАНИРУЕТ КОММЕНТАРИИ #[br] И DIRECT В INSTAGRAM
      p БЫСТРО ОТВЕЧАЕТ #[br] КЛИЕНТАМ В DIRECT
      p НАШ ОПЕРАТОР ВСЕ УСПЕВАЕТ #[br] И СТОИТ ВСЕГО 2990&nbsp
        i.ic-rub
        | /МЕС, #[br] ПОТОМУ ЧТО ЕМУ ПОМОГАЕТ #[br] DIRECTBOT, АВТОМАТИЗИРУЮЩИЙ БОЛЬШИНСТВО ДЕЙСТВИЙ
    .hero__content__landing__title Преимущества #[br] нашего оператора
    .wrapper
      .info-box
        .hero__content__landing__icon-1
          img(src="./img/icon-1.png")
        .hero__content__landing__sub-title Отвечает всем #[br] клиентам сразу
        .hero__content__landing__caption Со смайлами&nbsp
          i.ic-smile&nbsp&nbsp&nbsp&nbsp&nbsp
          | уделит внимание #[br] каждому, быстро ответит. #[br]
          a.link-info(v-link="{ name: 'info-screen-1' }", v-if="isMobile")  Ни один клиент не успеет передумать
          a.link-info(v-on:click="showPopupA = true", v-if="!isMobile")  Ни один клиент #[br] не успеет передумать
          info-popup(:show-popup="showPopupA")
            i.ic-close(v-if="!isMobile", v-on:click="showPopupA = false")
            info-screen1
      .info-box
        .hero__content__landing__icon-2
          img(src="./img/icon-2.png")
        .hero__content__landing__sub-title Выполняет #[br] «мартышкин труд»
        .hero__content__landing__caption Больше не нужно отвечать #[br(v-if="isMobile")] и спрашивать #[br(v-if="!isMobile")] одно и то же. #[br(v-if="isMobile")]
          a.link-info(v-link="{name: 'info-screen-2'}", v-if="isMobile") Оператор даст ссылку на сайт, #[br(v-if="!isMobile")] уточнит #[br(v-if="isMobile")] наличие, узнает размеры и адрес
          a.link-info(v-on:click="showPopupB = true", v-if="!isMobile") Бот даст ссылку на сайт, #[br(v-if="!isMobile")] уточнит #[br(v-if="isMobile")] наличие, узнает размеры и адрес
          info-popup(:show-popup="showPopupB")
            i.ic-close(v-if="!isMobile", v-on:click="showPopupB = false")
            info-screen2
      .info-box
        .hero__content__landing__icon-3
          img(src="./img/icon-3.png")
        .hero__content__landing__sub-title Подключается быстро, #[br] работает самостоятельно
        .hero__content__landing__caption Подключи нашего оператора к своему #[br] Instagram-магазину в один клик. #[br]
          a.link-info(v-link="{name: 'info-screen-3'}", v-if="isMobile") Ничего не надо скачивать
          a.link-info(v-on:click="showPopupC = true", v-if="!isMobile") Ничего не надо скачивать
          info-popup(:show-popup="showPopupC")
            i.ic-close(v-if="!isMobile", v-on:click="showPopupC = false")
            info-screen3
    .hero__content__landing__title.middle Как работает наш #[br] оператор?
    .hero__content__landing__screen-1
      span.screen-title СКАНИРУЕТ INSTAGRAM DIRECT
      img(src="./img/screen-1.png")
    .hero__content__landing__screen-2
      span.screen-title СКАНИРУЕТ КОММЕНТАРИИ
      img(src="./img/screen-2.png")
    .hero__content__landing__sub-title Оператор сразу видит #[br] вопросы покупателей
    .hero__content__landing__captionНе важно, задан вопрос в комментариях #[br] или личном сообщении, #[br] оператор уже будет в чате #[br] с покупателем
    .hero__content__landing__toggle
      .hero__content__landing__toggle__title ТЕПЕРЬ ОПЕРАТОРУ НУЖНО ЗНАТЬ, #[br] У ТЕБЯ ЕСТЬ ИНТЕРНЕТ-МАГАЗИН?
      button.yes(v-on:click="yesScreen = true", v-if="noScreen = true") ДА
      button.no(v-on:click="yesScreen = false") НЕТ
    .toggle-box
      .wrap-yes(v-show="yesScreen")
        .hero__content__landing__screen-3
          span.screen-title ИЗУЧИТ ТВОЙ ИНТЕРНЕТ-МАГАЗИН
          img(src="./img/screen-3-yes.png")
        .hero__content__landing__screen-4
          span.screen-title УЗНАЕТ О ТОВАРАХ ПО АРТИКУЛУ
          img(src="./img/screen-4-yes.png")
        .hero__content__landing__sub-title.info Есть сайт? Укажи артикул #[br] товара под постом
        .hero__content__landing__caption Оператор узнает о деталях и наличии #[br] товара по артикулу в описании поста. #[br] Ссылка на сайт должна быть #[br] в «био» инста-профиля
        .info-wrap
          .hero__content__landing__screen-5
            span.screen-title ОТВЕЧАЕТ В INSTAGRAM DIRECT
            img(src="./img/screen-5.png")
          .hero__content__landing__sub-title Оператор ответит на вопросы #[br] и поможет купить
          .hero__content__landing__caption Клиенты получат консультацию* и ссылку #[br] для покупки товара в твоем #[br] интернет-магазине**
          .hero__content__landing__tip *отслеживай диалог в кабинете или Instagram Direct
          .hero__content__landing__tip **еще можно покупать не выходя из Instagram Direct
      .wrap-no(v-show="noScreen")
        .hero__content__landing__screen-3
          span.screen-title СОЗДАСТ ИНТЕРНЕТ-МАГАЗИН
          img(src="./img/screen-3-no.png")
        .hero__content__landing__screen-4
          span.screen-title СПРАШИВАЕТ О ТОВАРАХ В ЧАТЕ
          img(src="./img/screen-4-no.png")
        .hero__content__landing__sub-title.info Нет сайта? Ответь #[br] на вопросы о товарах
        .hero__content__landing__caption.store Оператор увидит посты в Instagram #[br] и добавит их в твой
          a.link-info(v-link="{name: 'info-screen-4'}", v-if="isMobile")  новый интернет-магазин по ссылке
            span.bold  xxxx.drbt.io #[br]
          a.link-info(v-on:click="showPopupD = true", v-if="!isMobile")  новый интернет-магазин по ссылке
            span.bold  xxxx.drbt.io
          info-popup(:show-popup="showPopupD")
            i.ic-close(v-if="!isMobile", v-on:click="showPopupD = false")
            info-screen4
          | Также уточнит детали и наличие товаров
  .info-block
    .title
      p Подключайся и получишь:
    .list
      ol
        li Опытного оператора в команду, #[br] но в 15 раз дешевле*
        li Адаптивный интернет-магазин, #[br] с платежами и доставкой
        li Сервис по подбору и организации #[br] рекламы через блогеров
    .tooltip
      p *из расчета средней зарплаты оператора 45 тыс.руб. #[br] в месяц, и это только за 8-часовой день с выходными
  .free-connect
    p ХОЧЕШЬ ПОДКЛЮЧИТЬ СВОЕГО #[br] ОПЕРАТОРА? ИЛИ ТЫ САМ ОПЕРАТОР?
    a(v-link="{name: 'signup'}") ЖМИ СЮДА
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
import InfoPopup from 'base/popup/info-popup';
import infoScreen1 from 'project/directbot/info-screen-1.vue'
import infoScreen2 from 'project/directbot/info-screen-2.vue'
import infoScreen3 from 'project/directbot/info-screen-3.vue'
import infoScreen4 from 'project/directbot/info-screen-4.vue'


export default {
  data(){
    return {
      inputOpened: false,
      menuOpened: false,
      isStandalone: browser.standalone,
      isMobile: window.browser.mobile,
      phoneNumber: '',
      smsSent: false,
      phoneError: false,
      showPopupA: false,
      showPopupB: false,
      showPopupC: false,
      showPopupD: false,
      yesScreen: false,
      noScreen: false
    }
  },

  components :{
    HeaderComponent,
    InfoPopup,
    infoScreen1,
    infoScreen2,
    infoScreen3,
    infoScreen4,
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
