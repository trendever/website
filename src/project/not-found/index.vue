<style src='./not-found.pcss'></style>
<template lang="jade">
.scroll-cnt
  .not-found
    .not-found__container
      .not-found__wrapper
        .not-found__img
          img(src='img/404.png')
        .not-found__clip
          .not-found__text
            .not-found__text__wrap
              Страницу похитили...
              span но&nbsp;
                a(v-link='{name: "home"}')главная страница
                | &nbsp;осталась


</template>

<script>

export default {
  data: () => ({
  })
}
</script>
