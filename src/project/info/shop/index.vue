<style src='./style.pcss'></style>
<template lang="jade">
scroll-component
  .section__content
    .section.header
      .section__content.header__content.u-fixed
        .wrapper
          .header__arrow(v-if='isAuth', @click='goBack()')
            i.header__arrow__ic.ic-arrow-left
          div(v-bind:class="[isAuth ? 'center': 'left']").header__logo
            a(v-link='{ name: "home" }')
              img(src='../../../base/img/logo-main.svg' alt='')
          a(href='#'
            class="headersignup"
            v-if="!isAuth"
            v-link='{ name: "signup" }').btn-yellow.btn-yellow__s Войти

    .section.top
      .arithmetic.arithmetic-mission
        img(src='img/arithmetic.png' alt ='')

    .section.inform-item
      .section__content
        .inform-item__top-block-mission
          div.inform-item__title
            p Ты даже не заметишь, как Trendever#[br] повысит продажи твоего#[br] инстаграм-магазина!
        .inform-item__answer
          div.inform-item__title.inform-item__answer__title
            p Как это возможно?
            span(v-if="isMobile") Знакомься! Это Трендскаут!#[br] Она наполнит твою#[br] витрину на Trendever,#[br] отсортирует все товары и укажет цены.
            span(v-if="!isMobile") Знакомься! Это Трендскаут!#[br] Она наполнит твою витрину на Trendever,#[br] отсортирует все товары и укажет цены.

    .section.inform-item
      .section__content
        .inform-item__blue-img
        .inform-item__answer
          div.inform-item__title.inform-item__answer__title
            p Трендскаут разрекламирует...
            span ...твои товары у подходящего блогера за счет Trendever.#[br] Подписчики покупают прямо в его ленте
              br(class='mobile-hidden')
              | &nbsp;по комментарию
              span.inform-item__answer__bold.wantit &nbsp;@wantit

    .section.inform-item
      .section__content
        .inform-item__green-img
        .inform-item__answer
          div.inform-item__title.inform-item__answer__title
            p Трендскаут проконсультирует...
            span ...покупателей по товарам и условиям покупки в шопинг-чате.#[br]

    .section.inform-item
      .section__content
        .inform-item__yellow-img
        .inform-item__answer
          div.inform-item__title.inform-item__answer__title
            p.no-br-mobile Трендскаут подключит тебя#[br] к шопинг-чату...
            span ...с уже готовым клиентом.#[br] Ты получишь sms со ссылкой на шопинг-чат.

    .section.inform-item
      .section__content
        .inform-item__red-img
        .inform-item__answer
          div.inform-item__title.inform-item__answer__title
            p Звучит неплохо?
            span Тогда рассказываем, что нужно, чтобы понравиться Трендскауту.

    .section.inform-item
      .section__content
        .inform-item__img-list
          div.inform-item__title
            ul.img-list
              li
                .img-list-stile.showcase
                span Стильная и «живая» витрина#[br] товаров в Instagram.
              li
                .img-list-stile.time-saving
                span Дождаться пока Трендскаут#[br] заметит твой инста-шоп.
              li
                .img-list-stile.provide-information
                span  По запросу скаута сообщать#[br] информацию о товарах.

        .inform-item__answer
          div.inform-item__title.inform-item__answer__title
            p Eсли не хочешь ждать...
            span ...подключайся к Trendever и персональный скаут научит тебя:

    .section.inform-item
      .section__content
        .inform-item__green-with-img
          div.inform-item__title
            ul.check-list.check-list-sm
              li
                i.ic-galochka
                | Продавать товары на Trendever
              li
                i.ic-galochka
                | Выгодно продавать у блогеров
              li
                i.ic-galochka
                | Продавать по отметке @wantit
              li
                i.ic-galochka
                | Использовать шопинг-чат на 100%

    .section.about-us
      .section__content
        .about-us__logo
          a(href='#')
            img(src='../../../base/img/about-us-logo.png' alt='' itemprop="contentUrl")
        p Нажми Попробовать, зарегистрируйся#[br] и Трендскаут проконсультирует тебя в чате.
        a( @click="onBuyPromoProduct()" ).btn-yellow.btn-yellow__m Попробовать

    .section.inform-item.footer
      .section__content
        .inform-item__top-block.inform-item__bg-turquoise.invert
          .vertical-align-wrapper
            p Ты стильный блогер?#[br] Хочешь заработать?
            div( @click="onBuyPromoProduct()").btn-yellow.btn-yellow__m
              | Узнай как

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
