import { createContext, useContext } from 'react';

import { IS_BROWSER } from '../utils/constants';

export const IsFocusedContext = createContext<boolean>(false);
export const useIsFocused = () => useContext(IsFocusedContext) ?? IS_BROWSER;
