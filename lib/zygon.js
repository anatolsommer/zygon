/*!
 * zygon
 * Copyright(c) 2016 Anatol Sommer <anatol@anatol.at>
 * MIT Licensed
 */

'use strict';

var colors=require('colors/safe');

function zygon(cols, rows, opts) {
  var space;

  if (rows && !(rows instanceof Array)) {
    opts=rows;
    rows=null;
  }
  opts=opts || {};
  opts.output=opts.output || process.stdout;

  space=spaces(opts.spacing || 2);

  if (rows) {
    printHead();
    printRows(rows);
    end();
  }

  function printHead() {
    var th='\n'+space;
    cols.forEach(function(col) {
      col.size=col.size || opts.colSize || 20;
      th+=cellPadding(col.name, col.size, col.align)+space;
    });
    if (!opts.notBold) {
      th=colors.bold(th);
    }
    opts.output.write(th+'\n');
  }

  function printRow(row) {
    var tr=space, formated;
    row.forEach(function(val, i) {
      var color;
      if (typeof cols[i].format==='function') {
        formated=cols[i].format(val, row);
      } else {
        formated=val;
      }
      formated=cellPadding(formated, cols[i].size, cols[i].align);
      if (typeof cols[i].color==='function') {
        color=cols[i].color(val, row);
      } else if (typeof cols[i].color==='string') {
        color=cols[i].color;
      }
      if (color && colors[color]) {
        formated=colors[color](formated);
      }
      tr+=formated+space;
    });
    opts.output.write(tr+'\n');
  }

  function printRows(rows) {
    rows.forEach(printRow);
  }

  function end() {
    opts.output.write('\n');
  }

  return {
    printHead:printHead,
    printRow:printRow,
    printRows:printRows,
    end:end
  };
}

function cellPadding(str, len, align) {
  var width, half;
  str=str.toString();
  if (typeof align==='string') {
    align=align.toLowerCase();
  }
  if (strLen(str)>len) {
    str=str.substr(0, len-1)+'\u2026';
  }
  width=len-strLen(str);
  if (align==='right') {
    return spaces(width)+str;
  } else if (align==='center') {
    half=Math.floor(width/2);
    return spaces(half)+str+spaces(width-half);
  } else {
    return str+spaces(width);
  }
}

function spaces(len) {
  return Array(len+1).join(' ');
}

function strLen(str) {
  return str.replace(/\u001b\[\d+m/g, '').length;
}

zygon.cellPadding=cellPadding;

module.exports=zygon;
