import { readFileSync } from 'fs';

function add(x: number, y: number): number {
    return x + y;
}

export function main(): number {
    //var fs = require('node:fs');
    console.log('Welcome to the main function block...');
    const urls = ReadUrlFile();

    console.log('This is the end of the main function ...  ');
    console.log(urls);
    return 0;
}

export function ReadUrlFile(): string[] {
    let fs: //wtf is this type ;
    var fileContents = fs.readFileSync('test.txt', 'utf8', function (err: Error, fileContents: string) {
        if (err) {
            //Follow Protocol
            console.error(err);
            return;
        }
    });
    const urls = fileContents.split('\n');

    let size = urls.length();
    for (let link = 0; link < size; link++) {
        console.log(urls[link]);
    }

    return urls;
}

const result = main();
console.log(result);
