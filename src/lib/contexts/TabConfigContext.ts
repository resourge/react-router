import { createContext, useContext } from 'react';

export type TabProps = { 
	/**
	 * History mode decides when Tab screen will reset state
	 * @default ['push']
	 * !All mode will always reset state 
	 */
	historyMode?: Array<'push' | 'replace' | 'tab_view' | 'ALL'>
};

export const TabConfigContext = createContext<TabProps | null>(null);

export const useTabConfig = () => useContext(TabConfigContext) ?? {};
