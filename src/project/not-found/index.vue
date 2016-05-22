<template lang="jade">
.scroll-cnt
  header-component(title='Страница не существует')
  .section.main(style='margin-top: 140px')
    .section__content(style='text-align:center;')
      h1(style='font-size:32px;')
        | Возможно вы попали сюда случайно, либо страницы и правда не существует.

</template>

<script>
import HeaderComponent from 'base/header/header.vue'

export default {
  data: () => ({
  }),
  components: {
    HeaderComponent
  }
}
</script>
