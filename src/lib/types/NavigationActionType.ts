type NavigationActionMobileType = 'initial' | 'pop' | 'push' | 'replace' | 'stack';

type NavigationActionWebType = 'back' | 'beforeunload' | 'forward' | 'go' | 'initial' | 'pop' | 'push' | 'replace';

export type NavigationActionType = NavigationActionMobileType | NavigationActionWebType;
