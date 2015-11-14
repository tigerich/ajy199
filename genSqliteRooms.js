var fs  = require("fs"),
	lineReader = require('line-reader'),
	input_file = 'ajy199_rooms.txt',
	room_no = '';


lineReader.eachLine(input_file, function(line, last) {	
	line = line.trim();
	room_num = parseInt(line);
	console.log(room_num);
	} 
);