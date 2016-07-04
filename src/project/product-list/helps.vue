<style src='./styles/helps.pcss'></style>
<template lang="jade">
  .help-wrapper(v-if="isFirst")
    .help(v-show='firstShow', @click='changeHelpSlide()')
      .help__top
        .help-conteiner
          .help__top-round
          .help-text Это переключатель#[br]  вида ленты
      .help__bottom
        .help-conteiner
          .help-text Это главная лента.#[br] Прямо сейчас Трендскауты#[br] добавляют сюда новые шопинг-тренды
          .help__bottom-round

    .help(v-show='secondShow', @click='changeHelpSlide()')
      .help__big
        .help-conteiner
          .help-text Напишите, что ищете#[br] или выберите по категориям#[br] и характеристикам
          .help__big-round
    .attention(v-if='isFirst')
      p Для корректного отображения подсказок переверните устройство в портретную ориентацию

</template>

<script>
  export default {
    data() {
      return {
        isFirst: false,
        firstShow: true,
        secondShow: false
      }
    },

    methods: {
      changeHelpSlide() {
        if (this.firstShow && this.isFirst) {
          this.firstShow = false;
          this.secondShow = true;
        } else {
          this.secondShow = false;
          this.isFirst = false;
        }
      }
    }
  }
</script>
