import { FC, PropsWithChildren } from 'react';

import { PromptContext } from '../contexts/PromptContext';
import { PromptMessage, PromptWhen, usePrompt } from '../hooks/usePrompt';

export type PromptProps = PropsWithChildren<{
	when: PromptWhen
	message?: PromptMessage
}>

/**
 * Component for prompting the user before navigating.
 * 
 * If `message` is undefined it will show children (for developer to show it's own prompt)
 * 
 * * Note: This component mainly uses `usePrompt` hook.
 */
const Prompt: FC<PromptProps> = ({ when, message, children }) => {
	const promptState = usePrompt(when, message)

	if ( promptState[0] ) {
		return (
			<PromptContext.Provider value={promptState}>
				{children}
			</PromptContext.Provider>
		);
	}

	return null;
};

export default Prompt;
