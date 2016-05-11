<template lang="jade">
.sk-fading-circle(:style='style')
  .sk-circle1.sk-circle
  .sk-circle2.sk-circle
  .sk-circle3.sk-circle
  .sk-circle4.sk-circle
  .sk-circle5.sk-circle
  .sk-circle6.sk-circle
  .sk-circle7.sk-circle
  .sk-circle8.sk-circle
  .sk-circle9.sk-circle
  .sk-circle10.sk-circle
  .sk-circle11.sk-circle
  .sk-circle12.sk-circle
  </div>
</template>

<style lang="sass">
  // http://tobiasahlin.com/spinkit/

  $spinkit-size: 40px !default;

  .sk-fading-circle {
    $circleCount: 12;
    $animationDuration: 1.2s;

    width: $spinkit-size;
    height: $spinkit-size;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .sk-circle {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }

    .sk-circle:before {
      content: '';
      display: block;
      margin: 0 auto;
      width: 15%;
      height: 15%;
      background-color: currentColor;
      border-radius: 100%;
      animation: sk-circleFadeDelay $animationDuration infinite ease-in-out both;
    }

    @for $i from 2 through $circleCount {
      .sk-circle#{$i} { transform: rotate(360deg / $circleCount * ($i - 1)); }
    }

    @for $i from 2 through $circleCount {
      .sk-circle#{$i}:before { animation-delay: - $animationDuration + $animationDuration / $circleCount * ($i - 1); }
    }

  }
  // ToDo conflict with ShowMore btn in product-list
  // @keyframes sk-circleFadeDelay {
  //   0%, 39%, 100% { opacity: 0 }
  //   40% { opacity: 1 }
  // }
</style>

<script>
  export default {
    props: {
      color: { default: 'black' },
      size:  { default: 40 },
    },
    computed: {
      style() {
        var color = `color: ${this.color}`;
        var width = `width: ${this.size}px`;
        var height = `height: ${this.size}px`;

        return `${color}; ${width}; ${height};`;
      },
    },
  }
</script>
