import { ReactNode } from 'react';

export interface CollapseProps {
  topic: ReactNode;

  isExpanded?: boolean;

  children?: ReactNode;
}
