import JQL from './jqljs';

const fieldsEnum: any = {
  DISTRICT: 'district',
  AMPHOE: 'amphoe',
  PROVINCE: 'province',
  ZIPCODE: 'zipcode',
};

const preprocess = (data: any) => {
  let lookup: any = [];
  let words: any = [];
  let expanded: any = [];
  let t: any = null;

  if (data.lookup && data.words) {
    lookup = data.lookup.split('|');
    words = data.words.split('|');
    data = data.data;
  }

  t = (text: any) => {
    const repl = (m: any) => {
      const ch = m.charCodeAt(0);
      return words[ch < 97 ? ch - 65 : 26 + ch - 97];
    };

    if (typeof text === 'number') {
      text = lookup[text];
    }
    return text.replace(/[A-Z]/gi, repl);
  };

  data.map(function (provinces: any) {
    let i = 1;
    if (provinces.length === 3) {
      // geographic database
      i = 2;
    }

    provinces[i].map(function (amphoes: any) {
      amphoes[i].map(function (districts: any) {
        districts[i] = districts[i] instanceof Array ? districts[i] : [districts[i]];
        districts[i].map(function (zipcode: any) {
          let entry = {
            district: t(districts[0]),
            amphoe: t(amphoes[0]),
            province: t(provinces[0]),
            zipcode: zipcode,
            district_code: null,
            amphoe_code: null,
            province_code: null,
          };
          if (i === 2) {
            // geographic database
            entry.district_code = districts[1] || false;
            entry.amphoe_code = amphoes[1] || false;
            entry.province_code = provinces[1] || false;
          }
          expanded.push(entry);
        });
      });
    });
  });

  // console.log(`expanded`, expanded);
  return expanded;
};

const DB = new JQL(preprocess(require('./data.json')));

const resolveResultbyField = (type: string, searchStr: string) => {
  let possibles = [];
  try {
    possibles = DB.select('*').where(type).match(`^${searchStr}`).orderBy(type).afetch();
  } catch (e) {
    return [];
  }
  return possibles;
};

// exports.resolveResultbyField = resolveResultbyField;
// exports.fieldsEnum = fieldsEnum;

export { resolveResultbyField, fieldsEnum };
