import { type NavigationActionType as RNavigationActionType } from '@resourge/history-store/dist/types/navigationActionType/NavigationActionType';
import { type NavigationActionType as RNNavigationActionType } from '@resourge/history-store/dist/types/navigationActionType/NavigationActionType.native';

type NavigationActionType = RNavigationActionType | RNNavigationActionType;

export type Blocker<T extends NavigationActionType> = (currentUrl: URL, nextUrl: URL, action: T) => boolean;

export type BlockerResult = {
	continueNavigation: () => void
	finishBlocking: () => void
	isBlocking: boolean
};
