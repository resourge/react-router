import { type BackNavigateMethod } from './useBackNavigateType';

/**
 * Returns a method for go back.
 */
export const useBackNavigate = (): BackNavigateMethod => (delta?: number) => {
	if ( delta !== undefined ) {
		window.history.go(delta);
		return;
	}
	window.history.back();
};
