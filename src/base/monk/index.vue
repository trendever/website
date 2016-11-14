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
		  todos: [
		    {text: 'Primum', complete: true},
		    {text: 'Secundo', complete: false},
		    {text: 'Tertium', complete: false}
		  ]
		};

		var view = Monkberry.render(Template, this.$els.monk);
		view.update(state);

/*		view.on('submit', 'form', function (event) {
		  event.preventDefault();
		  var input = view.querySelector('input[type="text"]');

		  state.todos.push({text: input.value, complete: false});
		  view.update(state);
		  
		  input.value = '';
		});

		view.on('click', '[data-index]', function (event) {
		  var i = event.target.dataset.index;
		  state.todos[i].complete = !state.todos[i].complete;
		  view.update(state);
		});*/
	}
}
</script>