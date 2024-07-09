import { BackHandler } from 'react-native';

import { ORIGIN } from '../constants';

import { type NavigationActionType, type NavigationState } from './HistoryType';

type HistoryEvent = NavigationState;

type NavigationType = {
	beforeURLChange: (current: NavigationState, previous: NavigationState, next: () => void) => boolean
	URLChange: (current: NavigationState, previous: NavigationState) => void
};

export type NavigateConfig = {
	/**
	 * @default push
	 */
	action?: NavigationActionType
	replace?: boolean
	/**
	 *  Determines whether to clear the history stack after the current URL before adding a new entry. Setting this option to true ensures that all history entries after the current URL are removed before the navigation creates a new history entry.
	 */
	stack?: boolean
};

function createHistory() {
	const state: NavigationState = {
		url: new URL('', ORIGIN),
		action: 'initial'
	};
	const history: HistoryEvent[] = [];

	const events = new Map<keyof NavigationType, Array<NavigationType[keyof NavigationType]>>();

	events.set('URLChange', []);
	events.set('beforeURLChange', []);

	function getEvent<K extends keyof NavigationType>(key: K): Array<NavigationType[K]> {
		return (events.get(key) ?? []) as Array<NavigationType[K]>;
	}

	function setHistory(navigationAction: 'pop'): void;
	function setHistory(navigationAction: NavigationActionType, hist: HistoryEvent): void;
	function setHistory(navigationAction: NavigationActionType, hist: HistoryEvent = {
		url: state.url,
		action: state.action
	}): void {
		switch ( navigationAction ) {
			case 'push':
				if ( history.length >= 100 ) {
					history.shift();
				}
				history.push(hist);
				break;
			case 'replace':
				history[history.length - 1] = hist;
				break;
			case 'stack':
				const index = history.findIndex(({ url }) => url === hist.url);
				if ( index > -1 ) {
					history.splice(index, history.length);
				}
				history.push(hist);
				break;
			case 'pop':
				history.splice(-1);
				break;
		}
	}

	function navigateNext(
		url: URL, 
		navigationAction: NavigationActionType,
		current: NavigationState,
		previous: NavigationState
	) {
		setHistory( 
			navigationAction,
			Object.assign({}, state)
		);
		
		state.url = url;
		state.action = navigationAction;

		const onChangeEvents = getEvent('URLChange');

		onChangeEvents.forEach((event) => {
			event(current, previous);
		});
	}

	function setCurrentUrl(url: URL, navigationAction: NavigationActionType) {
		const beforeURLChange = getEvent('beforeURLChange');

		const current: NavigationState = {
			action: navigationAction,
			url 
		};

		const previous: NavigationState = {
			action: state.action,
			url: state.url 
		};

		if ( current.action === previous.action && current.url === previous.url ) {
			return;
		}
		
		if ( 
			beforeURLChange.some((event) => 
				!event(current, previous, () => {
					navigateNext(url, navigationAction, current, previous);
				})
			) 
		) {
			return;
		}

		navigateNext(url, navigationAction, current, previous);
	}

	function navigate(
		url: string | URL, 
		config: NavigateConfig = {
			replace: false,
			stack: false,
			action: 'push'
		}
	) {
		const isReplace = config.replace ?? false;
		const isStack = config.stack ?? false;
		const action = config.action;

		const newUrl = new URL(typeof url === 'string' ? url : url.href, ORIGIN);

		setCurrentUrl(
			newUrl, 
			action 
			?? (
				isStack 
					? 'stack'
					: isReplace 
						? 'replace' 
						: 'push'
			)
		);
	}

	function getPreviousHistory() {
		return history.at(-1);
	}

	function goBack(delta: number = -1) {
		const previousURL = history.at(delta);

		if ( previousURL ) {
			setCurrentUrl(previousURL.url, 'pop');
		}
		else {
			BackHandler.exitApp();
		}
	}

	BackHandler.addEventListener('hardwareBackPress', () => {
		const previousURL = history.at(-1);

		if ( previousURL ) {
			setCurrentUrl(previousURL.url, 'pop');

			return true;
		}

		return false;
	});

	function addEventListener<K extends keyof NavigationType>(key: K, cb: NavigationType[K]) {
		const event = getEvent(key);

		event.push(cb);

		events.set(key, event);

		return {
			remove() {
				const event = getEvent(key);
				
				const index = event.findIndex((event) => event === cb);

				if ( index > -1 ) {
					event.splice(index, 1);

					events.set(key, event);
				}
			}
		};
	}

	function initial(initialRoute: string = '') {
		state.url = new URL(initialRoute, ORIGIN);
	}

	return {
		navigate,
		addEventListener,
		goBack,
		getPreviousHistory,
		state,
		initial
	};
}

export const History = createHistory();
