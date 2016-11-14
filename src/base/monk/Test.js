import Test from './test.monk';

export default class extends Test {
  constructor() {

    super();

    this.state = {
      name: '',
      some: {},
    }

  }

  update(state) {



    Object.assign(this.state, state);


    this.state.ass = (()=>{
      alert(this.state.name)
      return this.state.name + ' ЖОПА';

    })();


    super.update(this.state);
  }

}
