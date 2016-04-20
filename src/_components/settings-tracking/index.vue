<template lang="jade">
div
  header-component(title="Настройка отслеживания")
  .section.main(style="margin-top: 140px")
    .section__content(style="text-align:center;")
      h1(style="font-size:32px;")
        | Отслеживание статистики отключено

</template>

<script type="text/ecmascript-6">
import HeaderComponent from 'base/header/header.vue'
import profile from './../../services/profile'


export default {
    data: () => ({
    }),
    ready: function () {
        window.mixpanel.register({"$ignore": "true"});
    },
    components: {
        HeaderComponent,
    }
}
</script>
