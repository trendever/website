<template>
  <div class="desktopLayout">

    <div class="product" v-el:root>

      <div class="leftSide" v-bind:style="leftSide">
        <picture :img="'http://vsenovoe.info/wp-content/images/2014/03/BMW-R1200S.jpg'"></picture>
      </div>

      <div class="rightSide" v-bind:style="rightSide">

        <div class="userAndProducts">
          <user-info
            img="'http://vsenovoe.info/wp-content/images/2014/03/BMW-R1200S.jpg'"
            code="111112223333"
            name="33333333334445345345"
            last-update="1 день"
          ></user-info>
          <template v-for="product of products">
            <products
              :name="product.name"
              :price="product.price"
              :old-price="product.oldPrice"
            ></products>
          </template>
          <buttons></buttons>
        </div>
      </div>

    </div>

  </div>
</template>

<style src="./style.pcss" scoped lang="postcss"></style>

<script type="text/babel">

  import picture from '../picture/index.vue';
  import userInfo from '../user-info/index.vue';
  import products from '../products/index.vue';
  import buttons from '../buttons/index.vue';
  import listener from 'event-listener';

  export default {
    props: {
      products: {
        type: Array,
        default: []
      },
    },
    ready(){

      const resize = () => {

        const { clientWidth } = this.$els.root;

        if ( offsetWidth => 750 ) {

          console.log(clientWidth);

          this.$set( 'leftSide.width', `${clientWidth * 0.6}px` );
          this.$set( 'rightSide.width', `${clientWidth * 0.4}px` );

        }

      };

      this.layoutResize = listener( window, 'optimizedResize', resize );

      resize();

    },
    beforeDestroy(){
      this.layoutResize.remove();
    },
    data(){
      return {
        leftSide: {
          width: '100px'
        },
        rightSide: {
          width: '100px'
        }
      }
    },
    components: {
      picture,
      userInfo,
      products,
      buttons
    }
  }
</script>
