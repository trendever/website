<template lang="jade">
.scroll-cnt
  header-component(title='Страница не существует')
  .section.main(style='margin-top: 140px')
    .section__content(style='text-align:center;')
      h1(style='font-size:32px; margin-bottom: 48px')
        | Возможно вы попали сюда случайно, либо страница и правда не существует.
      a(v-link='{name: "home"}')
        button(class='btn btn_primary __orange __xl fast__big__btn') На главную

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
