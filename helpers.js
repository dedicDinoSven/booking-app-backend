// this function takes two arrays A, B and returns a new array of items that are present in A but not in B. 
// something like this: 
// arrA = ['a', 'b', 'c', 'd'];     arrB = ['c', 'd', 'e', 'f'];
// difference(arrA, arrB) returns: ['a', 'b'] present in arrA but not in arrB
// difference(arrB, arrA) returns: ['e', 'f'] present in arrB but not in arrA
exports.difference = (A, B) => {
    const arrA = Array.isArray(A) ? A.map(x => x.toString()) : [A.toString()];
    const arrB = Array.isArray(B) ? B.map(x => x.toString()) : [B.toString()];
  
    const result = [];
    for (const p of arrA) {
      if (arrB.indexOf(p) === -1) {
        result.push(p);
      }
    }
  
    return result;
  }