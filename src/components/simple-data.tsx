import moment from 'moment';
import 'moment/locale/th';

export const defaultAlertSetting = {
  icon: '',
  show: false,
  type: '',
  title: '',
  content: '',
};

export const momentFormat = (date: string, language: string) => {
  if (language === 'th') {
    moment.locale('th');
    return moment(date).add(543, 'year').format('LL');
  } else {
    moment.locale('en');
    return moment(date).format('LL');
  }
};

export const momentFormatDateTime = (date: string, language: string) => {
  if (language === 'th') {
    moment.locale('th');
    return moment(date, 'DD-MM-YYYY HH:mm').add(543, 'year').format('LLL');
  } else {
    moment.locale('en');
    return moment(date, 'DD-MM-YYYY HH:mm').format('LLL');
  }
};
