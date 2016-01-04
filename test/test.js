var assert=require('assert'), Zygon=require('..');

describe('Zygon', function() {

  it('should', function() {
  });

});

function getOutput(cb) {
  var log=console.log, buf='';
  console.log=function(data) {
    buf+=data+'\n';
  };
  cb();
  console.log=log;
  return buf;
}
