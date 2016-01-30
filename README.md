# Zygon
Simple terminal table renderer


### Usage:
```zygon(columnsDefinition[, data][, options]);```

#### columnsDefinition
* name (string), **required**
* key (string), **required for rendering arrays of objects**
* size (number or Infinity), default = options.size
* align (string), 'left', 'right' or 'center', default='left'
* color (string or function), ```function(val, row) { return color; }```
* format (function), ```function(val, row) { return newVal; }```

#### data
Array of arrays or array of objects (if "key" was defined for columns)

#### options
* size (number), default = 20
* spacing (number), spaces between columns, default = 2
* notBold (boolean), print heading without styles
* output (writable stream), default = ```process.stdout```

#### returns
an object
* printHead()
* printRow( *array or object* )
* printRows( *array of arrays or objects* )
* end()


### Examples
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


#### Render streamed data
```js
var tbl=zygon([
  {name:'Actor', size:15},
  {name:'Episodes', size:8, align:'right'}
]);

tbl.printHead();

tbl.printRow(['Tom Baker', 172]);

tbl.printRow(['Peter Davison', 69]);

tbl.printRows([
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


#### Arrays of objects / color and format functions / spacing option
```js
zygon([
  {
    name:'Name',
    key:'name',
    size:22,
    color:'blue'
  }, {
    name:'Episodes',
    key:'ep',
    size:8,
    align:'right',
    color:function(val) {
      return isNaN(Number(val)) ? 'red' : null;
    }
  }, {
    name:'Year',
    key:'yrs',
    size:9,
    align:'center',
    format:function(yrs) {
      return yrs.length>1 ? yrs[0]+'-'+yrs[yrs.length-1] : yrs[0];
    }
  }
], [
  {name:'Christopher Eccleston', ep:13, yrs:[2005]},
  {name:'David Tennant', ep:47, yrs:[2005, 2006, 2007, 2008, 2009, 2010]},
  {name:'Matt Smith', ep:44, yrs:[2010, 2011, 2012, 2013]},
  {name:'Peter Capaldi', ep:'?', yrs:[2013, 2014, 2015, 2016]}
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


## Tests
Run tests with `npm test` or generate coverage reports with `npm run test-cov`.


## License
#### MIT

