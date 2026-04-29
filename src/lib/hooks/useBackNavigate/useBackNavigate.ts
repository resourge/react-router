import { type BackNavigateMethod } from './useBackNavigateType';

/**
 * Returns a method for go back.
 */
export const useBackNavigate = (): BackNavigateMethod => (delta?: number) => {
	if ( delta !== undefined ) {
		globalThis.history.go(delta);
		return;
	}
	globalThis.history.back();
};
