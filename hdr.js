var parseHDR = require('parse-hdr')
var fs = require('fs')
var data = fs.readFileSync('spruit_sunrise_1k.hdr');
	  var img = parseHDR(data)
var buffer = new Buffer(img.data.length*4);


    for(var i = 0; i < img.data.length; i++){
	            //write the float in Little-Endian and move the offset
	    buffer.writeFloatLE(img.data[i], i*4);
	  }
	  fs.writeFileSync('spruit_sunrise_1k.bin', buffer);
	  

