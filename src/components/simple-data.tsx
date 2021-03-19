import moment from 'moment';
import 'moment/locale/th';

export const defaultAlertSetting = {
  icon: '',
  show: false,
  type: '',
  title: '',
  content: '',
};
export const DateFormat = (date: string, language: string) => {
  moment.locale(language);
  const d = moment(date, 'DD-MM-YYYY HH:mm');
  if (language === 'th') {
    const d = moment(date, 'DD-MM-YYYY HH:mm');
    return d.isValid() ? d.add(543, 'year').format('ll') : '';
  } else {
    return d.isValid() ? d.format('ll') : '';
  }
};

export const momentFormat = (date: string, language: string) => {
  moment.locale(language);
  if (language === 'th') {
    return moment(date).add(543, 'year').format('ll');
  } else {
    return moment(date).format('ll');
  }
};

export const momentFormatDateTime = (date: string, language: string) => {
  moment.locale(language);
  if (language === 'th') {
    return moment(date, 'DD-MM-YYYY HH:mm').add(543, 'year').format('lll');
  } else {
    return moment(date, 'DD-MM-YYYY HH:mm').format('lll');
  }
};
