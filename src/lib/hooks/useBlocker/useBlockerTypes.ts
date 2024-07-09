import { type ActionType } from '@resourge/react-search-params';

export type Blocker = (currentUrl: URL, nextUrl: URL, action: ActionType) => boolean;

export type BlockerResult = {
	continueNavigation: () => void
	finishBlocking: () => void
	isBlocking: boolean
};
