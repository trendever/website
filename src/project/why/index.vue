<style src='./style.pcss'></style>
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
        a(href='#')
          img(src='img/logo.svg' alt='')
      a(href='#').btn-yellow.btn-yellow__s Войти
  .section.top
    .section__content(v-el:main-video-cnt)
      iframe(src='https://www.youtube.com/embed/iNJdPyoqt8U',
            :width='mainVideoWidth', :height='mainVideoHeight',
            frameborder='0', webkitallowfullscreen,
            mozallowfullscreen, allowfullscreen)

    .arithmetic
      img(src='img/arithmetic.svg' alt ='')

  .section.inform-item
    .section__content
      .inform-item__top-block.inform-item__bg-img-red
        div.inform-item__title
          p Любишь искать и покупать
            br
            | что-то новенькое
            br
            | через Instagram?
      .inform-item__answer
        div.inform-item__title.inform-item__answer__title
          p Вот только среди
            br
            | множества товаров
            br
            | без категорий, отзывов и цен...
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
            | наши fashion-эксперты,
          span ...уже все сделали для тебя!

  .section.inform-item
    .section__content
      .inform-item__top-block.inform-item__bg-green
        div.inform-item__title
          ul.check-list
            li
              i.ic-checked
              Выбрали самое интересное
            li
              i.ic-checked
              Узнали все цены
            li Отсортировали по категориям
              i.ic-checked
            li
              i.ic-checked
              Проверили продавцов
          span Пара минут, и ты найдешь то, что нужно!
      .inform-item__answer
        div.inform-item__title.inform-item__answer__title
          p.with-padding Подписывайся
            br
            | на ленты Трендскаутов,
          span ...которые выбрали тренды не на продажу, а для себя.
            br
            | Любой тренд можно сохранить в ленту своих желаний.

  .section.inform-item
    .section__content
      .inform-item__top-block.inform-item__bg-yellow.gallery-about
        .gallery-about__slide
          .gallery-about__slide__img-block
              img(src='img/slide-img-1.png' alt='')
          .gallery-about__slide__title Christine
          .gallery-about__slide__theme Fashion & Beauty блогер
          .gallery-about__slide__text
            p «Мой мир - мое вдохновение, я люблю созерцать все самое прекрасное
              br
              | и передавать свои эмоции окружающим. Я родилась в Латвии
              br
              | и мой город диктует стиль моей жизни»

  .section.inform-item.about-mobile
    .section__content
      .inform-item__top-block.inform-item__bg-red
        .about-mobile__two-col
          .about-mobile__two-col__img
            .about-mobile__img-block
              img(src='img/iphone-1.png' alt='')
          .about-mobile__two-col__text
            .vertical-align-wrapper
              .about-mobile__two-col__title Шопинг твоих желаний
              p Теперь жми Купить и консультант
                br
                | ответит в шопинг-чате.
              p Весь заказ, включая оплату и доставку,
                br
                | в одном окошке чата.


  .section.inform-item.about-mobile
    .section__content
      .inform-item__top-block.inform-item__bg-gradient
        .about-mobile__two-col
          .about-mobile__two-col__text
            .vertical-align-wrapper
              .about-mobile__two-col__title А ещё, мы интегрировались
                br
                | с Instagram!
              p Теперь ты можешь купить или сохранить
                br
                |то, что понравилось, просто
                br
                | оставив комментарий в ленте.
              div
                span @wantit
                |  купить товар через наш шопинг-чат
              div
                span @savetrend
                |  добавить в свою ленту трендов
          .about-mobile__two-col__img
            .about-mobile__img-block.about-mobile__img-block__right
              img(src='img/iphone-2.png' alt='')

  .section.about-us
    .section__content
      .about-us__logo
        a(href='#')
          img(src='img/about-us-logo.svg' alt='')
      p Поможет найти и купить тренды
        br
        | без наценки из первых рук!
      a(href='#').btn-yellow.btn-yellow__m Перейти на сайт
      p Делаем шопинг в Instagram удовольствием.
        br
        | И делаем это бесплатно ;)

  .section.inform-item.footer
    .section__content
      .inform-item__top-block.inform-item__bg-turquoise
        .vertical-align-wrapper
          p У тебя свой бренд?
            br
            | Хочешь продаваться у нас?
          a(href='#').btn-yellow.btn-yellow__m Узнай как

</template>
<script>
  import listen from 'event-listener';
  import { ratioFit } from 'utils';
  import HeaderComponent from 'base/header/header.vue';

  export default {
    data(){
      return {
        mainVideoWidth: '',
        mainVideoHeight: '',
      }
    },

    beforeDestroy() {
      if (this.resizeEvent) {
        this.resizeEvent.remove();
      }
    },

    ready(){
      this.updateMainVideoSize();

      this.resizeEvent = listen(window, 'optimizedResize', this.updateMainVideoSize.bind( this ))
    },

    methods: {
      updateMainVideoSize(){
        let sizes = ratioFit(1050, 588,
                            this.$els.mainVideoCnt.offsetWidth,
                            588);
        this.mainVideoWidth = sizes.width;
        this.mainVideoHeight = sizes.height;
      },
    },

    components: {
      HeaderComponent
    }
  }
</script>
