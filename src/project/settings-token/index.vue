<template lang="jade">
.scroll-cnt
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

<script type='text/ecmascript-6'>
import HeaderComponent from 'base/header/header.vue'
import profile from 'services/profile'


export default {
    data: () => ({
      token: profile.token,
    }),
    ready() {
      this.$router.go({ name: 'settings-token', query: {'token': profile.token} });
    },
    components: {
        HeaderComponent,
    }
}
</script>
