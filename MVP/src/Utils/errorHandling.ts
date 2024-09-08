//     Project :    Module Evaluation Tool
//   Component :    Error Handling Function Component
//       Owner :    Jorge Puga Hernandez
// Last update :    07 September 2024 -- EST 03:12

/**
 * Wraps a void function in a try-catch block, handling
 * any errors that occur during its execution. If an error
 * is caught, it logs the error message and exits with return code 1.
 *
 * @param {() => void} func - The function to execute, which should not have any return values.
 * @param {string} message - The error message that is displayd if an error occurs.
 *
 */
export const ErrorWrapper = (func: () => void, message: string) => {
    try {
        func();
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.message, message);
        } else {
            console.log(message);
        }
        process.exit(1);
    }
};

/**
 * Wraps a function that returns a value in a try-catch block,
 * handling any errors that occur during its execution. This
 * function can accept multiple parameters. If an error is
 * caught, it logs the error message and exits with return code 1.
 *
 * @template T - The return type of the function being wrapped (generic).
 * @param {(...args: any[]) => T} func - The function to execute which returns T.
 * @param {string} message - The error message to display if an error occurs.
 * @param {...any[]} args - The arguments to pass to the function.
 * @returns {T} - The result of the function if no error occurs.
 *
 */
export const ErrorWrapperForReturns = <T>(func: (...args: any[]) => T, message: string, ...args: any[]) => {
    try {
        return func(...args);
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.message, message);
        } else {
            console.log(message);
        }
        process.exit(1);
    }
};
