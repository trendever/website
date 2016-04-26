<style src='./style.pcss'></style>
<template lang="jade">

-
  helloTop = '/static/img/hello-top.svg'
  helloBottom = '/static/img/hello-bottom.svg'

div
  .hello.__subscribe.__hello.section__content
    .hello__subscribe-container.__hello
      .hello__row-top.__hello
        .section.__text-center: img.hello-image.__top(src=helloTop alt="")
      .hello__row-content
        .section
          h1 Вы один из первых #[br] гостей нашей #[br] инста-гардеробной
        .section
          p Это прототип мобильного сайта #[span.orange Trendever.com] ― сервиса, который упрощает шопинг в Instagram.
          //- p Пока работает только живая лента инста-трендов, но это уже увлекательно. #[span.span.emoji.emoji_light]Скоро добавим фильтрацию и поиск по каталогу, и&nbsp;еще много чего#[span.span.emoji.emoji_smile].
          p Круто, что весь ассортимент отбирается вручную инста-модницами "под себя", а не на продажу#[span.emoji.emoji_fing].
          p Попробуйте полистать ленту трендов. Как вам сайт? #[br] Обойдемся только мобильной версией? Напишите, что думаете на #[a.orange(href="mailto:hello@trendever.com") hello@trendever.com]
        .section.hello__subscribe.__btn-container
          button.btn.btn_primary.__orange.__xl.hello__btn(
            @click="closePage") Ладно, показывайте!

      .hello__row-bottom
        .section.__text-center
          img.hello-image.__bottom(src=helloBottom alt="")
</template>

<script>
  import profile from 'services/profile'
  import {
    showPopupSignup,
    showPopupFastSignup,
    hidePopupFastSignup,
  } from 'vuex/actions';

  export default {
    data: () => ({
      prevPath: null,
    }),

    route: {
      data(transition) {
        console.log(transition);
      },
      canActivate({abort}) {
        if (profile.isFirstVisit || window.__debugMode) {
          return true;
        }

        abort();
      },
      activate(transition) {
        var imageHelloTop = new Image();
        var imageHelloBottom = new Image();

        imageHelloTop.onload = () => {
          imageHelloTop = null;
          if (!imageHelloBottom) { transition.next(); }
        };

        imageHelloBottom.onload = () => {
          imageHelloBottom = null;
          if (!imageHelloTop) { transition.next(); }
        };

        imageHelloTop.src = '/static/img/hello-top.svg';
        imageHelloBottom.src = '/static/img/hello-bottom.svg';
      },
    },

    vuex: {
      actions: {
        showPopupSignup,
        showPopupFastSignup,
        hidePopupFastSignup
      }
    },

    created() {
      this.hidePopupFastSignup();
    },

    methods: {
      closePage() {
        mixpanel.track("Close Hello Page");

        // this.trySubscribe();
        if (window.history.length > 2) {
          window.history.back();
          window.history.back();
        } else {
          this.$router.go({name: 'home'});
        }
      },
      // trySubscribe() {
      //   // if not try subscribed, do it after 30s
      //   if (!profile.subscribe_at) {
      //     setTimeout( () => {
      //       this.$router.go({name: 'subscribe'});
      //     }, 30*1000);
      //   }
      // }
    },

    destroyed() {
      this.showPopupFastSignup();
    },
  }
</script>
