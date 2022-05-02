
import { createContext } from 'react';

/**
 * Actions represent the type of change to a location value.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#action
 */
export enum Action {
	/**
	 * A POP indicates a change to an arbitrary index in the history stack, such
	 * as a back or forward navigation. It does not describe the direction of the
	 * navigation, only that the current index changed.
	 *
	 * Note: This is the default action for newly created history objects.
	 */
	POP = 'pop',

	/**
	 * A PUSH indicates a new entry being added to the history stack, such as when
	 * a link is clicked and a new page loads. When this happens, all subsequent
	 * entries in the stack are lost.
	 */
	PUSH = 'push',

	/**
	 * A REPLACE indicates the entry at the current index in the history stack
	 * being replaced by a new one.
	 */
	REPLACE = 'replace',
}

export type RouteLocation<State = any> = {
	/**
	 * Action that lead to the location
	 */
	action: Action
	hash: string
	pathname: string
	search: string

	/**
	 * History state, 
	 * * Note: On route change, or page refresh, state gets cleared
	 */
	state: State

	/**
	 * String containing the entire "path" (`${pathname}${search}${hash}`)
	 */
	path: string
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const LocationContext = createContext<RouteLocation>(null!)
