import { createContext, type ReactNode, useContext } from 'react';

export const DefaultFallbackContext = createContext<ReactNode | undefined>(undefined);

export const useDefaultFallbackContext = () => useContext(DefaultFallbackContext);
