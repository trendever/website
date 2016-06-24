<template lang="jade">
scroll-component
  header-component(title='Токен авторизации')
  .section.main(style='margin-top: 110px')
    .section__content(style='text-align:center;')
      div(style='width: 500px; margin: 50px auto;font-size: 28px; color: #eb2836;')
        | Осторожно! Никому не сообщайте информации с этой страницы.
      div(style='width: 500px; margin: 30px auto;font-size: 24px; color: #595959;')
        | Скопируйте адрес страницы #[br] или этот токен:
      div(style='word-wrap:break-word; width: 500px; margin: 30px auto;')
        | {{ token }}

</template>

<script type='text/babel'>
  import ScrollComponent from 'base/scroll/scroll.vue'
  import HeaderComponent from 'base/header/header.vue';

  import { getProfile } from 'services/profile';
  import { isAuth } from 'vuex/getters/user.js';

  export default {
    data(){
      return {
        token: getProfile().token
      }
    },
    ready() {
      if ( this.isAuth ) {
        this.$router.go(
          {
            name: 'settings-token',
            query: {
              'token': getProfile().token
            }
          }
        );
      } else {
        this.$router.go( { name: 'signup' } );
      }
    },
    vuex: {
      getters: {
        isAuth
      }
    },
    components: {
      ScrollComponent,
      HeaderComponent,
    }
  }
</script>
