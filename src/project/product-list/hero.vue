<style src="./styles/hero.pcss"></style>
<template lang="jade">
.section.smallHero(v-if="isAuth")
  a(v-link="{ path: '/why' }")
    i.smallHero__logo.ic-logo
        i.smallHero__logo-apostrophe
.section.hero(v-if="!isAuth")
  .section__content.hero__content
    .hero__content__img

    .profile-header
      .profile-header__center
        a(href="https://www.fb.com/trendevercom", class="profile-header__center__ic")
          i(class="ic-facebook-icon")
        a(href="https://www.instagram.com/trendevercom", class="profile-header__center__ic")
          i(class="ic-instagram-icon")
        a(href="https://vk.com/trendever", class="profile-header__center__ic")
          i(class="ic-vkontakte-icon")
      .profile-header__menu
        .profile-header__menu-btn
          .profile-header__menu-btn-label
          .profile-header__menu-btn-icon
        .profile-header__menu-links
          a(class="profile-header__menu-link",
           v-link="'for_customer' | linkToInfo") Покупателям
          a(class="profile-header__menu-link",
            v-link="'for_shop' | linkToInfo") Магазинам
          a(class="profile-header__menu-link",
            v-link="'for_blogger' | linkToInfo") Блогерам
          a(class="profile-header__menu-link",
            v-link="{name: 'why'}") Наша миссия
          a(class="profile-header__menu-link",
            v-link="{name: 'agreement'}") Условия
          //- a(class="profile-header__menu-link", href="#") Отмена

    .hero__content__logo.ic-logo
    .hero__content__description Шопинг в Instagram стал проще
</template>
<script type="text/babel">
    import { isAuth } from 'vuex/getters';
    export default {
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
