<style src='./style.pcss'></style>
<template lang="jade">
.section.header.u-fixed
  .section__content.header__content
    .header__arrow(v-if='isAuth', @click='goBack()')
      i.header__arrow__ic.ic-arrow-left
    div(v-bind:class="{ 'center': isAuth}").header__logo
      a(v-link='{ name: "home" }')
        img(src='../../base/img/logo-main.svg' alt='')
    a(href='#'
      v-if="!isAuth"
      v-link='{ name: "signup" }').btn-yellow.btn-yellow__s Войти

.vertical-slider
  .vertical-slider-content(v-el:scroll-slider)
    .vertical-slider-section.v-slide1.vertical-middle(v-bind:style="{ height: height }", v-el:blur-block)
      .blur-img
      .vertical-slider-text Привет!#[br] Мы приготовили для тебя#[br] кое-что интересное…
    .vertical-slider-section.v-slide2.vertical-middle(v-bind:style="{ height: height }")
      .vertical-slider-text Хочешь работать#[br] и получать от этого удовольствие?
    .vertical-slider-section.v-slide3.vertical-middle(v-bind:style="{ height: height }")
      .vertical-slider-text Тогда у тебя есть все шансы#[br] получить работу в Trendever#[br] и
        span.font-l  100000
        |  рублей#[br] на рекламу у блогеров.
    .vertical-slider-section.v-slide4.vertical-middle(v-bind:style="{ height: height }")
      .vertical-slider-text
        p.swipe-header Для участия в конкурсе тебе достаточно#[br]  выполнить несколько простых действий
        swipe.contest-swipe
          swipe-item.slide1
            a(v-link='{name: "signup"}').img-block
            p Зарегестрируйся#[br]  на trendever.com
          swipe-item.slide2
            a(href='http://www.trendever.com/cosinessshades/').img-block
            p Наполни свою ленту#[br]  стильными вещами
          swipe-item.slide3
            .img-block
            p Отметь своих самых#[br]  трендовых друзей#[br]  под афишей о конкурсе#[br]  в нашем инстаграме

    .vertical-slider-section.v-slide5.vertical-middle(v-bind:style="{ height: height }")
      .vertical-slider-text
        p Уже не терпится#[br]  проверить свои силы?
        span Тогда скорее#[br] регистрируйся :)
        a(v-link='{name: "signup"}').btn.btn-transparent-white Войти

  .attention
    p Для корректного отображения#[br] переверните устройство в портретную ориентацию


</template>
<script type="text/babel">
  import { isAuth } from 'vuex/getters/user.js';
  import { Swipe, SwipeItem } from 'vue-swipe';

  export default {
    data() {
      return {
        height: document.documentElement.clientHeight - 50 + 'px',
        currentSlide: 0
      }
    },

    vuex: {
      getters: {
        isAuth
      }
    },

    ready() {
      this.animateScroll();
      this.startBlur();
    },

    methods: {
      goBack(){
        history.back();
      },

      startBlur() {
        var block = this.$els.blurBlock;
        setTimeout(function () {
          block.classList.add('blur');
        },500);
      },

      animateScroll() {
        var isAnimate = false;
        var element = this.$els.scrollSlider;
        var $this = this;

        function chengeHeightOnResize() {
          window.onresize = function(event) {
            $this.height = document.documentElement.clientHeight - 50 + 'px';
            element.style.transform = element.style.webkitTransform = 'translateY(' + (-$this.currentSlide
              * $this.height.replace(/px/, '')) + 'px)';
          };
        }
        chengeHeightOnResize();

        // onwheel events
        if ('onwheel' in document) {
          element.addEventListener("wheel", onWheel);
        } else if ('onmousewheel' in document) {
          element.addEventListener("mousewheel", onWheel);
        }  else {
          element.addEventListener("MozMousePixelScroll", onWheel);
        }

        // swipe event
        document.addEventListener('touchstart', handleTouchStart, false);
        document.addEventListener('touchmove', handleTouchMove, false);
        var xDown = null;
        var yDown = null;

        function handleTouchStart(evt) {
          xDown = evt.touches[0].clientX;
          yDown = evt.touches[0].clientY;
        };

        function handleTouchMove(evt) {
          if ( ! xDown || ! yDown ) {
            return;
          }

          var xUp = evt.touches[0].clientX;
          var yUp = evt.touches[0].clientY;

          var xDiff = xDown - xUp;
          var yDiff = yDown - yUp;

          if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
            return;
          } else {
            if ( yDiff > 0 ) {
              onWheel(null, 'top');
            } else {
              onWheel(null, 'down');
            }
          }
          /* reset values */
          xDown = null;
          yDown = null;
        };

        function onWheel(e, direction) {
          if(isAnimate) return;
          e = e || window.event;
          e.preventDefault ? e.preventDefault() : (e.returnValue = false);
          var delta = e.deltaY || e.detail || -(e.wheelDelta);
          if (direction === 'top' || delta > 0) {
            if ($this.currentSlide >= 4) return;
            isAnimate = true;
            $this.currentSlide++;
            var size = -($this.height.replace('px', '') * $this.currentSlide);
            element.style.transform = element.style.webkitTransform = 'translateY(' +  size + 'px)';
          } else {
            if($this.currentSlide <= 0) return;
            isAnimate = true;
            $this.currentSlide--;
            var size = -($this.height.replace('px', '') * $this.currentSlide);
            element.style.transform = element.style.webkitTransform = 'translateY(' + (size) + 'px)';
          }

          // Время должно соответствовать времени CSS transition
          // Предотвращает запуск скролла пока не закончилась предыдущая анимация
          setTimeout(function () {
            isAnimate = false;
          }, 700);
        }
      }
    },

    components: {
      Swipe,
      SwipeItem
    }
  }
</script>
