<style src='./list.pcss'></style>
<template lang="jade">
scroll-component
 .main-section(v-if='items' v-el:container)
  template(v-for='line in items | lines')
   .row
    template(v-for='item in line.bundle' track-by="id")
     .item
      img.photo__img(:src='thumb(item)')

scroll-top
</template>

<script>
	import {run,setListId,setContainerWidth} from 'vuex/actions/products';
	import scrollTop from 'base/scroll-top/scroll-top.vue';
	import ScrollComponent from 'base/scroll/scroll.vue'
	import { urlThumbnail } from 'utils';
	import pluralize from 'pluralize-ru';
	import {getProducts,getScrollData} from 'vuex/getters/products';

	export default{
		data: () => ({
		}),

		vuex: {
			getters: {
				items:getProducts,
				getScrollData
			},

			actions: {
        		run,
        		setListId,
        		setContainerWidth
    		}
		},

		ready() {
			this.setContainerWidth(300);
			this.setListId( "home");
			this.run({},false);
		},

		methods: {
			thumb(value) {
		 		if (value.instagram_images) {
		          return value.instagram_images
		          .find((img) => img.name === "M_square").url
		        }
			}
		},

		filters: {
			lines( value ) {

				const { idStart, idEnd } = this.getScrollData;

				const _lines = [];

				const items  = value.slice( idStart, idEnd );

				let interateCout = Math.ceil(items.length / 2);  

				for(let i = 0; i < interateCout; i++ ){

				  let bundle = items.splice(0,2);
				  //нужен id для того чтобы изображения постоянно показывались а не появлялись из ничего
				  //каждый раз при скролле
				  let bundleId = bundle[0].id;

				  _lines.push({uid: bundleId, bundle: bundle});

				}

				return _lines;
			},

			

			name(value) {
				let items = value.items;
		        if (items.length === 0) {
		          return value.title;
		        } else if (items.length > 1) {
		          return `${items[0].name} (+${pluralize(items.length-1, '', '%d товар', '%d товара', '%d товаров')})`
		        }
		        return items[0].name
			}
		},

		computed: {
			scrollTop: {
				cache: false,
				get(){

				  const scrollTop = this.$els.container.getBoundingClientRect().top;

				  return ( scrollTop > 0 ) ? 0 : Math.abs( scrollTop );

				}
			}
		},

		components: {
			ScrollComponent,
			scrollTop
		}

	}
</script>
