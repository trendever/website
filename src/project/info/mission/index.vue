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
    header-component(
      title='Почему Trendever?',
      show_on_elem='headerAnchor',
      :back-link='{name: "home"}')

    .section.top.why(style='width: 750px; margin: 0 auto;')
      .section.available#headerAnchor
        .section__content
          .available__title.green Почему мы это делаем?
          img.intro-hero__img(src=global_brands alt='')

      .section.free
        .section__content
          .free__title Мы за свободный шопинг,
          .free__text ...когда ничего не мешает найти свой тренд и купить его из первых рук. #[br] Больше не нужно покупать то, #[br] что навязывают торговые сети #[br] и глобальные бренды.
          .free__img: img(src=free_shopping alt='')

      .section.why
        .section__content.why__content
          .why__title
            | Поэтому мы фанаты
            .why__title__inner Instagram,
          .why__inner
            .why__inner__img: img(src=fans alt='' width='455' height='630')
            .why__inner__text
              .why__inner__text__item.why__inner__text__item_position_one где каждый
              .why__inner__text__item.why__inner__text__item_position_two сам
              .why__inner__text__item.why__inner__text__item_position_three выбирает
              .why__inner__text__item.why__inner__text__item_position_four тренды.

      //- .section.list
        .section__content
          .list__title ..а шопинг-тренды выбирайте в Trendever:
          .list__body
            .list__item
              .list__item__left: .list__item__number 1
              .list__item__right
                .list__item__text
                  .list__item__text__green Ленты trendовых товаров,*
                  | отбираемых стилистами #[br] и модницами (такими же как вы ;)

            .list__item
              .list__item__left
                .list__item__number 2
              .list__item__right
                .list__item__text
                  .list__item__text__green Покупка прямо в инстаграме
                  | товаров с тегом #trendever

            .list__item
              .list__item__left
                .list__item__number 3

              .list__item__right
                .list__item__text
                  .list__item__text__green Чат-платформа**
                  | для общения с магазинами #[br] и заказа без посредников

            .list__text *дизайнерская одежда, обувь, модные аксессуары, мебель, арт, утварь, авторская кухня и многое другое
            .list__text **сейчас на базе email, скоро mobile messenger, voicecall, videocall
          .list__bottom
            .list__how.main__link(v-link='{name: "guide"}') Узнайте как
      .section.available
        .section__content
          .available__title Доступно #[br] всем магазинам
          .available__text Социальные сети, электронные #[br] денежные переводы и современная логистика...
          .available__img: img(src=all_shops alt='')
          .available__text ...позволяют любому производителю или продавцу организовать витрину товаров в&nbsp;инстаграме, онлайн оплату и&nbsp;доставку в&nbsp;любую точку мира.
          .available__text.__last Мы помогаем инстаграм-магазинам найти больше клиентов.

      .section.available.__text-center
        a(
          v-link='{name: "info", params: {type: "for_shop"}}')
            button(class='btn btn_primary __orange __xl hello__btn fast__big__btn') Оставьте заявку

      .section.focus
        .section__content
          .focus__title Фокус на главном
          .focus__text Дизайнеры и&nbsp;производители больше не&nbsp;нуждаются в&nbsp;посредниках, торговых точках и&nbsp;сложном маркетинге.
          .focus__img: img(src=focus alt='')
          .focus__text В Trendever поставщик сосредоточен только на том, что важно клиенту: качестве товара, фотографиях #[br] и сервисе.

      .section.together
        .section__content
          .together__title
            span Bместе нам проще быть стильными и делать покупки по&nbsp;честной цене.
          .together__img: img(src=earth alt='')
          .together__text Давайте вместе делать мир ярче!
          //- .available.__text-center
            a.btn.btn_primary.__inverse.__xl(
              href='#') Присоединяйтесь
          .__text-center
            a.together__tomain.main__link(v-link='{name: "home"}')
              button(class='btn btn_primary __orange __xl hello__btn fast__big__btn') На главную

</template>

<script>
  import HeaderComponent from 'base/header/header.vue';

  export default {
    components: {
      HeaderComponent
    }
  }
</script>
