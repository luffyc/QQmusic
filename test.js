//异步
// var fs = require('fs');
// fs.readdir('./musics/',function(err,files){
// 	console.log(files);
// })
// console.log(1);


// var exec = require('child_process');
// var mingling ='ffprobe -v quiet -print_format json -show_format ./musics/BINGBANGLOSER.mp3';
// var data = exec.exec(mingling,function(err,data){
// 	console.log(data);
// })


//同步
// var fs = require('fs');
// var files = fs.readdirSync('./musics/');
// console.log(files);
// console.log(1);


var fs = require('fs');
var files = fs.readdirSync('./musics/');
var exec = require('child_process');
var database = [];

var format_duration = function(str){
	var num = Number(str);
	var fen = parseInt( num/60 );
	var miao = Math.round( num%60 );
	miao = (miao < 10 ) ? ( '0' + miao ):miao;
	return fen + ':' + miao;
}

files.forEach(function(v,i){
	var mingling ='ffprobe -v quiet -print_format json -show_format "./musics/' + v + '"';
	var data = JSON.parse( exec.execSync(mingling) );
	var duration = format_duration(data.format.duration);
	var r = {
		filename: data.format.filename,
        duration: duration,
        title: data.format.tags.title,
        album: data.format.tags.album,
        artist: data.format.tags.artist
	}
	database.push( r );
})
fs.writeFile('./database.json',JSON.stringify(database,null,2));