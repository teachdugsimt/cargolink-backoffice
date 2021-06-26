import React, { SyntheticEvent, useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { Button } from '@paljs/ui/Button';
import { Icon } from 'react-icons-kit';
import { search } from 'react-icons-kit/icomoon/search';
import Textfield from '@atlaskit/textfield';
import SearchIcon from '@atlaskit/icon/glyph/search';
interface SearchProps {
  // data: any;
  onSearch: (value: string) => void;
}

const SearchForm: React.FC<SearchProps> = observer((props) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const [keyboard, setkeyboard] = useState('');

  const onClickSearch = () => {
    // const rows = props.data;
    // const lowercasedValue = searchValue.toLowerCase().trim();
    // if (lowercasedValue === '') props.onSearch(rows);
    // else {
    //   const filteredData = rows.filter((item: any) => {
    //     const data = item.cells.filter((cell: any) => cell.key?.toString().toLowerCase().includes(lowercasedValue));
    //     return data && data.length ? true : false;
    //   });
    //   props.onSearch(filteredData);
    // }
    props.onSearch(searchValue);
  };

  const _handleKeyPress = (event: any) => {
    setkeyboard(event.key);
  };

  useEffect(() => {
    document.addEventListener('keydown', _handleKeyPress, false);
    return () => {
      document.removeEventListener('keydown', _handleKeyPress, false);
    };
  }, []);

  useEffect(() => {
    if (keyboard === 'Enter') {
      onClickSearch();
    }
  }, [keyboard]);

  return (
    <>
      {/* <div style={{ display: 'flex', alignItems: 'center' }}> */}
      {/* <input
        id="inputSearch"
        className="new-input-component"
        type="text"
        placeholder={t('inputSearch')}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      /> */}
      <Textfield
        name="basic" aria-label="default text field"
        placeholder="Search"
        onSubmit={onClickSearch}
        onChange={(e: SyntheticEvent<HTMLInputElement>) => setSearchValue(e.currentTarget.value)}
        elemBeforeInput={<SearchIcon label="" primaryColor="lightgray" />}
      />
      {/* <Button
        id="search"
        appearance="filled"
        status="Basic"
        style={{ padding: '0.5875rem 0.8125rem' }}
        onClick={() => onClickSearch()}
      >
        <Icon size={18} icon={search} />
      </Button> */}
      {/* </div> */}
    </>
  );
});
export default SearchForm;
