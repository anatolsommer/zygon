/*!
 * zygon
 * Copyright(c) 2016 Anatol Sommer <anatol@anatol.at>
 * MIT Licensed
 */
/* globals require,process,module */
/* jshint strict:global */

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

  function renderCell(row, col, val, i) {
    var color, formated;
    if (typeof col.format==='function') {
      formated=col.format(val, row);
    } else {
      formated=val;
    }
    formated=cellPadding(formated, col.size, col.align);
    if (typeof col.color==='function') {
      color=col.color(val, row);
    } else if (typeof col.color==='string') {
      color=col.color;
    }
    if (color && colors[color]) {
      formated=colors[color](formated);
    }
    return formated+space;
  }

  function printRow(row) {
    var tr=space;

    if (row && row instanceof Array) {
      row.forEach(function(val, i) {
        tr+=renderCell(row, cols[i], val, i);
      });
    } else if (typeof row==='object' && row!==null) {
      cols.forEach(function(col, i) {
        tr+=renderCell(row, col, row[col.key], i);
      });
    } else {
      return;
    }

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

function cellPadding(val, len, align) {
  var width, half;
  val=(typeof val==='undefined' ? '' : val).toString();
  if (len===Infinity) {
    return val;
  }
  if (typeof align==='string') {
    align=align.toLowerCase();
  }
  if (strLen(val)>len) {
    val=val.substr(0, len-1)+'\u2026';
  }
  width=len-strLen(val);
  if (align==='right') {
    return spaces(width)+val;
  } else if (align==='center') {
    half=Math.floor(width/2);
    return spaces(half)+val+spaces(width-half);
  } else {
    return val+spaces(width);
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
