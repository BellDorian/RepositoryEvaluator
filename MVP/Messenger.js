var Note = /** @class */ (function () {
    function Note(contents) {
        this.lines = new Array(2);
        this.isEmpty = true;
        this.count = 0;
        this.isEmpty = false;
        this.lines[0] = contents;
        this.count = 1;
    }
    Note.prototype.GetContents = function () {
        return this.lines;
    };
    Note.prototype.CountLines = function () {
        return this.count;
    };
    return Note;
}());
var Messenger = /** @class */ (function () {
    function Messenger() {
        this.storage = new Array(10);
        this.numStored = 0;
        this.capacity = 10;
    }
    Messenger.prototype.ReadContent = function (message) {
        var lineCount = message.CountLines();
        var content = message.GetContents();
        for (var line = 0; line < lineCount; line++) {
            console.log(content[line]);
        }
    };
    return Messenger;
}());
var m = new Messenger();
var letter = new Note("Hello world");
m.ReadContent(letter);
