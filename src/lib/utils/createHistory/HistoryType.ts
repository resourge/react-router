import { type ActionType } from '@resourge/react-search-params';

export type NavigationActionType = Exclude<ActionType, 'go' | 'back' | 'beforeunload'> | 'stack';

export type NavigationState = {
	action: NavigationActionType
	url: URL
};
