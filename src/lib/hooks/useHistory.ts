import { useContext } from 'react'

import invariant from 'tiny-invariant'

import { HistoryContext } from '../contexts/HistoryContext'

/**
 * Returns the current history object
 */
export const useHistory = () => {
	const context = useContext(HistoryContext)

	invariant(context, 'useHistory can only be used in the context of a <HistoryContext/Router> component.')

	return context.history
}
