import { type FC, type ReactNode } from 'react';

import { PromptNextContext } from '../../contexts/PromptNextContext';
import { usePrompt, type UsePromptProps } from '../../hooks/usePrompt/usePrompt';

export type PromptProps = {
	children?: ReactNode
} & UsePromptProps;

/**
 * Component for prompting the user before navigating.
 * 
 * * Note: This component mainly uses `usePrompt` hook.
 */
const Prompt: FC<PromptProps> = ({ children, ...promptProps }) => {
	const promptResult = usePrompt(promptProps);

	if ( !promptResult.isBlocking ) {
		return (<></>);
	}

	return (
		<PromptNextContext.Provider value={promptResult}>
			{ children }
		</PromptNextContext.Provider>
	);
};

export default Prompt;
