import React, { useContext } from 'react';

import invariant from 'tiny-invariant'

import { type BlockerResult } from '../hooks/useBlocker';

export const PromptNextContext = React.createContext<BlockerResult | null>(null);

/**
 * To use inside Prompt components.
 * Contains the `next` method to navigate after "Prompt" is finished.
 */
export const usePromptNext = () => {
	const context = useContext(PromptNextContext);

	if ( __DEV__ ) {
		invariant(context, 'usePromptNext can only be used in the context of a <PromptContext/Prompt> component.')
	}

	return context as BlockerResult;
}
