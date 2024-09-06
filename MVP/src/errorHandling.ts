// Takes in a void function as an argument and runs it within
// a try catch block. Exit with error code 1 and display the
// error as per instructions.
export const ErrorWrapper = (func:()=>void, message:string) => {
  try{
    func();
  }catch(err){
    if(err instanceof Error){
      console.log(err.message, message)
    }else{
      console.log(message);
    }
    process.exit(1);
  }
};

// Takes in a function that must return something as an argument
// and run it within a try catch block. The argument function may
// have multiple paramenters which requires the usage of the spread operator.
// Exit with error code 1 and display the error as per instructions.
export const ErrorWrapperForReturns = <T>(func:(...args:any[])=>T, message:string, ...args:any[]) => {
  try{
    return func(...args);
  }catch(err){
    if(err instanceof Error){
      console.log(err.message, message)
    }else{
      console.log(message);
    }
    process.exit(1);
  }
};