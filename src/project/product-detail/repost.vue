<style src='./repost.pcss'></style>
<template lang="jade">
scroll-component
  .repost(:style='{height: "100%"}')
    .repost__close(@click='back'): i.ic-close
    .crop
      img(:src='igImageUrl')
      .repost_header
        h1 Пост в Instagram
    .step.step_1
      .title
        .circle: p 1
        span Сохраните фотографию

      .step_cnt
        .action
          .pict
            img(:src='igImageUrl')
          img.tap(src='img/tap_white.png')
        p Нажмите на фото#[br] #[span.emoji.emoji_fingleft] здесь слева#[br]и удерживайте,#[br]чтобы сохранить

    .step.step_2
      .title
        .circle: p 2
        span Затем скопируйте подпись

      .step_cnt
        .action
          .pict(v-on:copy='addInfo')
            span {{{ caption }}}
          .tail
          img.tap(src='img/tap_grey.png')
        p(
          unselectable='on',
          onselectstart='return false;',
          onmousedown='return false;') Нажмите на текст #[br] #[span.emoji.emoji_fingleft] здесь слева#[br]и удерживайте,#[br] чтобы скопировать

    .footer
      p Нажмите 'Продолжить',#[br]чтобы открыть Instagram#[br]и вставить фото с текстом
      a(href="instagram://camera", target="_blank", class='btn btn_primary __orange __xl fast__big__btn btn_fixed-bottom') Продолжить
</template>

<script type="text/babel">

  import { urlThumbnail } from 'utils'
  import { getOpenedProduct } from 'vuex/getters/products';
  import { openProduct } from 'vuex/actions/products';

  import ScrollComponent from 'base/scroll/scroll.vue'

  export default {
    data(){
      return {
        id: ''
      }
    },

    components: {
      ScrollComponent,
    },

    route: {
      activate( { to: { params: { id } } } ) {
        return this.openProduct( +id ).catch( error => {
          this.$route.router.go( { name: '404' } );
        } )
      },
    },

    vuex: {
      actions: {
        openProduct,
      },
      getters: {
        getOpenedProduct,
      },
    },
    computed: {
      caption() {
        if ( this.getOpenedProduct !== null ) {
          var source = this.getOpenedProduct.instagram_image_caption;
          if ( !source ) return;
          source = source.replace( /([^0-9a-zа-я\s])/ig, ' ' ).replace( /\s{2,}/g, ' ' );
          // need part of text for bubble
          source = source.slice( 0, 80 );
          source = source.replace( /[.,\/#!\'\"$%+\s@\^☀️&\*;:{}=\-_`~()]/g, '<span class="whitespace"></span>' );
          return source + '...'
        }
      },
      igImageUrl() {
        let obj = this.getOpenedProduct;
        if ( obj !== null ) {
          return obj.instagram_images.find( ( img ) => img.name === "L" ).url
        }
      }
    },
    methods: {
      back() {
        if ( this.getOpenedProduct !== null ) {
          mixpanel.track( 'Close Repost Page', { productId: this.getOpenedProduct.id } );

          if ( window.history.length > 1 ) {

            window.history.back();

          } else {

            this.$router.go( { name: "home" } );

          }

        }
      },
      addInfo() {
        //Get the selected text and append the extra info
        let obj = this.getOpenedProduct;
        if ( obj !== null ) {

          var selection = window.getSelection(),
              before    = 'Интересен товар? Укажи комментарий @wantit 🙌 <br><br>',
              after     = '<br><br>Если интересует товар, укажи @wantit в комментариях  ✒️' + obj.supplier.instagram_username + ', ' + obj.code,
              copytext  = before + obj.instagram_image_caption + after,
              newdiv    = document.createElement( 'div' );

          //hide the newly created container
          newdiv.style.position = 'absolute';
          newdiv.style.top      = '-99999px';

          //insert the container, fill it with the extended text, and define the new selection
          document.body.appendChild( newdiv );
          newdiv.innerHTML = copytext;
          selection.selectAllChildren( newdiv );

          window.setTimeout( function() {
            document.body.removeChild( newdiv );
          }, 1 );

        }

      }
    }
  }
</script>
