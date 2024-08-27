
interface Message
{
	lines: Array<string>; 
	isEmpty: boolean; 
	count: number;
	GetContents(): void;
	CountLines(): number;
}


class Note implements Message
{
	lines: Array<string> = new Array<string>(2);
	isEmpty: boolean = true;
	count: number = 0;
	constructor(contents: string)
	{
		this.isEmpty = false;
		this.lines[0] = contents;
		this.count = 1;
	}

	GetContents(): Array<string>
	{
		return this.lines;
	}	

	CountLines(): number
        {
                return this.count;
        }


}


class Messenger
{
	storage: Array<Message>;
	numStored: number;
	capacity: number;

	constructor()
	{
		this.storage = new Array<Message>(10);
		this.numStored = 0;
		this.capacity = 10;
	}


	ReadContent(message: Message)
	{
		var lineCount = message.CountLines();
		let content = message.GetContents();
		
		for (let line = 0; line < lineCount; line++)
		{
			console.log(content[line]);
		}
		
	}
}


let m = new Messenger();
let letter = new Note("Hello world");

m.ReadContent(letter);



