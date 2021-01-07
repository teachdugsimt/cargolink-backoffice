import React, { useState } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import united_kingdom from '../images/united-kingdom.png';
import thailand from '../images/thailand.png';

const useStyles = makeStyles({
  selectFocus: {
    '&:focus': {
      background: 'transparent',
    },
  },
});

const LanguageMenu = (props) => {
  const { t, i18n } = useTranslation();
  console.log('i18n :>', i18n);
  const classes = useStyles();

  const [values, setValues] = useState({
    language: 'th',
  });

  function handleChange(event) {
    i18n.changeLanguage(event.target.value);

    setValues((oldValues) => ({
      ...oldValues,
      [event.target.name]: event.target.value,
    }));
  }

  return (
    <Select
      style={{ background: '#fff', borderRadius: 5, width: 80, textAlign: 'center', textAlignLast: 'center' }}
      value={values.language}
      onChange={(e) => handleChange(e)}
      disableUnderline
      inputProps={{
        name: 'language',
      }}
      classes={{
        select: classes.selectFocus,
      }}
    >
      <MenuItem value={'th'}>
        <div style={{ display: 'flex' }}>
          <img src={thailand} style={{ width: 20, height: 20, margin: '0px 5px', alignItems: 'center' }} />
          <span>TH</span>
        </div>
      </MenuItem>
      <MenuItem value={'en'}>
        <div style={{ display: 'flex' }}>
          <img src={united_kingdom} style={{ width: 20, height: 20, margin: '0px 5px', alignItems: 'center' }} />
          <span>EN</span>
        </div>
      </MenuItem>
    </Select>
  );
};

export default LanguageMenu;
