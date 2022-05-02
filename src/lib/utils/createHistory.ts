/* eslint-disable no-restricted-globals */
import { BeforeRouteChange, RouteChange, RouteHistory, To } from '../contexts/HistoryContext';
import { Action, RouteLocation } from '../contexts/LocationContext';

import { createEventListeners } from './createEventListeners';
import { createLocation } from './createLocation';
import { createPath } from './createPath';
import { initEvents, popState } from './initEvents';
import { parsePath } from './parsePath';

/**
 * Check if `beforeRouteChanges` permits route change
 * @param beforeRouteChanges Method's to check if route can change
 * @param currentLocation Current location
 * @param nextLocation Next location if action is push or replace, otherwise undefined
 * @returns `true/false` or the new location
 */
const allowRoute = async (
	beforeRouteChanges: BeforeRouteChange[], 
	currentLocation: RouteLocation, 
	nextLocation: RouteLocation | undefined = undefined,
	next: () => void
): Promise<boolean | RouteLocation> => {
	if ( !beforeRouteChanges.length ) {
		return true;
	}

	const l = beforeRouteChanges.length;
	for (let i = 0; i < l; i++) {
		const beforeRouteChange = beforeRouteChanges[i];

		let result = beforeRouteChange(
			currentLocation, 
			nextLocation,
			next
		);

		if ( result instanceof Promise ) {
			// eslint-disable-next-line no-await-in-loop
			result = await result
		}

		if ( !result ) {
			return false;
		}

		if ( result !== true && typeof result === 'object' ) {
			const path = createPath(result);
			return {
				...result,
				path
			}
		}
	}
		
	return true;
}

/**
 * Create a history system for the browser (or system that have it natively)
 */
export const createHistory = (currentLocation?: RouteLocation): RouteHistory => {
	const history = window.history;
	const events = initEvents();

	let location: RouteLocation = currentLocation ?? createLocation(Action.POP)

	const routeChange = createEventListeners<RouteChange>()
	const beforeRoute = createEventListeners<BeforeRouteChange>()

	const navigate = (action: Action, historyAction: 'pushState' | 'replaceState') => async <State = any>(
		to: To = '',
		state?: State
	) => {
		let _to = to;
		const nextLocation = parsePath(to ?? '', action);

		const go = (to: To, state?: State) => {
			history[historyAction](
				state,
				'',
				to
			)
		}

		const route: boolean | RouteLocation = await allowRoute(
			beforeRoute.events, 
			location, 
			nextLocation,
			() => {
				go(_to, state)
			}
		);

		if ( route ) {
			_to = route === true ? to : route.path

			go(_to, state)
		}
	}

	const push = navigate(Action.PUSH, 'pushState');

	const replace = navigate(Action.REPLACE, 'replaceState');

	const forward = async () => {
		const allowed = await allowRoute(
			beforeRoute.events, 
			location, 
			undefined,
			() => {
				forward()
			}
		);

		if ( allowed ) {
			history.forward()
		}
	}

	const back = async () => {
		const allowed = await allowRoute(
			beforeRoute.events, 
			location, 
			undefined,
			() => {
				back()
			}
		);

		if ( allowed ) {
			history.back()
		}
	}

	const go = async (delta?: number | undefined) => {
		const allowed = await allowRoute(
			beforeRoute.events, 
			location, 
			undefined,
			() => {
				go(delta)
			}
		);

		if ( allowed ) {
			history.go(delta)
		}
	}

	const checkForUpdates = (event: Event) => {
		const { type } = event;

		const action = type.replace('state', '').replace('State', '') as Action

		location = createLocation(action)

		routeChange.events
		.forEach((fn) => {
			fn(
				action,
				location
			)
		})
	};

	events.forEach((e) => addEventListener(e, checkForUpdates));

	addEventListener(popState, (event) => {
		const originalEvent = event;
		const currentLocation = location
		const nextLocation = createLocation(Action.POP)

		if ( currentLocation.path !== nextLocation.path ) {
			allowRoute(
				beforeRoute.events, 
				location, 
				undefined,
				() => {
					back()
				}
			)
			.then((allowed) => {
				if ( allowed ) {
					checkForUpdates(originalEvent);
				}
				else {
					history.forward()
				}
			})
		}
	})

	addEventListener('beforeunload', (event) => {
		if ( beforeRoute.events.length ) {
			// Cancel the event.
			event.preventDefault();
			// Chrome (and legacy IE) requires returnValue to be set.
			event.returnValue = '';

			return ''
		}
	})

	return {
		get state() {
			return history.state;
		},
		get location() {
			return location 
		},
		get length() {
			return history.length;
		},
		get scrollRestoration() {
			return history.scrollRestoration;
		},
		listen: routeChange.onEvent,
		beforeRouteChange: beforeRoute.onEvent,
		push,
		replace,
		back,
		forward,
		go
	}
}
