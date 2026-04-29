import { createContext, useContext } from 'react';

export type TabProps = { 
	/**
	 * History mode decides when Tab screen will reset state
	 * @default ['push']
	 * !All mode will always reset state 
	 */
	historyMode?: Array<'ALL' | 'push' | 'replace' | 'tab_view'>
};

export const TabConfigContext = createContext<null | TabProps>(null);

export const useTabConfig = () => useContext(TabConfigContext) ?? {};
