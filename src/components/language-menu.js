import React, { useState, useEffect } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import united_kingdom from '../images/united-kingdom.png';
import thailand from '../images/thailand.png';
import { useMst } from '../stores/root-store';

const useStyles = makeStyles({
  selectFocus: {
    '&:focus': {
      background: 'transparent',
    },
  },
});

const LanguageMenu = (props) => {
  const { t, i18n } = useTranslation();
  const { loginStore } = useMst();
  console.log('i18n :>', i18n);
  const classes = useStyles();

  const [values, setValues] = useState({
    language: 'th',
  });

  useEffect(() => {
    setValues({ language: loginStore.language });
  }, []);

  function handleChange(event) {
    i18n.changeLanguage(event.target.value);

    setValues((oldValues) => ({
      ...oldValues,
      [event.target.name]: event.target.value,
    }));
    loginStore.setLanguage(event.target.value);
  }

  return (
    <Select
      style={{
        background: '#fff',
        borderRadius: 5,
        width: 80,
        textAlign: 'center',
        textAlignLast: 'center',
        display: 'flex',
      }}
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
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
          <img src={thailand} style={{ width: 22, height: 22, margin: '0px 5px' }} />
          <span style={{ marginTop: 2 }}>TH</span>
        </div>
      </MenuItem>
      <MenuItem value={'en'}>
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
          <img src={united_kingdom} style={{ width: 22, height: 22, margin: '0px 5px' }} />
          <span style={{ marginTop: 2 }}>EN</span>
        </div>
      </MenuItem>
    </Select>
  );
};

export default LanguageMenu;
