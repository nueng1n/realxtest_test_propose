import { ReactNode, HTMLAttributes } from 'react';

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
  }
  