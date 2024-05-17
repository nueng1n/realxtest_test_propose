import { createContext, useState, useEffect, FC } from 'react';

import {NavigationContextType, NavigationProviderProps} from "../interface/navigation"

const NavigationContext = createContext<NavigationContextType| null>(null);


const NavigationProvider: FC<NavigationProviderProps> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);

  useEffect(() => {
    const handler = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handler);

    return () => {
      window.removeEventListener('popstate', handler);
    };
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, '', to);
    setCurrentPath(to);
  };

  return (
    <NavigationContext.Provider value={{ currentPath, navigate }}>
      { children }
    </NavigationContext.Provider>
  );
};

export { NavigationProvider };
export default NavigationContext;



