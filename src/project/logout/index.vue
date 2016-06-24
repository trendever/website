<template lang="jade">
scroll-component
  header-component(title='Выход')
  .section.main(style='margin-top: 140px')
    .section__content(style='text-align:center;')
      h1(style='font-size:32px;')
        | Вы успешно вышли

</template>

<script type='text/babel'>
  import ScrollComponent from 'base/scroll/scroll.vue'
  import HeaderComponent from 'base/header/header.vue'
  import { removeToken } from 'services/profile'
  import { isAuth } from 'vuex/getters/user.js';

  export default {
    ready() {
      if(this.isAuth){
        removeToken();
        location.replace('/')
      } else {
        this.$router.go( { name: 'signup' } );
      }
    },
    vuex:{
      getters:{
        isAuth
      }
    },
    components: {
      ScrollComponent,
      HeaderComponent,
    }
  }
</script>
