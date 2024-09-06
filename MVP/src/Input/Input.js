


function add(x: number, y: number): number {
  return x + y;
}

	
function main(){

	var fs = require('node:fs');
    	console.log("Welcome to the main function block...");
    

	const iters = ReadUrlFile(i);

	console.log('That took this many iterations:  ');
	console.log(iters);
	return 0;
}


function ReadUrlFile() {

	var fs = require('node:fs');
	let urls = [10];
	let i = 0; 

	const content = fs.readFile('test.txt', 'utf8', function (err, line)
	{

		if (err) {
            	console.error(err);
            	return;
        	}
		
		urls.push(line);
		console.log(urls[i]);
		i++;
    	});
	return 9;
}

let result = add(2,4);
console.log(result);


