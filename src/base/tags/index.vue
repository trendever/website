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
      } );

      this.resize = listener( window, 'optimizedResize', this.onFlex )

      this.$on( 'photosIsRun', this.onFlex )

    },
    beforeDestroy(){
      this.resize.remove()
      this.$off( 'photosIsRun', this.onFlex )
    },
    methods: {

      onFlex(){

        Array.from( this.$els.tags.children ).forEach( ( tag ) => {

          tag.style.marginRight = '0';

        } );

        this.flex();
      },

      flex( tags = Array.from( this.$els.tags.children ) ){

        const marginRight = 10;
        const padding     = 20;
        const border      = 4; // Для супер точности нужно поставить 2, но так дёргается всё потому что окно первее сжимается чем вызывается пересчёт.

        const containerWidth = this.$els.tags.offsetWidth;

        let count    = 0;
        let rowWidth = 0;

        for ( let i = 0; i < tags.length; i++ ) {

          const textWidth = tags[ i ].children[ 0 ].offsetWidth;

          const fullWidth = (textWidth + border + (padding * 2)) + marginRight;

          rowWidth += fullWidth;

          if ( parseInt( containerWidth / rowWidth ) > 0 ) {

            count++;

          } else {

            rowWidth -= fullWidth + marginRight;

            break;

          }

        }

        if ( count === 1 ) {

          rowWidth += border / 2;

        }

        if ( tags.slice( count, tags.length ).length === 0 ) {

          rowWidth -= marginRight;

        }

        const freeSpace = containerWidth - rowWidth;

        for ( let i = 0; i < count; i++ ) {

          const textWidth = tags[ i ].children[ 0 ].offsetWidth;

          const newWidth = textWidth + ( freeSpace / count );

          if ( count > 1 ) {

            if ( i < count - 1 ) {

              console.log( count, i, count - 1 );

              tags[ i ].style.width       = `${ newWidth }px`
              tags[ i ].style.marginRight = `${ marginRight }px`

            } else {

              tags[ i ].style.width = `${ newWidth }px`

            }

          } else {

            tags[ i ].style.width = `${ newWidth }px`

          }

        }

        if ( count > 0 ) {

          const tagsSlice = tags.slice( count, tags.length );

          if ( tagsSlice.length > 0 ) {

            this.flex( tagsSlice );

          }

        }

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
