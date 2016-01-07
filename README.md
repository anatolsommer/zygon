# Zygon
## Simple terminal table renderer


### Usage:
```zygon(columnsDefinition[, data][, options]);```

#### columnsDefinition
* name (string), **required**
* size (number or Infinity), default = options.size
* align (string), 'left', 'right' or 'center', default='left'
* color (string or function), ```function(val, row) { return color; }```
* format (function), ```function(val, row) { return newVal; }```

#### data
Array of Arrays

#### options
* size (number), default = 20
* spacing (number), spaces between columns, default = 2
* notBold (boolean), print heading without styles
* output (writable stream), default = ```process.stdout```

#### returns
an object:
* printHead()
* printRow( *Array* )
* printRows( *Array of arrays* )
* end()


### Examples:
```js
var zygon=require('zygon');

zygon([
  {name:'Actor', size:22},
  {name:'Episodes', size:8, align:'right'}
], [
  ['William Hartnell', 134],
  ['Patrick Troughton', 119],
  ['Jon Pertwee', 128]
]);
```
```

  Actor                   Episodes  
  William Hartnell             134  
  Patrick Troughton            119  
  Jon Pertwee                  128  
  Tom Baker                    172  

```


```js
var tbl=zygon([
  {name:'Actor', size:15},
  {name:'Episodes', size:8, align:'right'}
]);

tbl.printHead();

tbl.printRow(['Tom Baker', 172]);

tbl.printRows([
  ['Peter Davison', 69],
  ['Colin Baker', 31],
  ['Sylvester McCoy', 42],
  ['Paul McGann', 1]
]);

tbl.end();
```
```

  Actor            Episodes  
  Tom Baker             172  
  Peter Davison          69  
  Colin Baker            31  
  Sylvester McCoy        42  
  Paul McGann             1  

```


```js
zygon([
  {
    name:'Name',
    size:22,
    color:'blue'
  }, {
    name:'Episodes',
    size:8,
    align:'right',
    color:function(val) {
      return isNaN(Number(val)) ? 'red' : null;
    }
  }, {
    name:'Year',
    size:9,
    align:'center',
    format:function(yr) {
      return yr.length>1 ? yr[0]+'-'+yr[yr.length-1] : yr[0];
    }
  }
], [
  ['Christopher Eccleston', 13, [2005]],
  ['David Tennant', 47, [2005, 2006, 2007, 2008, 2009, 2010]],
  ['Matt Smith', 44, [2010, 2011, 2012, 2013]],
  ['Peter Capaldi', '?', [2013, 2014, 2015, 2016]]
], {
  spacing:3
});
```
```

   Name                     Episodes     Year     
   Christopher Eccleston          13     2005      
   David Tennant                  47   2005-2010   
   Matt Smith                     44   2010-2013   
   Peter Capaldi                   ?   2013-2016   

```


## License

#### MIT

