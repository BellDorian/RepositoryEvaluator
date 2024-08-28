
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



class Report { }
class Module { }


let modSet = IdentifyTargets(): Array<Module> => {
	// Read from the console
	// Possibly prompt?
	// Handle the task of connecting the user input to the desired target modules
	// e.g. if I send you the string "x" then identify that as module x and work
	// accordingly or something
}


let failCount = ShareResults(finalReport: Array<Report>): Number =>{
	
	var failures = finalReport.size();
	Boolean printSucceeded = false;
	
	for (var entry in finalReport)
	{
		printSucceeded = entry.Print();
		if(!printSucceeded) {
			++failures;
		}
		
	}
	
	return failures;
}


let finalReport = GenerateFinalReport(targetSet: Array<Modules>): Array<Report> => {
	
	const size = modSet.Size();
	let reportSet = new Array<Report>(size);


	for (var entry in reportSet; var target in targetSet)
        {
               	// I'm not sure if you can overload functions in this lang
		entry = report.Evaluate(target);
		// console.log(entry);
        }
        
	return reportSet;
}


let report = Evaluate(target: TargetModule): Report => {
	// Do tests on the targeted module
	var rampUp = Score_Rampup(target);
	var correctness = Score_Correctness(target);
	var busFactor = Score_BusFactor(target);
	var response = Score_Response(target);
	var licenseMatch = Score_LicenseMatch(target);
	
	return new Report(target, rampUp, correctness, busFactor, response, licenseMatch);
}













// ========== Processing ==========


