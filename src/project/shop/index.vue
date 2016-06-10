<style src='./shop.pcss'></style>
<template lang="jade">
-
  global_brands = 'img/global_brands.jpg'
  free_shopping = 'img/free_shopping.jpg'
  fans = 'img/fans.jpg'
  rocket_cat = 'img/Rocket-and-Cat.jpg'
  all_shops = 'img/all_shops.jpg'
  focus = 'img/focus.jpg'
  earth = 'img/earth.png'

.scroll-cnt
  .section.header.u-fixed
    .section__content.header__content
      .header__logo
        a(v-link='{ name: "home" }')
          img(src='img/logo.svg' alt='')
      a(href='#'
        v-if="!isAuth"
        v-link='{ name: "signup" }').btn-yellow.btn-yellow__s Войти
  .section.top
    .arithmetic.arithmetic-mission
      .arithmetic__first
        img(src='img/instagramm.png' alt ='')
      .arithmetic__svg
        img(src='img/arithmetic.svg' alt ='')
      .arithmetic__result
        img(src='img/result.png' alt ='')

  .section.inform-item
    .section__content
      .inform-item__top-block-mission
        div.inform-item__title
          p Trendever повысит продажи#[br] твоего инстаграм-магазина#[br] без вложений и твоего участия!
      .inform-item__answer
        div.inform-item__title.inform-item__answer__title
          p Как это возможно?
          span Знакомься! Это Трендскаут!#[br] Она наполнит твою витрину на Trendever,#[br] отсортирует все товары и назначит цены.

  .section.inform-item
    .section__content
      .inform-item__blue-img
      .inform-item__answer
        div.inform-item__title.inform-item__answer__title
          p Трендскаут разрекламирует...
          span ...твои товары у подходящего блогера за свой счет.#[br] Подписчики покупают прямо в его ленте#[br] по комментарию
            span.inform-item__answer__bold @wantit

  .section.inform-item
    .section__content
      .inform-item__green-img
      .inform-item__answer
        div.inform-item__title.inform-item__answer__title
          p Трендскаут проконсультирует...
          span ...покупателей по товарам и условиям покупки в шопинг-чате.#[br] Все это совершенно бесплатно!

  .section.inform-item
    .section__content
      .inform-item__yellow-img
      .inform-item__answer
        div.inform-item__title.inform-item__answer__title
          p Трендскаут подключит тебя#[br] к шопинг-чату...
          span ...с уже «тёпленьким» клиентом.#[br] Ты платишь скауту 12% комиссии только за продажу.
          span.inform-item__answer__bold.with-margin А первые 3 продажи – вообще#[br] БЕСПЛАТНЫЕ!

  .section.inform-item
    .section__content
      .inform-item__red-img
      .inform-item__answer
        div.inform-item__title.inform-item__answer__title
          p Звучит неплохо?
          span Тогда рассказываем, что нужно, чтобы понравится Трендскауту.

  .section.inform-item
    .section__content
      .inform-item__img-list
        div.inform-item__title
          ul.img-list
            li
              .img-list-stile.showcase
              span Стильная и «живая» витрина#[br] товаров в Instagram
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
              i.ic-galochka Продавать товары на Trendever
            li
              i.ic-galochka Выгодно продавать у блогеров
            li
              i.ic-galochka Продавать по отметке @wantit
            li
              i.ic-galochka Использовать шопинг-чат на 100%

  .section.about-us
    .section__content
      .about-us__logo
        a(href='#')
          img(src='img/about-us-logo.svg' alt='' itemprop="contentUrl")
      p Поможет найти и купить тренды
        br
        |  без наценки из первых рук!
      a(v-link='{ name: "home" }').btn-yellow.btn-yellow__m Перейти на сайт
      p Превращаем Instagram-шопинг в удовольтсвие.

  .section.inform-item.footer
    .section__content
      .inform-item__top-block.inform-item__bg-turquoise
        .vertical-align-wrapper
          p У тебя свой бренд?
            br
            |  Хочешь продаваться у нас?
          div( @click="onBuyPromoProduct()").btn-yellow.btn-yellow__m
            | Узнай как
  script

</template>
<script>
  import listen from 'event-listener';
  import { Swipe, SwipeItem } from 'vue-swipe';
  import { ratioFit } from 'utils';
  import HeaderComponent from 'base/header/header.vue';
  import { setCallbackOnSuccessAuth } from 'vuex/actions';
  import { createLead } from 'vuex/actions/lead';
  import { isAuth } from 'vuex/getters/user.js';
  import * as leads from 'services/leads';

  const promoProduct = 21499;

  export default {
    data(){
      return {
      }
    },

    beforeDestroy() {
      if (this.resizeEvent) {
        this.resizeEvent.remove();
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

    ready(){
    },

    methods: {
    },

    components: {
      HeaderComponent
    }

  }
</script>
