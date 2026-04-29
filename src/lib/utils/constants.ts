export const FIT_IN_ALL_ROUTES = '{*}?';
// There is a bug where /g will fail for tests that has already pass, because of the /g (global tag)
export function getFitInAllRoutesReg() {
	return /\{\*\}\?/g;
}

export const IS_BROWSER: boolean = globalThis.window !== undefined && globalThis.document !== undefined;

export const ORIGIN = IS_BROWSER
	? globalThis.location.origin
	: 'http://localhost';
