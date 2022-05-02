import { createContext, useContext } from 'react'

import invariant from 'tiny-invariant'

export type PromptContextObject = readonly [boolean, () => void]

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const PromptContext = createContext<PromptContextObject>(null!)

export const usePromptContext = () => {
	const context = useContext(PromptContext)

	invariant(context, 'usePromptContext can only be used in the context of a <PromptContext/Prompt> component.')

	return context
}
