import { CSSProperties } from 'react';

export interface ListFileProps {
  fileName?: string;

  date?: string;

  containerStyle?: CSSProperties;

  handleDelete?: () => void;
  handlePreview?: (attachCode: string | undefined) => void;
}
