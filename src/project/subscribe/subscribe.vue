<style src="./style.pcss"></style>
<template lang="jade">

- subscribe = '/static/img/hello-subscribe.svg'

div
  .hello.__subscribe.section__content
    .hello__subscribe-container
      .info__close.__hello(@click="closePage"): i.ic-close
      .hello__row-top
        .section.__text-center
          img.hello-image.__subscribe(src=subscribe alt="")
      .hello__row-content
        .section
          h1 Нам очень нужна #[br] ваша поддержка,
        .section
          p ...чтобы сделать шопинг в инсте #[br] таким же удобным, как в магазине.
          p(style="margin-bottom: 20px") Просим ваш email. Обещаем писать #[br] редко и интересно ― no spam #[span.span.emoji.emoji_nospam].
        validator(v-if="showForm", name="question")
          .section.input(style="margin-bottom: 50px")
            input(
              type="email",
              v-model="email",
              v-validate:email="[ 'email' ]",
              placeholder="Введите свой email")
            .input__clear-btn(
              v-show="email.length"
              @click="email=''")
              i.ic-close

          .section.hello__subscribe.__btn-container(style="padding-bottom: 40px")
            button.btn.btn_primary.__orange.__xl.hello__btn(
              :disabled="!$question.valid",
              @click="subscribe") Поддержать
            .hello__btn__container: a.btn.hello__btn(@click="closePage") Не сейчас

        .section.hello__subscribe-(
          v-if="showSpinner",
          style="margin: 160px 0; position: relative")
          tr-spinner(color="white" size=60)

        .section.hello__subscribe-(
          v-if="showThanks",
          style="margin-bottom: 40px")
          p(style="margin: 80px 0;") Спасибо!
          button.btn.btn_primary.__orange.__xl.hello__btn(
            @click="closePage") Продолжить

</template>

<script>
  import profile,  { setSubscribeEmail } from 'services/profile'
  import trSpinner from 'base/spinner/spinner.vue'

  export default {
    data: () => ({
      email: '',
      showForm: true,
      showSpinner: false,
      showThanks: false,
    }),

    created() {
      this.$dispatch('show:popup:signup', false);
      this.$dispatch('show:popup:fast-signup', false);
    },

    route: {
      canActivate({abort}) {
        if (!profile.subscribe_at || window.__debugMode) {
          return true;
        }

        abort();
      },
      activate(transition) {
        var image = new Image();
        image.onload = () => {
          image = null;
          transition.next();
        };
        image.src = '/static/img/hello-subscribe.svg';
      },
    },

    methods: {
      subscribe() {
        var type = 'subscribe';
        var email = this.$get('email');
        mixpanel.track("Subscribed", {email: email});
       // createQuestion.call(this, {type, email});
        setSubscribeEmail(true);
      },
      closePage() {
        mixpanel.track("Close Subscribe Page");

        setSubscribeEmail(false);

        if (window.history.length > 2) {
          window.history.back();
        } else {
          this.$router.go({name: 'home'});
        }
      },
    },

    events: {
      ['hide:question']() {
        this.$set('showForm', false);
        this.$set('showSpinner', true);
      },
      ['show:thanks']() {
        this.$set('showSpinner', false);
        this.$set('showThanks', true);
        setTimeout(this.closePage, 3000);
      },
      ['show:error']() {
        this.$set('showSpinner', false);
        this.$set('showForm', true);
      },
    },
    components: {
      trSpinner,
    }
  }
</script>
