import React, {
  useState,
  CSSProperties,
  ChangeEvent,
  FormEvent,
  MouseEvent,
  useEffect
} from 'react';
import { TextInputSelectedProps } from './text-input-selected.props';
import HipchatChevronDownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
import SearchIcon from '@atlaskit/icon/glyph/search';
import styled from 'styled-components';

interface OptionsType {
  value: string,
  label: string
}

const TextInputSelected = function TextInputSelected(props: TextInputSelectedProps) {
  const {
    defalutValue,
    options,
    onClick,
    onChange,
    onInputChange,
    onSubmit
  } = props

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  const [placeholder, setPlaceholder] = useState<string>('Search vehicle');

  useEffect(() => {
    if (defalutValue) {
      setValue(defalutValue);
      onSubmit && onSubmit(defalutValue);
    }
  }, [defalutValue]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsOpen(false);
    console.log('value :>> ', value);
    onSubmit && onSubmit(value);
  }

  const onInputClick = (event: MouseEvent<HTMLInputElement>) => {
    if (!value) {
      setPlaceholder('Search vehicle')
    } else {
      setPlaceholder('');
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    console.log('value :>> ', value);
    setIsOpen(!!!value);
    setValue(value);
    onChange && onChange(value);
  }

  const handleInputChange = (val: string) => {
    console.log('val :>> ', val);
    const option = options?.find(({ value }) => value === val);
    if (option) {
      setValue('');
      setPlaceholder(option.label);
      setIsOpen(false);
      onInputChange && onInputChange(val);
    }
  }

  return (
    <>
      <Form
        onSubmit={handleSubmit}
        onBlur={() => setIsOpen(false)}
      >
        <div style={{ marginTop: 8 }}>
          <div style={{ position: 'relative', boxSizing: 'border-box' }}>
            <Box onClick={() => setIsOpen((prevStatus) => !prevStatus)}>
              <RootSearchIcon>
                <SearchIcon label={'search-icon'} size={'medium'} />
              </RootSearchIcon>
              <Input
                type="text"
                value={value}
                placeholder={placeholder}
                onClick={onInputClick}
                onChange={handleChange}
              />
              <RootChevronDown>
                <DividingLine />
                <BoxIcon aria-hidden="true">
                  <HipchatChevronDownIcon label="chevron-down" size="medium" />
                </BoxIcon>
              </RootChevronDown>
            </Box>

            <div style={{ display: isOpen ? 'block' : 'none' }}>
              <RootBoxItem>
                <UnorderedList>
                  {options?.map(({ value, label }) =>
                    <List
                      key={`key-${value}`}
                      id={`react-select-3-option-${value}`}
                      onMouseDown={() => handleInputChange(value)}
                    // onMouseEnter={() => console.log('onMouseEnter')}
                    // onMouseLeave={() => console.log('onMouseLeave')}
                    >{label}</List>)
                  }
                </UnorderedList>
              </RootBoxItem>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
};

export default TextInputSelected;

const Form = styled.form`
  margin-bottom: 20px;
`

const Box = styled.div`
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: hsl(0, 0%, 100%);
  border-color: hsl(0, 0%, 80%);
  border-radius: 4px;
  border-style: solid;
  border-width: 1px;
  cursor: default;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  min-height: 38px;
  outline: 0!important;
  position: relative;
  -webkit-transition: all 100ms;
  transition: all 100ms;
  box-sizing: border-box;

  &:hover {
    border: 1px solid hsl(0, 0%, 60%);
  }

  &:focus-within {
    border: 1px solid #2684FF;
  }
`

const Input = styled.input`
  font-size: 16px;
  margin-left: 30px !important;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -webkit-box-flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  padding: 2px 8px;
  -webkit-overflow-scrolling: touch;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  border: none;
  &:focus-visible {
    outline: none;
  }
`

const RootSearchIcon = styled.span`
  padding-left: 8px;
  position: absolute;
  left: 9;
  top: 7;
  color: #cfcfcf;
  z-index: 99;
`

const RootChevronDown = styled.div`
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-align-self: stretch;
  -ms-flex-item-align: stretch;
  align-self: stretch;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-shrink: 0;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  box-sizing: border-box;
`

const BoxIcon = styled.div`
  color: hsl(0, 0%, 80%);
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  padding: 8px;
  -webkit-transition: color 150ms;
  transition: color 150ms;
  box-sizing: border-box;
  &:hover {
    color: hsl(0, 0%, 60%);
  }
`

const DividingLine = styled.div`
  -webkit-align-self: stretch;
  -ms-flex-item-align: stretch;
  align-self: stretch;
  background-color: hsl(0, 0%, 80%);
  margin-bottom: 8px;
  margin-top: 8px;
  width: 1px;
  box-sizing: border-box;
`

const RootBoxItem = styled.div`
  /* top: 100%; */
  overflow: auto;
  background-color: hsl(0, 0%, 100%);
  border-radius: 4px;
  box-shadow: 0 0 0 1px hsla(0, 0%, 0%, 0.1),0 4px 11px hsla(0, 0%, 0%, 0.1);
  margin-bottom: 8px;
  margin-top: 8px;
  position: absolute;
  width: 100%;
  z-index: 1;
  box-sizing: border-box;
`

const UnorderedList = styled.div`
  max-height: 300px;
  over-flow: auto;
  padding-bottom: 4px;
  padding-top: 4px;
  position: relative;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
`

const List = styled.div`
  background-color: transparent;
  color: inherit;
  cursor: default;
  display: block;
  font-size: inherit;
  padding: 8px 12px;
  width: 100%;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  box-sizing: border-box;

  &:hover {
    background-color: #2684FF;
    color: hsl(0, 0%, 100%);
  }
`
