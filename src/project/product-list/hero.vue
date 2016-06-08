<style src='./styles/hero.pcss'></style>
<template lang="jade">
.section.smallHero(v-if='isAuth')
  a(v-link='{ name: "mission" }')
    i.smallHero__logo
      img(src='img/logo-beta.svg')
.section.hero(v-if='!isAuth')
  .section__content.hero__content
    .hero__content__img

    .profile-header
      .profile-header__center
        a(href='https://www.fb.com/trendevercom', class='profile-header__center__ic')
          i(class='ic-facebook-icon')
        a(href='https://www.instagram.com/trendevercom', class='profile-header__center__ic')
          i(class='ic-instagram-new-icon')
        a(href='https://vk.com/trendever', class='profile-header__center__ic')
          i(class='ic-vkontakte-icon')
      .profile-header__menu
        .profile-header__menu-btn
          .profile-header__menu-btn-label
          .profile-header__menu-btn-icon(v-on:click='menuOpened=true')
        .profile-header__menu-links(v-show='menuOpened')
          a(class='profile-header__menu-link profile-header__close-menu', v-on:click='menuOpened=false') Отмена
          a(class='profile-header__menu-link',
           v-link='"for_customer" | linkToInfo') Покупателям
          a(class='profile-header__menu-link',
            v-link='"for_shop" | linkToInfo') Магазинам
          a(class='profile-header__menu-link',
            v-link='"for_blogger" | linkToInfo') Блогерам
          a(class='profile-header__menu-link',
            v-link='{name: "mission"}') Наша миссия
          a(class='profile-header__menu-link',
            v-link='{name: "agreement"}') Условия
          //- a(class='profile-header__menu-link', href='#') Отмена

    .hero__content__logo
    .hero__content__description Шопинг в Instagram стал проще
      span(v-on:click='scrollAnchor()').scroll-to-anchor
</template>
<script type='text/babel'>
  import { isAuth } from 'vuex/getters/user.js';
    export default {
      data(){
        return {
          menuOpened: false
        }
      },

      ready() {
        this.scrollCnt = document.querySelector('.scroll-cnt');
        this.closeMenu(this);
      },

      methods: {
        closeMenu(test) {
          document.body.addEventListener('click', function (e) {
            if (e.target === document.querySelector('.profile-header__menu-btn-icon')) return;

            if (e.target.parentNode !== document.querySelector('.profile-header__menu-links')){
              test.menuOpened = false;
            }
          });
        },

        scrollAnchor() {
          var block = document.querySelector("#how-it-work");
          if(block !== null){
            var scrollBlock = this.scrollCnt;

            if (!timer) {
              var timer = setInterval(function () {
                if (block.getBoundingClientRect().top < 80){
                  clearInterval(timer);
                }
                scrollBlock.scrollTop = scrollBlock.scrollTop + 30;
              }, 20);
            }
          }
        }
      },

      vuex: {
          getters: {
              isAuth,
          },
      },

      filters: {
        linkToInfo(type) {
          return {
            name: 'info',
            params: {type},
          }
        },
      },
    };
</script>
