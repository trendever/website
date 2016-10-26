<template lang="jade">
div(id="monk")
</template>
<script>
import Monkberry from 'monkberry';
import Template from './template.monk';
export default{
	data(){
		return {}
	},
	ready(){
		let elem = document.getElementById("monk");
		const view = Monkberry.render(Template, elem);
		let todos = [
			{complete: false, text: 123},
			{complete: false, text: 12121},
			{complete: false, text: 123333},
			{complete: false, text: "hahaha"},
			{complete: false, text: "lol"},
			{complete: false, text: "it works"},
			{complete: true, text: "yep"}
		];
		view.update({todos: todos});
	}
}
</script>