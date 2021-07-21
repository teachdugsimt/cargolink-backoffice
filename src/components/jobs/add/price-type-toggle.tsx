import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

export enum PriceTypeEnum {
  'PER_TRIP' = 'PER_TRIP',
  'PER_TON' = 'PER_TON',
}
interface PriceToggleStyle {
  width?: string | number;
  height?: string | number;
}
interface PriceTypeToggleProps extends PriceToggleStyle {
  priceType?: PriceTypeEnum;
  onChange?: (changeTo: PriceTypeEnum) => any;
}
const PriceTypeToggleComponent = (props: PriceTypeToggleProps) => {
  const { t } = useTranslation();
  const { onChange, priceType } = props;
  const [selecting, setSelecting] = useState<PriceTypeEnum>(PriceTypeEnum.PER_TRIP);
  const onClick = () => {
    const oldState = priceType != null ? priceType : selecting;
    const newState = oldState === PriceTypeEnum.PER_TRIP ? PriceTypeEnum.PER_TON : PriceTypeEnum.PER_TRIP;
    !priceType && setSelecting(newState);
    onChange && onChange(newState);
  };

  const select = priceType != null ? priceType : selecting;

  return (
    <PriceTypeToggle selecting={select} className="price-type-toggle" onClick={onClick}>
      <span className="trip">{t('perTrip')}</span>
      <span className="ton">{t('perTon')}</span>
      <a />
    </PriceTypeToggle>
  );
};

export default PriceTypeToggleComponent;

//? DEFAULT STYLES
const DEFAULT_WIDTH = '150px';
const DEFAULT_HEIGHT = '35px';
const TEXT_COLOR = '#FFF';
const TEXT_COLOR_OFF = '#AAA';
const BACKGROUND_COLOR = '#E8E8E8';
const SWITCH_COLOR = '#FBBC12';
const SWITCH_BORDER_COLOR = '#D8D8D8';

const animation = css`
  transition: all 0.2s ease-out;
`;
const radius = css`
  border-radius: 5px;
`;
const switchTonPosition = css`
  right: 0;
`;
const switchTripPosition = css`
  left: 0;
`;

interface PriceTypeProps extends PriceToggleStyle {
  selecting: PriceTypeEnum;
}
const PriceTypeToggle = styled.div<PriceTypeProps>`
  display: flex;
  position: relative;
  padding: 0;
  cursor: pointer;
  width: ${({ width = DEFAULT_WIDTH }) => width};
  height: ${({ height = DEFAULT_HEIGHT }) => height};
  background-color: ${BACKGROUND_COLOR};
  user-select: none;
  border: solid 1px ${SWITCH_BORDER_COLOR};
  ${radius}
  ${animation}

  span {
    font-weight: bold;
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    ${animation}

    &.trip {
      color: ${({ selecting }) => (selecting == PriceTypeEnum.PER_TRIP ? TEXT_COLOR : TEXT_COLOR_OFF)};
    }

    &.ton {
      color: ${({ selecting }) => (selecting == PriceTypeEnum.PER_TON ? TEXT_COLOR : TEXT_COLOR_OFF)};
    }
  }

  a {
    position: absolute;
    top: 0;
    bottom: 0;
    border: solid 1px ${SWITCH_BORDER_COLOR};
    width: 50%;
    background-color: ${SWITCH_COLOR};
    z-index: 1;
    ${radius}
    ${animation}
    ${({ selecting }) => (selecting == PriceTypeEnum.PER_TRIP ? switchTripPosition : switchTonPosition)}
  }
`;
