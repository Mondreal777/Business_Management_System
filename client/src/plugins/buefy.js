// Vue
import Vue from 'vue';

// Buefy
import Buefy from 'buefy';

const buefy = () => {
	Vue.use(Buefy, {
		defaultIconComponent: "vue-fontawesome",
		defaultIconPack: 'fas',
		defaultContainerElement: '#app',
		customIconPacks: {
			fas: {
				sizes: {
					default: "lg",
					"is-small": "1x",
					"is-medium": "2x",
					"is-large": "3x"
				},
				iconPrefix: ""
			}
		}
	});
}

export default buefy;