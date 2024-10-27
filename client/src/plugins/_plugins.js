
import buefy from '@/plugins/buefy';
import vuelidate from '@/plugins/vuelidate';
import fontAwesome from '@/plugins/font-awesome';

const plugins = () => {
	buefy();
	vuelidate();
	fontAwesome();
}

export default plugins;