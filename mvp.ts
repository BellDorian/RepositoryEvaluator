
/* 1. Support input from command line args
// 2. Be primarily written in TS
// 3. Print all output to stdout for now, but have ability to change that
// 4. Each repo should be accompanied by an overall score and sub-scores
        - ramp-up time
        - correctness
        - bus factor
        - responsiveness
        - license compatibility
*/  

// === ReadInput ===
// - Take in input from somewhere
//      - Start by making it support command line 
// === Process Input ===
//  - Manipulate input as needed (e.g. transform it into output data)
// === SendOutput ===
// - Send the result of the processing somewhere
//      - Default output to stdout


class Tool
{
    // class member Reader
        //   - Reads input from different sources and formats
        //   - Processes input to be useful to us
    // class member Evaluator
        //   - Handles actual computation / evaluation tasks
    // class member Messenger
        //   - Conveys results to a given client

    // Primary (topmost) method of the class Tool / of the program
    function Run() :
    {
        var objectsToEvaluate = Reader.ReadInput();
        var results = Evaluator.Evaluate(objectsToEvaluate);
        Messenger.SendOutput(results);
    }

}
