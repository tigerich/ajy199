var fs  = require("fs"),
	lineReader = require('line-reader'),
	input_file = 'ajy199_buildings.txt',
	output_file = 'output.html',
	page_num = 0,
	prev_num = 0,
	curr_num = 0,
	html_output = 
	'<html>\n'+
	'<head>\n' +
	'<meta http-equiv=Content-Type content="text/html;charset=utf-8">\n' +
	'<style type="text/css">\n' +
	'body{\n' +
    'margin-top: 0px; margin-bottom: 0px; margin-left: 0px; margin-right: 0px;\n' +
    'padding: 0;}\n' +
	'table {border-collapse:collapse; border: 0px;}\n' + 
	'th {font-size:12pt;}\n' +
	'td,tr,th {border:1px solid black;}\n' + 
	'.watermark {\n' +
		'background:url("stamp_small.gif");\n' +
		'background-position: right center;\n' +
		'background-repeat:no-repeat;\n' +
		'z-index: 1;\n' +
		'height:216px; \n' +
		'float:right;\n' +
        'align:right;\n' +
		'font-size:19px;\n' +
		'font-weight: bold;\n' +
	'}\n' +
	'P.breakhere {page-break-before: always}\n' +
	'</style>\n' +
	'</head><body>',
	page = 
	'<div align="center"><h3>金桥爱建园小区停车状况调查表 - 《门洞-%MDBH%》</h3></div>\n' +
	'<table align="center"><tr>%TH%</tr>\n' +
	'%TRLIST%' + 
	'</table><p>说明：<li>为了改善小区停车管理,金桥爱建园业委会联合小区云琦物业进行小区停车状况调查,请业主居民积极配合。\n'+ 
	'<li> “停车方式” 选择以下数字：<b>1.地下 2.固定 3.非固定 4.混合</b>' + 
	'<li> “缴费方式” 选择以下数字: <b>1:开票 2:撕票</b>' + 
	'<P CLASS="breakhere">\n',
	th = '<th>业主室号</th><th>停车方式</th><th>入住年月</th><th>缴费起始年月</th><th>缴费方式</th>';
	
Array.prototype.contains = function(k) {
  for(var i=0; i < this.length; i++){
    if(this[i] === k){
      return true;
    }
  }
  return false;
}

var trlist = '', 
	curr_page = '',
	room_num = 0,
	big_buildings = [1, 2, 5, 40];

lineReader.eachLine(input_file, function(line, last) {	
	line = line.trim();
	curr_num = parseInt(line);
	var len = curr_num.toString().length;
	room_num = parseInt(curr_num.toString()[len-1]);
	console.log (curr_num + " --> " + room_num);
	if( prev_num == 0 || curr_num < prev_num ){ //new page starts...
		page_num++;
		if( page_num > 1 ){ //output last page only here...
			curr_page = page.replace('%MDBH%', page_num-1);
			if(  big_buildings.contains(page_num-1) ){
				curr_page = curr_page.replace('%TH%', th+th+th);
			}
			else
				curr_page = curr_page.replace('%TH%', th+th);
			curr_page = curr_page.replace('%TRLIST%', trlist);
        	html_output += curr_page;
			trlist = '';
		}
	} 
	
	if( room_num == 1 ) 
		trlist += '<tr>';
		
	var num = big_buildings.contains(page_num) ? 3 : 2;
	trlist += '<td>'+curr_num+'</td>';
	for( var j = 0; j < 4; j++ ){
		trlist += '<td></td>';
	}
	
	if( room_num == num ){
		trlist += '</tr>';
	}
	prev_num = curr_num;

	if( last ) {
	 	curr_page = page.replace('%MDBH%', page_num);
		if(  big_buildings.contains(page_num) ){
			curr_page = curr_page.replace('%TH%', th+th+th);
		}
		else
			curr_page = curr_page.replace('%TH%', th+th);
        curr_page = curr_page.replace('%TRLIST%', trlist);
        html_output += curr_page;
		html_output += '</body></html>';
		fs.appendFileSync(output_file, html_output);
		console.log('file output.html successfully created');
	}
});
