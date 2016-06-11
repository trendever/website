<style src='./style.pcss'></style>
<template lang="jade">
.scroll-cnt
  .section.header.u-fixed
    .section__content.header__content
      .header__logo
        a(v-link='{ name: "home" }')
          img(src='../../../base/img/logo-beta.png' alt='')
      a(href='#'
        v-if="!isAuth"
        v-link='{ name: "signup" }').btn-yellow.btn-yellow__s Войти

  .section.top
    .arithmetic
      img(src='img/arithmetic.png' alt ='')

  .section.inform-item
    .section__content
      .inform-item__top-block.inform-item__bg-img-red
        div.inform-item__title
          p Любишь искать и покупать
            br
            |  что-то новенькое
            br
            |  через Instagram?
        .play-btn-sm(v-link='{name: "main-video"}')
          i.ic-play-inverted
          span (смотреть видео)
      .inform-item__answer
        div.inform-item__title.inform-item__answer__title
          p Вот только среди
            br
            |  множества товаров
            br
            |  без категорий, отзывов и цен...
          span ...шопинг в Instagram становится испытанием!

  .section.inform-item
    .section__content
      .inform-item__top-block.inform-item__bg-blue
        div.inform-item__title
          ul.emoji-list
            li Ой, сколько всего!
              span.emoji_small.emoji_neutral
            li Но где же то, что нужно?
              span.emoji_small.emoji_confused
            li И сколько это стоит?
              span.emoji_small.emoji_think
            li А есть ли отзывы?
              span.emoji_small.emoji_imp
            li Моя посылка точно придет?
              span.emoji_small.emoji_doubts
          span А теперь представь, что все стало гораздо проще!
      .inform-item__answer
        div.inform-item__title.inform-item__answer__title
          p Трендскауты,
            br
            |  наши fashion-эксперты,
          span ...уже все сделали для тебя!

  .section.inform-item
    .section__content
      .inform-item__top-block.inform-item__bg-green
        div.inform-item__title
          ul.check-list
            li
              i.ic-galochka
              | Выбрали самое интересное
            li
              i.ic-galochka
              | Узнали все цены
            li Отсортировали по категориям
              i.ic-galochka
            li
              i.ic-galochka
              | Проверили продавцов
          span Пара минут, и ты найдешь то, что нужно!
      .inform-item__answer
        div.inform-item__title.inform-item__answer__title
          p.with-padding Подписывайся
            br
            |  на ленты Трендскаутов,
          span ...которые выбрали тренды не на продажу, а для себя.
            br
            |  Любой тренд можно сохранить в ленту своих желаний.

  .section.inform-item
    .section__content
      .inform-item__top-block.inform-item__bg-yellow.gallery-about
        swipe.my-swipe
          swipe-item.slide1
            a(href='http://www.trendever.com/cosinessshades/').gallery-about__slide.gallery-about__slide__img-block
                img(src='img/slide-img-1.png' alt='')
            a(href='http://www.trendever.com/cosinessshades/').gallery-about__slide__title Christine
            .gallery-about__slide__theme Fashion & Beauty блогер
            .gallery-about__slide__text
              p «Мой мир - мое вдохновение, я люблю созерцать все самое прекрасное
                br
                |  и передавать свои эмоции окружающим. Я родилась в Латвии
                br
                |  и мой город диктует стиль моей жизни»
          swipe-item.slide2
            a(href='http://www.trendever.com/tumblrcereals/').gallery-about__slide.gallery-about__slide__img-block
                img(src='img/slide-img-2.png' alt='')
            a(href='http://www.trendever.com/tumblrcereals/').gallery-about__slide__title Polina
            .gallery-about__slide__theme Fashion & lifestyle блогер
            .gallery-about__slide__text
              p «Фото - отражение моей жизни. Они разные, но в то же время гармонируют.
                br
                |  Я кофеман, авантюристка и путешественница.
                br
                |  Главные увлечения - фотография, съемка видео»
          swipe-item.slide3
            a(href='http://www.trendever.com/fenechfox/').gallery-about__slide.gallery-about__slide__img-block
                img(src='img/slide-img-3.png' alt='')
            a(href='http://www.trendever.com/fenechfox/').gallery-about__slide__title Alice
            .gallery-about__slide__theme Fashion & lifestyle блогер
            .gallery-about__slide__text
              p «Хочу передать красоту повседневных вещей, на которые мы
                br
                |  не обращаем внимание. Поделиться с подписчиками эмоциями
                br
                |  о моем главном увлечении - музыка и игра на фортепиано»
          swipe-item.slide4
            a(href='http://www.trendever.com/diasafina/').gallery-about__slide.gallery-about__slide__img-block
                img(src='img/slide-img-4.png' alt='')
            a(href='http://www.trendever.com/diasafina/').gallery-about__slide__title Diana
            .gallery-about__slide__theme Lifestyle блогер
            .gallery-about__slide__text
              p «Мой Инстаграмм это стильные, легкие фото, которые передают эмоции
                br
                |  и заставляют улыбаться! Люблю стрит-арт и одежду, которые удобно
                br
                |  носить и в которой я чувствую себя комфортно и уверенно!»



  .section.inform-item.about-mobile
    .section__content
      .about-mobile__duplicate
        .about-mobile__duplicate__title Шопинг твоих желаний
        p Фильтруй по категориям,
          br
          | жми купить и консультант
          br
          | ответит в шопинг-чате.
      .inform-item__top-block.inform-item__bg-red
        .about-mobile__two-col
          .about-mobile__two-col__img
            .about-mobile__img-block
              img(src='img/iphone-1.png' alt='')
              .video.video-1(v-show="!isIOS || videoOnePlayed", :class="{'played': videoOnePlayed}")
                a(href='#', @click="toggleVideoOne()", style="z-index: 1000;" v-show='!videoOnePlayed').play-btn
                  i.ic-play-inverted
                video(v-el:video-one, @click="pauseVideoOne()", v-on:pause="videoOnePlayed=false", preload="yes")
                  source(src="//cdn.trendever.com/videos/video_one.mp4" type="video/mp4")
                  source(src="//cdn.trendever.com/videos/video_one.webm" type="video/webm")
                  | Your browser does not support the video.
          .about-mobile__two-col__text
            .vertical-align-wrapper
              .about-mobile__two-col__title Шопинг твоих желаний
              p.mobile-hidden Фильтруй по категориям, жми купить
                br
                |  и консультант ответит в шопинг-чате.
              p Весь заказ, включая оплату и доставку,
                br
                |  в одном окошке чата.


  .section.inform-item.about-mobile
    .section__content
      .about-mobile__duplicate
        .about-mobile__duplicate__title А ещё,
          br
          |  мы интегрировались
          br
          |  с Instagram!
        p Теперь ты можешь
          br
          |  купить или сохранить
          br
          |  инстаграм-пост, оставив
          br
          |  комментарий в ленте.
      .inform-item__top-block.inform-item__bg-gradient
        .about-mobile__two-col
          .about-mobile__two-col__text.right
            .vertical-align-wrapper
              .about-mobile__two-col__title А ещё, мы интегрировались
                br
                |  с Instagram!
              p.mobile-hidden Теперь ты можешь купить или сохранить
                br
                |  инстаграм-пост, оставив комментарий в ленте.
              div.about-mobile__two-col__at
                span @wantit
                | *
                |  купить товар через наш шопинг-чат
              div.about-mobile__two-col__at
                span @savetrend
                |  добавить в свою ленту трендов

            span.note *только посты с тегом #trendever
          .about-mobile__two-col__img
            .about-mobile__img-block.about-mobile__img-block__right
              img(src='img/iphone-2.png' alt='')
              .video.video-2(v-show="!isIOS || videoTwoPlayed", :class="{'played': videoTwoPlayed}")
                video(v-el:video-two, @click="pauseVideoTwo()", v-on:pause="videoTwoPlayed=false")
                  source(src="//cdn.trendever.com/videos/video_two.mp4" type="video/mp4")
                  source(src="//cdn.trendever.com/videos/video_two.webm" type="video/webm")
                  | Your browser does not support the video.
                a(href='#', @click="toggleVideoTwo()", v-show='!videoTwoPlayed').play-btn
                  i.ic-play-inverted

  .section.about-us
    .section__content
      .about-us__logo
        a(href='#')
          img(src='img/about-us-logo.png' alt='' itemprop="contentUrl")
      p Поможет найти и купить тренды
        br
        |  без наценки из первых рук!
      a(v-link='{ name: "home" }').btn-yellow.btn-yellow__m Перейти на сайт
      p Превращаем Instagram-шопинг в удовольствие.

  .section.inform-item.footer
    .section__content
      .inform-item__top-block.inform-item__bg-turquoise
        .vertical-align-wrapper
          p У тебя свой бренд?
            br
            |  Хочешь продаваться у нас?
          div( @click="onBuyPromoProduct()").btn-yellow.btn-yellow__m
            | Узнай как

</template>
<script type="text/babel">
  import { Swipe, SwipeItem } from 'vue-swipe';
  import settings from 'settings'
  import { browser } from 'utils'
  import { setCallbackOnSuccessAuth } from 'vuex/actions';
  import { createLead } from 'vuex/actions/lead';
  import { isAuth } from 'vuex/getters/user.js';
  import * as leads from 'services/leads';

  import mainVideo from 'base/main-video/index.vue';

  export default {
    data(){
      return {
        videoOnePlayed: false,
        videoTwoPlayed: false
      }
    },

    computed: {
      isIOS(){
        return browser.ipad && browser.iphone && browser.ipod
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

    methods: {
      pauseVideoOne(){
        if ( this.videoOnePlayed ) {
          this.$els.videoOne.pause()
        }
      },
      toggleVideoOne() {
        this.videoOnePlayed = true;
        this.$els.videoOne.play()
      },
      pauseVideoTwo(){
        if ( this.videoTwoPlayed ) {
          this.$els.videoTwo.pause()
        }
      },
      toggleVideoTwo() {
        this.videoTwoPlayed = true;
        this.$els.videoTwo.play()
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

    },

    components: {
      Swipe,
      SwipeItem
    }

  }
</script>
