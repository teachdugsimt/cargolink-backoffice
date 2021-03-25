import React, { JSXElementConstructor, ReactElement, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { presets } from './preset';
import { mergeAll, flatten } from 'ramda';

interface TextProps {
  tx?: string;
  text?: string;
  preset?: 'small' | 'content' | 'title' | 'header' | 'largeHeader';
  style?: any;
  children?: React.ReactNode;
}

const default_text = {
  fontSize: 14,
};

export const Text = (props: TextProps) => {
  const { tx, text, preset = 'content', children, style: styleOverride, ...rest } = props;
  const { t } = useTranslation();

  const i18nText = tx && t(tx);
  const content = i18nText || text || children;
  const style = mergeAll(flatten([presets[`${preset}`] || presets.content, styleOverride]));

  return (
    <span style={style} {...rest}>
      {content}
    </span>
  );
};
