<style src="./footer.pcss"></style>
<template lang="jade">
footer.section.footer
  .section__content.footer__content

    // BEGIN footer__content__links
    .footer__content__links
      a.footer__content__link.link(
        v-link="'for_blogger' | linkToInfo") Блогерам
      a.footer__content__link.link(
        v-link="'for_customer' | linkToInfo") Покупателям
      a.footer__content__link.link(
        v-link="'for_shop' | linkToInfo") Магазинам
      a.footer__content__link.link(
        v-link="{name: 'agreement'}") Условия
    // END footer__content__links

    .footer__content__copyright © Trendever {{ year }}
</template>

<script>
  export default {
    computed: {
      year() {
        return new Date().getFullYear()
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
  }
</script>
