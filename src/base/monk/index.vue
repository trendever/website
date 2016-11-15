<template lang="jade">
div(v-el:monk)
</template>
<script>
import Monkberry from 'monkberry';

import Template from './template.monk';

export default{
	data(){
		return {}
	},
	ready(){
		var state = {
		  some: {
		  	name: 'williamsburg'
		  },
		  name: 'VOVA',
		  todos: [
		    {text: 'Primum', complete: true},
		    {text: 'Secundo', complete: false},
		    {text: 'Tertium', complete: false}
		  ],
		  gett: function (){
		  	return 10101010101;
		  }
		};

		var view = Monkberry.render(Template, this.$els.monk);
		view.update(state);

	}
}
</script>