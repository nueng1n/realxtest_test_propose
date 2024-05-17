import { ReactNode} from 'react';


export interface NavigationContextType {
    currentPath: string;
    navigate: (to: string) => void;
  }

export interface NavigationProviderProps {
    children: ReactNode;
  }