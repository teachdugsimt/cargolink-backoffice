import moment from 'moment';
import 'moment/locale/th';

export const defaultAlertSetting = {
  icon: '',
  show: false,
  type: '',
  title: '',
  content: '',
};

const toBuddhistYear = (moment: moment.Moment, format: string) => {
  var christianYear = moment.format('YYYY')
  var buddhishYear = (parseInt(christianYear) + 543).toString()
  return moment
    .format(format.replace('YYYY', buddhishYear).replace('YY', buddhishYear.substring(2, 4)))
    .replace(christianYear, buddhishYear)
}

export const DateFormat = (date: string, language: string) => {
  moment.locale(language);
  const d = moment(date);
  if (language === 'th') {
    const d = moment(date);
    return d.isValid() ? toBuddhistYear(d.locale(language), 'll') : '';
  } else {
    return d.isValid() ? d.locale(language).format('ll') : '';
  }
};

export const momentFormat = (date: string, language: string) => {

  if (language === 'th') {
    return toBuddhistYear(moment(date).locale(language), 'll');
  } else {
    return moment(date).locale(language).format('ll');
  }
};

export const momentFormatDateTime = (date: string, language: string) => {

  if (language === 'th') {
    return toBuddhistYear(moment(date, 'DD-MM-YYYY HH:mm').locale(language), 'll');
  } else {
    return moment(date, 'DD-MM-YYYY HH:mm').locale(language).format('ll');
  }
};
