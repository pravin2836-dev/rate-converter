// const { v4: uuidv4 } = require('uuid');
// exports.uuid = uuidv4();
const moment = require('moment');
const { postcodeValidator } = require('postcode-validator');
exports.getJson = function getJson(result) {
  if (result instanceof String || typeof (result) === 'string') {
    result = JSON.parse(result);
  }
  return result;
};

exports.isError = function isError(error) {
  return !exports.isEmpty(error);
};

exports.isValidResponse = function isValidResponse(err, results) {
  return exports.isNull(err) && exports.isNotEmpty(results);
};

exports.isNull = function isNull(item) {
  return item == null || item == '' || typeof item == 'undefined';
};

exports.isNotNull = function isNotNull(item) {
  return item != null && item != '' && typeof item != 'undefined';
};

exports.isNotEmpty = function isNotEmpty(item) {
  return item != null && item != '' && typeof item != 'undefined' && item.length > 0;
};

exports.isValidDate = function isValidDate(date) {
  return moment(date).isValid();
};

exports.groupByKey = function groupByKey(result, key) {
  var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  return groupBy(result, key);
};

exports.dateFormate = function dateFormate(date, format) {
  //returns date in MM/DD/YYYY formate
  var converDate = new Date();
  if (date) {
    converDate = date;
  }
  var dateObj = new Date(converDate);
  var month = dateObj.getUTCMonth();
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  if (format && format === 'YYMMDD') {
    return '' + year + '/' + month + '/' + day + '';
  } else if (format && format === 'DDMMYY') {
    return '' + (day + 1) + '/' + (month + 1) + '/' + year + '';
  } else if (format && format === 'DD_MM_YY') {
    return '' + day + '_' + (month + 1) + '_' + year + '';
  } else {
    return '' + month + '/' + day + '/' + year + '';
  }

};

exports.findArrayObjectByKeyValue = function (array, key, value) {
  for (var i = 0; i < array.length; i++) {
    if (array[i][key] === value) {
      return array[i];
    }
  }
  return null;
};

exports.findByMatchingProperties = function (set, properties) {
  return set.filter(function (entry) {
    return Object.keys(properties).every(function (key) {
      return entry[key] === properties[key];
    });
  });
};



exports.arrayToCommaString = function (input) {
  var string = '';
  for (var i = 0; i < input.length; i++) {
    if (i === input.length - 1) {
      string = string + input[i] + '';
    } else {
      string = string + input[i] + ',';
    }
  }
  return string;
};

exports.arrayToTabString = function (input) {
  var string = '';
  for (var i = 0; i < input.length; i++) {
    if (i === input.length - 1) {
      string = string + input[i] + '';
    } else {
      string = string + input[i] + '\t';
    }
  }
  return string;
};

exports.objectToCommaString = function (input) {
  var string = '';
  for (var key in input) {
    string = string + input[key] + ',';
  }
  return string;
};
exports.objectToTabString = function (input) {
  var string = '';
  for (var i in input) {
    string = string + input[i] + '\t';
  }
  return string;
};

exports.valuePresentInArray = function (array, value) {
  var present = false;
  if (this.isNotNull(array) && (array instanceof Array && array.indexOf(value) > -1)) {
    return true;
  }
  return present;
};

exports.getFirstDateOfMonth = function (mm, yyyy) {
  return (new Date((new Date(yyyy, mm, 1))));
};

exports.getLastDateOfMonth = function (mm, yyyy) {
  return (new Date((new Date(yyyy, mm + 1, 1)) - 1));
};

exports.getTimeInms = function () {
  var currentDate = new Date();
  return currentDate.getTime();
};

exports.getLastMonthAndYear = function () {
  var d = new Date();
  d.setMonth(d.getMonth(), 0);
  return [d.getMonth(), d.getFullYear()];
};

exports.uniqueArray = function (array) {
  var arr = [];
  for (var i = 0; i < array.length; i++) {
    if (arr.indexOf(array[i]) === -1) {
      if (array[i]) {
        arr.push(array[i]);
      }
    }
  }
  return arr;
};

exports.convertToTwoDigit = function convertToTwoDigit(n) {
  return n > 9 ? '' + n : '0' + n;
};

exports.getSeconds = function (oldDate, newDate) {
  if (newDate === undefined || newDate === null) {
    newDate = new Date();
  }
  return Math.abs((new Date(newDate).getTime() - new Date(oldDate).getTime()) / 1000);
};

exports.validatePostCode = function (postcode, countryCode) {
  return postcodeValidator(postcode, countryCode);
};

exports.metaDataForPagination = function (url, count, page, limit, regex, replaceString) {
  let metaData = {
    self: '',
    previous: '',
    next: '',
    totalPages: 0,
    totalRecords: 0
  };
  if(!regex){
    regex = /p+a+g+e=[0-9]/gi;
  }
  if(!replaceString){
    replaceString = 'page=';
  }
  metaData.self = url;
  metaData.totalRecords = count;
  metaData.totalPages = Math.ceil(count / limit);
  if (page <= metaData.totalPages) {
    if (page != 1) {
      let previousPage = +page - 1;
      metaData.previous = url.replace(regex, `${replaceString}${previousPage}`);
    }
    if (page != metaData.totalPages) {
      let nextPage = +page + 1;
      metaData.next = url.replace(regex, `${replaceString}${nextPage}`);
    }
  }
  return metaData;
};

module.exports.average = (list)=>{
  if(list.length > 0){
    let sumNum = list.reduce((prevNum, currNum)=> parseInt(prevNum,10) + parseInt(currNum, 10));
    return sumNum/(list.length);
  }else{
    return 0;
  }
};

module.exports.sortObject = (inputObject) => {
  let objectKeys = Object.keys(inputObject);
  objectKeys = objectKeys.sort();
  let outputObject = {};
  objectKeys.map((key)=>{
    outputObject[key] = inputObject[key];
  });
  return outputObject;
};