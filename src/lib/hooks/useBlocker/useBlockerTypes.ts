import { NavigationActionType } from 'src/lib/types/NavigationActionType';

export type Blocker<T extends NavigationActionType> = (currentUrl: URL, nextUrl: URL, action: T) => boolean;

export type BlockerResult = {
	continueNavigation: () => void
	finishBlocking: () => void
	isBlocking: boolean
};
