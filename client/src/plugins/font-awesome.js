// Vue
import Vue from 'vue';

// Font awesome core
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Solid icons
import { 
	fas,
	faBed,
	faBath,
	faCar,
	faCaretDown,
	faAward
} from "@fortawesome/free-solid-svg-icons";

// Brand icons
import { 
	faFacebookSquare, 
	faTwitter, 
	faInstagram, 
	faYoutube,
	faGoogle,
	faFacebook,
	fab
} from '@fortawesome/free-brands-svg-icons';

import { far } from '@fortawesome/free-regular-svg-icons';

const fontAwesome = () => {
	library.add(
		fas,
		far,
		faBed,
		faBath,
		faCar,
		faFacebookSquare, 
		faTwitter, 
		faInstagram, 
		faYoutube,
		faCaretDown,
		faGoogle,
		faFacebook,
		faAward,
		fab
	);

	Vue.component('vue-fontawesome', FontAwesomeIcon);
	return library;
}

export default fontAwesome;