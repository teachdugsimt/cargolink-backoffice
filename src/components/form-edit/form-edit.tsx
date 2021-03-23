import React, { CSSProperties, useEffect, useState } from 'react';
import { FormEditProps } from './form-edit.props';
import styled from 'styled-components';
import { Icon } from 'react-icons-kit';
import { edit } from 'react-icons-kit/fa/edit';
import { Field } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import { checkSquareO } from 'react-icons-kit/fa/checkSquareO';
import Select from '@atlaskit/select';

const TextInLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ICON_STYLED: CSSProperties = {
  color: 'gray',
};

const TEXT_LABEL: CSSProperties = {
  marginTop: 10,
  marginBottom: 10,
};

const TEXT_VALUE: CSSProperties = {
  ...TEXT_LABEL,
  paddingLeft: 6,
  fontWeight: 'bold',
};

const BUTTON: CSSProperties = {
  backgroundColor: 'transparent',
  border: 'none',
  marginLeft: 12,
};

const INPUT_BOX: CSSProperties = {
  marginBottom: 8,
  paddingLeft: 6,
};

export function FormEdit(props: FormEditProps) {
  const {
    label,
    value,
    showEditIcon = true,
    type = 'text',
    dropDownOption,
    containerStyle,
    labelStyle,
    valueStyle,
    handleSave,
  } = props;

  const [showForm, setShowForm] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<any>(null);

  useEffect(() => {
    if (type === 'text') {
      setInputValue(value);
    } else {
      const selected = dropDownOption?.filter((option) => option.isSelected);
      setInputValue(selected?.length ? selected[0] : null);
    }

    return () => {
      setInputValue(null);
    };
  }, []);

  const handleClick = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = () => {
    onSave(type === 'text' ? inputValue : inputValue.value);
    setShowForm(!showForm);
  };

  const handleChangeDropdown = (ele: any) => {
    setInputValue(ele);
    // setShowForm(!showForm)
    // onSave(ele.value)
  };

  const integrateLableStyle = { ...TEXT_LABEL, ...labelStyle };
  const integrateValueStyle = { ...TEXT_VALUE, ...valueStyle };

  const onSave = handleSave ? (val: string | number | object) => handleSave(val) : () => {};

  return (
    <div style={{ ...containerStyle }}>
      <TextInLine>
        {label && <p style={integrateLableStyle}>{label}</p>}
        {!showForm ? (
          <p style={integrateValueStyle}>{value}</p>
        ) : type === 'text' ? (
          <Field label="" name={label || ''} defaultValue={value}>
            {({ fieldProps, error, meta: { valid } }: any) => (
              <div style={INPUT_BOX}>
                <Textfield
                  {...fieldProps}
                  onChange={(e: any) => {
                    setInputValue(e.target.value);
                    fieldProps.onChange(e);
                  }}
                  style={{
                    height: 26,
                  }}
                />
              </div>
            )}
          </Field>
        ) : (
          <Select
            value={inputValue}
            options={dropDownOption}
            styles={{
              container: (base) => ({ ...base, minWidth: '50%' }),
            }}
            onChange={(e: any) => handleChangeDropdown(e)}
          />
        )}
        {showEditIcon &&
          (!showForm ? (
            <button style={BUTTON} onClick={handleClick}>
              <Icon icon={edit} style={ICON_STYLED} size={22} />
            </button>
          ) : (
            <button style={BUTTON} onClick={handleSubmit}>
              <Icon icon={checkSquareO} style={ICON_STYLED} size={22} />
            </button>
          ))}
      </TextInLine>
    </div>
  );
}
