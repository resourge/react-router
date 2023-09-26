import { useContext, createContext } from 'react';

export const LanguageContext = createContext<string | undefined>(undefined);

export const useLanguageContext = () => useContext(LanguageContext);
