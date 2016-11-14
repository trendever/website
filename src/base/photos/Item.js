
import Item from './Item.monk';
import pluralize from 'pluralize-ru';
export default class extends Item {

  constructor() {

    super();

    this.state = {
      product: {}
    }

  }

  update(state) {
    Object.assign(this.state, state);

      if(!this.state.product) {

        super.update(this.state);

        return;

      } else {



        this.state.thumb = (()=>{

          if (this.state.product && this.state.product.instagram_images) {
            if (window.browser.mobile){
              return this.state.product.instagram_images.find((img) => img.name === "S_square").url
            }else{
              return this.state.product.instagram_images.find((img) => img.name === "M_square").url
            }

          }

          if (this.state.product && this.state.product.images) {
            if (window.browser.mobile){
              return this.state.product.images.find((img) => img.name === "S_square").url
            }else{
              return this.state.product.images.find((img) => img.name === "M_square").url
            }
          }
          // return this.state.product.instagram_image_url
        })();

        
/*        this.state.classForColumn = (() => {
          switch(this.state.count){
            case 2: return 'photo__container-two';
              break;
            case 3: return 'photo__container-three';
              break;
            default: return 'photo__container-three';
          }
        })();*/

/*        this.state.discountPrice = (()=> {
          const items = this.state.product.items;
          if (items.length === 0) {
            return
          }
          if (items[0].discount_price) {
            return items[0].discount_price;
          } else if (items[0].price) {
            return items[0].price
          }
        })();*/


        this.state.title = (()=>{
          const items = this.state.product.items;
          if (items.length === 0) {
            return this.state.product.title;
          } else if (items.length > 1) {
            return `${items[0].name} (+${pluralize(items.length-1, '', '%d товар', '%d товара', '%d товаров')})`
          }
          return items[0].name
        })();


       /* this.state.suppliername = (()=> {
          if(this.state.product.shop){
            return this.state.product.shop.name;
          }
          return this.state.product.supplier.instagram_username;
        })();*/


        super.update(this.state);
        
      }


    
  }

}

