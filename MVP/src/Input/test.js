function add(x, y) {
    return x + y;
}
function main() {
    //var fs = require('node:fs');
    console.log('Welcome to the main function block...');
    var urls = ReadUrlFile();
    console.log('This is the end of the main function ...  ');
    console.log(urls);
    return 0;
}
function ReadUrlFile() {
    var fs = require('node:fs');
    var urls = Array(10);
    var i = 0;
    var content = fs.readFileSynch('test.txt', 'utf8', function (err, line) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(line);
    });
    for (var item in content) {
        console.log(item);
    }
    return content;
}
var result = main();
console.log(result);
