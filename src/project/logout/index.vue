<template lang="jade">
.scroll-cnt
  header-component(title='Выход')
  .section.main(style='margin-top: 140px')
    .section__content(style='text-align:center;')
      h1(style='font-size:32px;')
        | Выйти

</template>

<script type='text/ecmascript-6'>
import HeaderComponent from 'base/header/header.vue'
import { removeToken } from 'services/profile'


export default {
    data: () => ({
    }),
    ready() {
      removeToken();
      this.$router.go({name: 'home'});
    },
    components: {
        HeaderComponent,
    }
}
</script>
