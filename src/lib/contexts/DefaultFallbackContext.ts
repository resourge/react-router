import { useContext, createContext, type ReactNode } from 'react';

export const DefaultFallbackContext = createContext<ReactNode | undefined>(undefined);

export const useDefaultFallbackContext = () => useContext(DefaultFallbackContext);
