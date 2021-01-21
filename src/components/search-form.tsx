import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { InputGroup } from '@paljs/ui/Input';
import { Button } from '@paljs/ui/Button';
import { Icon } from 'react-icons-kit';
import { search } from 'react-icons-kit/icomoon/search';

interface SearchProps {
  data: any;
  onSearch: any;
}

const SearchForm: React.FC<SearchProps> = observer((props) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');

  const onClickSearch = () => {
    const rows = props.data;
    const lowercasedValue = searchValue.toLowerCase().trim();
    if (lowercasedValue === '') props.onSearch(rows);
    else {
      const filteredData = rows.filter((item: any) => {
        const data = item.cells.filter((cell: any) => cell.key?.toString().toLowerCase().includes(lowercasedValue));
        return data && data.length ? true : false;
      });
      props.onSearch(filteredData);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <InputGroup>
        <input
          type="text"
          placeholder="Enter your search here"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </InputGroup>
      <Button appearance="filled" status="Basic" onClick={() => onClickSearch()}>
        <Icon size={18} icon={search} />
      </Button>
    </div>
  );
});
export default SearchForm;
