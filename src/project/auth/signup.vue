<style src='./style.pcss'></style>
<template lang="jade">
scroll-component
  div
    .signup(:style='{ height: height }')
      .signup__close.__hello(@click='closePage'): i.ic-close
      .section
        .column-desktop-50.header(v-if="showTitleSlider")
          h1 Войдите и сможете
        .column-desktop-50.column-desktop-right(v-if="showTitleSlider")
          slider
        .column-desktop-50
          .bottom-container(:class='{"opened-key-board":!showTitleSlider}')
            validator(name='signup')
              .input-container
                .input.name
                  i.ic-insta-name
                  input(type='text',
                    autocomplete="off",
                    autocorrect="off",
                    autocapitalize="off",
                    spellcheck="false",
                    :class=' {error: errorLogin} ',
                    @focus='onFocusLogin',
                    @keydown.enter='sendSMS()',
                    v-validate:login='[ "required" ]',
                    v-model='login',
                    :placeholder='placeholder')
                  .input__clear-btn(
                    v-if='login',
                    @click='login = ""')
                    i.ic-close
                .input.phone
                  i.ic-mobile-phone
                  input(type='tel',
                    autocomplete="off",
                    autocorrect="off",
                    autocapitalize="off",
                    spellcheck="false",
                    :class=' {error: errorPhone} ',
                    @focus='onFocusPhone',
                    @keydown.enter='sendSMS()',
                    v-validate:phone='[ "phone", "required" ]',
                    v-model='phone',
                    placeholder='Введите номер телефона')
                  .input__clear-btn(
                    v-if='phone',
                    @click='phone = ""')
                    i.ic-close
            .btn-container
              button.btn.btn_primary.__orange.__xl.fast__big__btn.btn_fixed-bottom(
                :disabled='!$signup.valid',
                @click='sendSMS') Отправить sms-код
              .link-container
                a.link-bottom(href='#',
                  @click.prevent='onClickLink')
                  | {{{ textLink }}}
</template>

<style>
  html, body {
    height: 100%;
  }
</style>

<script type='text/babel'>
  import listen from 'event-listener';
  import {
    saveAuthData,
    signup,
  } from 'vuex/actions';
  import {
    authData,
  } from 'vuex/getters';
  import { isAuth } from 'vuex/getters/user.js';


  import store from 'vuex/store';
  import * as auth from 'services/auth';
  import { formatPhone } from 'utils.js';

  import ScrollComponent from 'base/scroll/scroll.vue'

  import Slider from './slider.vue';

  const TEXT_LINK = {
    instagramMode: 'Если нет Instagram',
    withoutInstagramMode: 'У меня есть Instagram',
    errorLoginLink: 'Мое имя кто-то занял!',
    errorLoginMesage: 'Имя занято, введите другое',
    errorPhoneFormat: 'Неверный формат номера',
    errorWrongCreditionals: '',
    errorloginLang: 'Неверный формат логина'
  }

  const PLACEHOLDER = {
    instagramMode: 'Введите свое Instagram имя',
    withoutInstagramMode: 'Введите свое имя',
    errorPhoneFormat: 'Введите номер +7XXXXXXXXXX',
    errorLoginFormat: 'Только латинские буквы...'
  }

  export default {
    data(){
      return {
        login: '',
        phone: '',
        errorLogin: false,
        errorPhone: false,
        height: 'static',
        textLink: TEXT_LINK.instagramMode,
        placeholder: PLACEHOLDER.instagramMode,
        instagram: true,
        showTitleSlider: true
      }
    },

    route: {
      canActivate({abort}){
        // if (isAuth(store.state)) {
        //   abort();
        // }
        return true;
      }
    },

    ready() {
      this.$set('height', `${ document.body.scrollHeight }px`);
      this.phone = this.authData.phone;
      this.login = this.authData.username;
      this.instagram = this.authData.instagram;
      const onResize = () => {
        this.$set('height', `${ document.body.scrollHeight }px`);
        this.$set('showTitleSlider', document.body.scrollHeight >= 1000 || document.body.scrollWidth > 750);
      };
      this.resize = listen( window, 'resize', onResize );
      onResize();
    },
    beforeDestroy(){
      this.resize.remove();
    },
    vuex: {
      actions: {
        saveAuthData,
        signup,
      },
      getters: {
        authData,
        isAuth,
      }
    },

    methods: {
      closePage() {
        mixpanel.track('Close Signup Page');
        this.save();

        if (window.history.length > 2) {
          this.$router.go(window.history.back());
        } else {
          this.$router.go({name: 'home'});
        }
      },

      save() {
        this.saveAuthData({
          username: this.login,
          phone: this.phone,
          instagram: this.instagram,
        })
      },

      sendSMS() {
        if (!this.$signup.valid) {
          return;
        }

        if(this.login.match(/[а-яё]+/g) !== null){
          this.login = '';
          this.errorLogin = true;
          this.textLink = TEXT_LINK['errorloginLang'];
          this.login = PLACEHOLDER['errorLoginFormat'];
          return;
        }

        this.save();

        this.signup().then( ()=> {
          this.$router.go({ name: 'comfirm-sms' });
        }).catch( (error) => {
          this.onErrorPhone();
        })
      },

      onErrorPhone() {
        this.phone = '';
        this.errorPhone = true;
        this.textLink = TEXT_LINK['errorPhoneFormat'];
        this.phone = PLACEHOLDER['errorPhoneFormat'];
      },

      // remove error class from <input> phone
      onFocusPhone() {
        if (this.errorPhone) {
          this.errorPhone = false;
          this.textLink = '';
          this.phone = '';
        };
      },

      onErrorLogin() {
        this.$set('login', TEXT_LINK['errorLoginMesage']);
        this.$set('errorLogin', true);
        this.$set('textLink', TEXT_LINK['errorLoginLink']);
      },

      // clear login and remove error class from <input>
      onFocusLogin() {
        if (this.$get('errorLogin')) {
          this.$set('errorLogin', false);
          this.$set('login', '');
          this.$set('textLink', '');
        };
      },

      // change to hint text
      onClickLink() {
        this.instagram = !this.instagram;
        var toggleClassBlock = document.querySelector('.input.name i'); // TODO Сделай чезе v-el или v-ref
        if(toggleClassBlock !== null){
          if (!this.instagram) {
            this.textLink = TEXT_LINK.withoutInstagramMode;
            this.placeholder = PLACEHOLDER.withoutInstagramMode;
            // TODO Классы тоже можно вешать через vue
            toggleClassBlock.classList.remove('ic-insta-name');
            toggleClassBlock.classList.add('ic-user');
          } else {
            this.textLink = TEXT_LINK.instagramMode;
            this.placeholder = PLACEHOLDER.instagramMode;
            toggleClassBlock.classList.remove('ic-user');
            toggleClassBlock.classList.add('ic-insta-name');
          }
        }
      }
    },

    components: {
      ScrollComponent,
      Slider,
    },
  }
</script>
