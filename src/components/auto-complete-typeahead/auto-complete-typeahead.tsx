import React, { CSSProperties, useEffect, useState } from 'react';
import { fieldsEnum, resolveResultbyField } from './finder';
import { AutoCompleteTypeaheadProps } from './auto-complete-typeahead.props';
import { Field } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import styled from 'styled-components';

interface SearchString {
  district?: string;
  amphoe?: string;
  province?: string;
  zipcode?: string;
}

const Unorderlist = styled.ul`
  list-style: none;
  padding-left: 0;
  margin-top: 0;
  box-shadow: 2px 2px 3px #b9b9b940;
  position: absolute;
  z-index: 2;
`;

const List = styled.li`
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 15px;
  border: 1px solid #ebecf0;
  cursor: pointer;
  background-color: #fff;

  &:hover {
    background-color: #ebecf0;
  }
`;

const AutoCompleteTypeahead = function AutoCompleteTypeahead(props: AutoCompleteTypeaheadProps) {
  const { data, numberOfRow = 5, handleValue, fieldStyle } = props;

  const [addressObj, setAddressObj] = useState<any>([]);
  const [openOn, setOpenOn] = useState<string>('');
  const [searchStr, setSearchStr] = useState<SearchString | any>({
    district: '',
    amphoe: '',
    province: '',
    zipcode: '',
  });

  useEffect(() => {
    // console.log("Object.keys(fieldsEnum) :>> ", Object.keys(fieldsEnum));
  }, []);

  const onSelectOption = (data: any) => {
    setSearchStr({
      district: data.district,
      amphoe: data.amphoe,
      province: data.province,
      zipcode: data.zipcode || '',
    });
    setOpenOn('');
    handleValue(data);
  };

  const onFocusValue = (e: any, key: any) => {
    const value = e.target.value;
    const id = e.target.id;
    const result = value ? resolveResultbyField(id, value) : null;
    setOpenOn(fieldsEnum[key]);
    setAddressObj(result);
  };

  const onChangeValue = (e: any, key: any) => {
    const value = e.target.value;
    const id = e.target.id;
    console.log({
      [fieldsEnum[key]]: value,
    })
    setSearchStr({
      [fieldsEnum[key]]: value,
    });
    const result = value ? resolveResultbyField(id, value) : null;
    // console.log('result :>> ', result);
    setAddressObj(result);
  };


  return (
    <div style={{ width: '100%', margin: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
      {data.map(({ type, label, breakPoint, isRequired }) => {
        return (
          <div key={type} style={{ ...fieldStyle }}>
            <Field
              label={label}
              name={type.toLocaleLowerCase() || ''}
              isRequired={!!isRequired}
              defaultValue={searchStr[fieldsEnum[type]] || ''}
            >
              {({ fieldProps, error, meta: { valid } }: any) => (
                <Textfield
                  {...fieldProps}
                  id={fieldsEnum[type]}
                  onFocus={(e) => onFocusValue(e, type)}
                  onChange={(e: any) => onChangeValue(e, type)}
                  style={
                    {
                      // height: 26,
                    }
                  }
                />
              )}
            </Field>

            {openOn === fieldsEnum[type] && (
              <Unorderlist>
                {addressObj
                  ?.filter((_: any, i: number) => i < numberOfRow)
                  .map((item: any, i: number) => (
                    <List key={i} onClick={() => onSelectOption(addressObj[i])}>
                      <span>
                        {`${item.district} » ${item.amphoe} » ${item.province} » `}
                        {item.zipcode || <li>{'ไม่มีรหัสไปรษณีย์'}</li>}
                      </span>
                    </List>
                  ))}
              </Unorderlist>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AutoCompleteTypeahead;
