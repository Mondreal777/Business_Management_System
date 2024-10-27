import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import SecureLS from 'secure-ls'

// Shared
import appUser from './module/_shared/app-user';

const ls = new SecureLS({isCompression: false});
Vue.use(Vuex)

export default new Vuex.Store({
	strict: process.env.VUE_APP_NODE_ENV !== 'production',
	plugins: [createPersistedState({
		paths: [
			'appUser',
		],
		storage: {
			getItem: (key) => ls.get(key),
			setItem: (key, value) => ls.set(key, value),
			removeItem: (key) => ls.remove(key)
		}
	})],
	modules: {
		appUser
	}
})
