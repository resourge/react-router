import { ORIGIN } from '../constants';

export const WINDOWS = {
	get location() {
		return globalThis.window 
			? new URL(window.location as unknown as URL) 
			: new URL('', ORIGIN);
	}
};
