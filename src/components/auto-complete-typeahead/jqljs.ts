/**
 * @name JQL.js
 * @version 1.0.3
 * @update Apr 16, 2017
 * @author Earthchie http://www.earthchie.com/
 * @license WTFPL v.2 - http://www.wtfpl.net/
 **/
// function JQL(obj) {
class JQL {
  data_source: any;
  buffer: any;
  focused_field: string;
  options: Array<any>;
  size: boolean;

  constructor(obj: any) {
    if (typeof obj === 'string') {
      obj = JSON.parse(obj);
    }

    this.data_source = obj;
    this.buffer = obj;
    this.focused_field = '';
    this.options = [];
    this.size = false;

    for (const key in obj) {
      for (const field in obj[key]) {
        this.options.push(field);
      }
      break;
    }
  }

  fetch() {
    if (typeof this.options === 'object') {
      let obj: any = {};
      for (var i in this.buffer) {
        obj[i] = {};
        for (const j in this.options) {
          const field = this.options[j];
          if (this.buffer[i][field]) {
            obj[i][field] = this.buffer[i][field];
          }
        }
      }

      this.buffer = obj;
    }

    if (this.size) {
      const temp = this.size.toString().split(',');

      let start = 0;
      let end: number | boolean = this.size;

      if (temp.length > 1 && temp[0] < temp[1]) {
        start = parseInt(temp[0]);
        end = start + parseInt(temp[1]);
      }

      const results: any = {};
      for (let i = start; i < end; i++) {
        if (this.buffer[i]) {
          results[i] = this.buffer[i];
        } else {
          break;
        }
      }

      this.buffer = results;
    }

    return this.buffer;
  }

  new(obj: any) {
    this.data_source = obj;
    this.buffer = obj;
  }

  limit(limit: any) {
    this.size = limit;

    return this;
  }

  select(filters: any) {
    this.options = filters;

    if (typeof filters === 'string' && filters !== '*') {
      this.options = filters.split(',');
    }

    this.buffer = this.data_source;
    this.size = false;
    return this;
  }

  where(field: any) {
    this.focused_field = field;

    return this;
  }

  // sets of conditions

  contains(str: string, caseSensitive: any) {
    if (caseSensitive == undefined) {
      caseSensitive == false;
    }
    const obj = this.buffer;
    this.buffer = [];

    for (const i in obj) {
      if (caseSensitive) {
        if (~obj[i][this.focused_field].indexOf(str)) {
          this.buffer.push(obj[i]);
        }
      } else if (~obj[i][this.focused_field].toLowerCase().indexOf(str.toLowerCase())) {
        this.buffer.push(obj[i]);
      }
    }

    return this;
  }

  match(regex: any, options?: any) {
    if (typeof regex === 'string' && regex !== '') {
      options = options || 'ig';

      regex = new RegExp(regex, options);

      const obj = this.buffer;
      this.buffer = [];

      for (const i in obj) {
        regex.lastIndex = 0;
        if (regex.exec(obj[i][this.focused_field])) {
          this.buffer.push(obj[i]);
        }
      }
    }
    return this;
  }

  equalTo(val: any) {
    const obj = this.buffer;
    this.buffer = [];

    for (const i in obj) {
      if (obj[i][this.focused_field] == val) {
        this.buffer.push(obj[i]);
      }
    }

    return this;
  }

  in(vals: any) {
    const obj = this.buffer;
    this.buffer = [];

    for (const i in obj) {
      if (this.in_array(obj[i][this.focused_field], vals)) {
        this.buffer.push(obj[i]);
      }
    }

    return this;
  }

  moreThan(val: any) {
    const obj = this.buffer;
    this.buffer = [];

    for (const i in obj) {
      if (parseFloat(obj[i][this.focused_field]) > parseFloat(val)) {
        this.buffer.push(obj[i]);
      }
    }

    return this;
  }

  moreThanOrEqualTo(val: any) {
    const obj = this.buffer;
    this.buffer = [];

    for (const i in obj) {
      if (parseFloat(obj[i][this.focused_field]) >= parseFloat(val)) {
        this.buffer.push(obj[i]);
      }
    }

    return this;
  }

  lessThan(val: any) {
    const obj = this.buffer;
    this.buffer = [];

    for (const i in obj) {
      if (parseFloat(obj[i][this.focused_field]) < parseFloat(val)) {
        this.buffer.push(obj[i]);
      }
    }

    return this;
  }

  lessThanOrEqualTo(val: any) {
    const obj = this.buffer;
    this.buffer = [];

    for (const i in obj) {
      if (parseFloat(obj[i][this.focused_field]) <= parseFloat(val)) {
        this.buffer.push(obj[i]);
      }
    }

    return this;
  }

  orderBy(field: any, mode?: any) {
    let sequence = 'asc';
    const target = field.split(' ');
    const temp = target.pop();

    if (temp && temp.toLowerCase() == 'desc') {
      sequence = 'desc';
      field = target.join(' ');
    }

    // prepare object
    const obj = [];
    for (var i in this.buffer) {
      obj.push([i, this.buffer[i][field]]);
    }

    if (obj.length < 2) {
      return this;
    }

    if (mode == undefined && isNaN(obj[0][1])) {
      mode = 'string';
    } else {
      mode = 'numeric';
    }

    if (mode == 'string') {
      obj.sort((a, b) => {
        if (a[1] < b[1]) return -1;
        if (a[1] > b[1]) return 1;
        return 0;
      });
    } else {
      obj.sort((a, b) => a[1] - b[1]);
    }

    let results = [];
    for (var i in obj) {
      results.push(this.buffer[obj[i][0]]);
    }

    this.buffer = results;
    if (sequence == 'desc') {
      this.buffer = this.buffer.reverse();
    }

    return this;
  }

  // helper
  in_array(val: any, list: any) {
    for (const i in list) {
      if (val == list[i]) {
        return true;
      }
    }

    return false;
  }
}

export default JQL;
