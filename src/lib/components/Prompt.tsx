import { FC, ReactNode } from 'react';

import { PromptNextContext } from '../contexts/PromptNextContext';
import { usePrompt, UsePromptProps } from '../hooks/usePrompt';

export type PromptProps = {
	children?: ReactNode
} & UsePromptProps

/**
 * Component for prompting the user before navigating.
 * 
 * * Note: This component mainly uses `usePrompt` hook.
 */
const Prompt: FC<PromptProps> = ({ children, ...promptProps }) => {
	const [isBlocking, next] = usePrompt(promptProps)

	if ( !isBlocking ) {
		return (<></>);
	}

	return (
		<PromptNextContext.Provider value={next}>
			{ children }
		</PromptNextContext.Provider>
	);
};

export default Prompt;
