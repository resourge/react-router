import { createContext, useContext } from 'react';

import invariant from 'tiny-invariant';

import { type BlockerResult } from '../hooks/useBlocker';

export const PromptNextContext = createContext<BlockerResult | null>(null);

/**
 * To use inside Prompt components.
 * Contains the `next` method to navigate after "Prompt" is finished.
 */
export const usePromptNext = (): BlockerResult => {
	const context = useContext(PromptNextContext);

	if ( __DEV__ ) {
		invariant(context, 'usePromptNext can only be used in the context of a <PromptContext/Prompt> component.');
	}

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return context!;
};
