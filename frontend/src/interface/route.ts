import { ReactNode } from 'react';

export interface RouteProps {
    path: string;
    children: ReactNode;
}


export interface NavigationContextType {
    currentPath: string;
    navigate: (to: string) => void;
}
