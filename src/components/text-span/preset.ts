const color: any = {
  lightGrey: 'lightgrey',
  textBlack: 'black',
};

const typography: any = {
  small: 12,
  content: 14,
  title: 16,
  header: 20,
  largeHeader: 24,
};

interface TextStyle {
  fontFamily?: string;
  color?: string;
  fontSize?: string | number;
}

const BASE_SMALL: TextStyle = {
  //   fontFamily: typography.primary,
  color: color.textBlack,
  fontSize: typography.small,
};
const BASE: TextStyle = {
  //   fontFamily: typography.primary,
  color: color.textBlack,
  fontSize: typography.content,
};
const TOPIC_BASE: TextStyle = {
  //   fontFamily: typography.primary,
  color: color.textBlack,
  fontSize: typography.title,
};
const TOPIC_EXTRA: TextStyle = {
  //   fontFamily: typography.secondary,
  color: color.textBlack,
  fontSize: typography.largeHeader,
};
const TOPIC_EXTRA_LARGE: TextStyle = {
  //   fontFamily: typography.secondary,
  color: color.textBlack,
  fontSize: typography.largeHeader,
};

export const presets: any = {
  /**
   * The default text styles.
   */
  small: BASE_SMALL,
  content: BASE,
  title: TOPIC_BASE,
  header: TOPIC_EXTRA,
  largeHeader: TOPIC_EXTRA_LARGE,
};

/**
 * A list of preset names.
 */
export type TextPresets = keyof typeof presets;
