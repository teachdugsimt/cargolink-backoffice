import { CSSProperties, ReactNode } from 'react';

export interface CollapseProps {
  containerStyle?: CSSProperties;

  topic: ReactNode;

  isExpanded?: boolean;

  children?: ReactNode;
}
