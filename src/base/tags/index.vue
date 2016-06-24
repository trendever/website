<template>
  <div class="tags" v-el:tags>
    <div class="tag" v-for="tag of tags">
      <span class="text">{{tag.name}}</span>
    </div>
  </div>
</template>

<style src="./style.pcss" scoped lang="postcss"></style>

<script type="text/babel">

  import listener from 'event-listener'

  export default {
    ready(){

      this.onFlex = this.onFlex.bind( this );

      this.$nextTick( () => {
        this.flex();
        setTimeout( this.onFlex, 500 );
      } );

      this.resize = listener( window, 'optimizedResize', (() => {

        let timer = null;

        return () => {

          this.onFlex();

          if ( timer === null ) {

            setTimeout( this.onFlex, 500 );

          }

        }

      })() )

      this.$on( 'photosIsRun', this.onFlex )

    },
    beforeDestroy(){
      this.resize.remove()
      this.$off( 'photosIsRun', this.onFlex )
    },
    methods: {

      onFlex(){
        this.flex();
      },

      flex( tags = Array.from( this.$els.tags.children ) ){

        const marginRight = 10;
        const padding     = 20;
        const border      = 2;

        const containerWidth = this.$els.tags.offsetWidth;

        if ( tags.length <= 1 ) {

          tags[ 0 ].style.width = `${ containerWidth }px`;

          return null;

        }

        let count    = 0;
        let rowWidth = 0;

        for ( let i = 0; i < tags.length; i++ ) {

          const textWidth = tags[ i ].children[ 0 ].offsetWidth;

          rowWidth += (textWidth + border + (padding * 2));

          if ( parseInt( containerWidth / rowWidth ) > 0 ) {

            count++;

          } else {

            rowWidth -= ( textWidth + border + ( padding * 2 ) );

            break;

          }

        }

        const freeSpace = containerWidth - rowWidth;

        for ( let i = 0; i < count; i++ ) {

          const textWidth = tags[ i ].children[ 0 ].offsetWidth;

          const newWidth = textWidth + ( freeSpace / count );

          console.log( newWidth );

          tags[ i ].style.width = `${ newWidth }px`

          /*          console.log( partOfContainerWidth * freeSpace );

           if ( i !== count - 1 ) {

           tags[ i ].style.width       = `${ newWidth }px`
           tags[ i ].style.marginRight = `${ marginRight }px`

           } else {

           tags[ i ].style.width = `${ newWidth }px`

           }*/

        }

        /*        if ( count > 0 ) {

         const tagsSlice = tags.slice( count, tags.length );

         if ( tagsSlice.length > 0 ) {

         this.flex( tagsSlice );

         }

         }*/

      }
    },
    props: {
      tags: {
        type: Array,
        default: []
      }
    }
  }
</script>
