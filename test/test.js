var assert=require('assert'), zygon=require('..');

require('colors');

describe('Cell padding', function() {

  it('should add correct amount of spaces', function() {
    assert.equal(zygon.cellPadding('test', 7).length, 7);
  });

  it('should cut off the string if required', function() {
    assert.equal(zygon.cellPadding('test123', 5), 'test\u2026');
  });

  it('should align left', function() {
    assert.equal(zygon.cellPadding('X', 3), 'X  ');
  });

  it('should align right', function() {
    assert.equal(zygon.cellPadding('X', 3, 'right'), '  X');
  });

  it('should center', function() {
    assert.equal(zygon.cellPadding('X', 3, 'center'), ' X ');
    assert.equal(zygon.cellPadding('X', 4, 'center'), ' X  ');
    assert.equal(zygon.cellPadding('X', 5, 'center'), '  X  ');
  });

  it('should return value if size===Infinity', function() {
    assert.equal(zygon.cellPadding('X', Infinity), 'X');
    assert.equal(
      zygon.cellPadding('123456789012345678901234567890', Infinity),
      '123456789012345678901234567890'
    );
  });

});

describe('Table renderer', function() {

  it('should render basic 1x1 table', function() {
    assert.equal('\n'+
      '  Test  \n'+
      '  1234  \n\n'
    , getOutput(function() {
      zygon([{name:'Test', size:4}], [[1234]], {notBold:true});
    }));
  });

  it('should skip empty rows', function() {
    assert.equal('\n'+
      '  Test  \n'+
      '  1234  \n\n'
    , getOutput(function() {
      zygon([{name:'Test', size:4}], [null,[1234],undefined,''], {notBold:true});
    }));
  });

  it('should render basic 1x1 table with printRow', function() {
    assert.equal(
      '  1234  \n'
    , getOutput(function() {
      var tbl=zygon([{name:'Test', size:4}], {notBold:true});
      tbl.printRow([1234]);
    }));
  });

  it('should render basic 1x2 table with printRows', function() {
    assert.equal(
      '  1234  \n'
    , getOutput(function() {
      var tbl=zygon([{name:'Test', size:4}], {notBold:true});
      tbl.printRows([[1234]]);
    }));
  });

  it('should use default colSize 20', function() {
    assert.equal(
      '\n  Test                  \n'+
      '  1234                  \n\n'
    , getOutput(function() {
      var tbl=zygon([{name:'Test'}], [[1234]], {notBold:true});
    }));
  });

  it('should use default colSize from options', function() {
    assert.equal(
      '\n  Test             \n'+
      '  1234             \n\n'
    , getOutput(function() {
      var tbl=zygon([{name:'Test'}], [[1234]], {notBold:true, colSize:15});
    }));
  });

  it('should render with correct spacing', function() {
    assert.equal('\n'+
      '     Test1       Test2     \n'+
      '     1234        567       \n'+
      '     89          0         \n\n'
    , getOutput(function() {
      zygon([
        {name:'Test1', size:7},
        {name:'Test2', size:5},
      ], [
        [1234, 567],
        [89, 0]
      ], {notBold:true, spacing:5});
    }));
  });

  it('should render array of objects', function() {
    assert.equal('\n'+
      '  Test1    Test2  \n'+
      '  1234       567  \n'+
      '  89           0  \n\n'
    , getOutput(function() {
      zygon([
        {name:'Test1', key:'a', size:7},
        {name:'Test2', key:'b', size:5, align:'right'},
      ], [
        {a:1234, b:567, c:'dummy'},
        {b:0, a:89}
      ], {notBold:true});
    }));
  });

  it('should show empty properties as empty string', function() {
    assert.equal('       \n', getOutput(function() {
      zygon([{name:'test', key:'nope', size:3}]).printRow({});
    }));
  });

  it('should render bold heading', function() {
    assert.equal(
      '\n  Test   '.bold+'\n'
    , getOutput(function() {
      var tbl=zygon([{name:'Test', size:5}]);
      tbl.printHead();
    }));

  });

  it('should render table with size:Infinity', function() {
    assert.equal('\n'+
      '  Person    Text  \n'+
      '  Doctor    You want weapons? We’re in a library! Books! The best weapons in the world!  \n'+
      '  Oswin     Run... run you clever boy... and remember  \n'+
      '  Doctor    Don\'t turn your back. Don\'t look away. And don\'t blink.  \n\n'
    , getOutput(function() {
      zygon([
        {name:'Person', size:8},
        {name:'Text', size:Infinity}
      ], [
        ['Doctor', 'You want weapons? We’re in a library! Books! The best weapons in the world!'],
        ['Oswin', 'Run... run you clever boy... and remember'],
        ['Doctor', 'Don\'t turn your back. Don\'t look away. And don\'t blink.']
      ], {notBold:true});
    }));
  });

  it('should render table using format and color functions', function() {
    assert.equal(
      '\n  Name          Balance  '.bold+'\n'+
      '  Rose          '+' +1275$'.green+'  \n'+
      '  Jack          '+'  -123$'.red+'  \n'+
      '  Donna         '+'    +2$'.green+'  \n'+
      '  Amy           '+'   +12$'.green+'  \n\n'
    , getOutput(function() {
      zygon([
        {
          name:'Name',
          size:12
        }, {
          name:'Balance',
          size:7,
          align:'right',
          format:function(val) {
            return (val<0 ? '' : '+')+val+'$';
          },
          color:function(val) {
            return val<0 ? 'red' : 'green';
          }
        },
      ], [
        ['Rose', 1275],
        ['Jack', -123],
        ['Donna', 2],
        ['Amy', 12]
      ]);
    }));
  });

  it('should render table using color function and string', function() {
    assert.equal(
      '\n  Name                    Ep.  '.bold+'\n'+
      '  '+'William Hartnell      '.cyan+'  '+'134  \n'+
      '  '+'Patrick Troughton     '.cyan+'  '+'119  \n'+
      '  '+'Jon Pertwee           '.cyan+'  '+'128  \n'+
      '  '+'Tom Baker             '.cyan+'  '+'172  \n'+
      '  '+'Peter Davison         '.cyan+'  '+' 69  \n'+
      '  '+'Colin Baker           '.cyan+'  '+' 31  \n'+
      '  '+'Sylvester McCoy       '.cyan+'  '+' 42  \n'+
      '  '+'Paul McGann           '.cyan+'  '+'  1  \n'+
      '  '+'Christopher Eccleston '.cyan+'  '+' 13  \n'+
      '  '+'David Tennant         '.cyan+'  '+' 47  \n'+
      '  '+'Matt Smith            '.cyan+'  '+' 44  \n'+
      '  '+'Peter Capaldi         '.cyan+'  '+'  ?'.red+'  \n\n'
    , getOutput(function() {
      var tbl=zygon([
        {name:'Name', size:22, color:'cyan'},
        {name:'Ep.', size:3, align:'right', color:function(val) {
          return isNaN(Number(val)) ? 'red' : null;
        }}
      ], [
        ['William Hartnell', 134],
        ['Patrick Troughton', 119],
        ['Jon Pertwee', 128],
        ['Tom Baker', 172],
        ['Peter Davison', 69],
        ['Colin Baker', 31],
        ['Sylvester McCoy', 42],
        ['Paul McGann', 1],
        ['Christopher Eccleston', 13],
        ['David Tennant', 47],
        ['Matt Smith', 44],
        ['Peter Capaldi', '?']
      ]);
    }));
  });

});

function getOutput(cb) {
  var write=process.stdout.write, buf='';
  process.stdout.write=function(data) {
    buf+=data;
  };
  try {
    cb();
    process.stdout.write=write;
  } catch(err) {
    process.stdout.write=write;
    throw err;
  }
  return buf;
}
