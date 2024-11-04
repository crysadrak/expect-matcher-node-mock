# Extend jest-expect matcher by native node test runner mock matchers
Extend for Jest [expect library](https://jestjs.io/docs/expect#expectextendmatchers).


Native node test runner does have diffrent mock structure from jest.mock therefore the extension of current methods is necessary.

## Content:

### toHaveBeenCalled
https://jestjs.io/docs/expect#tohavebeencalled

### toHaveBeenCalledTimes
https://jestjs.io/docs/expect#tohavebeencalledtimesnumber

### toHaveBeenCalledWith
https://jestjs.io/docs/expect#tohavebeencalledwitharg1-arg2-

### toHaveBeenLastCalledWith
https://jestjs.io/docs/expect#tohavebeenlastcalledwitharg1-arg2-

### toHaveBeenNthCalledWith
https://jestjs.io/docs/expect#tohavebeennthcalledwithnthcall-arg1-arg2-

### TODO
add all toHaveReturnedXX methods

