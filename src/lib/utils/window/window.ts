import { ORIGIN } from '../constants';

export const WINDOWS = {
	get location() {
		return globalThis.window ? window.location : new URL('', ORIGIN);
	}
};
