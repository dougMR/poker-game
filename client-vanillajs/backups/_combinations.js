// long-hand

// const ar = ["a", "b", "c", "d", "e"];
// const comboLength = 3;

// const combos = [];
// for (let i = 0; i <= ar.length - comboLength; i++) {
//     // console.log("i -> ", i);
//     for (let j = i + 1; j <= ar.length - (comboLength - 1); j++) {
//         // console.log("j -> ", j);
//         for (let k = j + 1; k <= ar.length - (comboLength - 2); k++) {
//             // console.log("k -> ", k);
//             combos.push([ar[i], ar[j], ar[k]]);
//         }
//     }
// }
// console.log(combos);

// recursive version by google search AI
// function getCombinations(array, depth) {

//     if (depth === 0) {
//         return [[]];
//     }

//     const results = [];
//     for (let i = 0; i < array.length; i++) {
//         const rest = array.slice(i + 1);
//         const newCombinations = getCombinations(rest, depth - 1);
//         for (let j = 0; j < newCombinations.length; j++) {
//             // results.push([array[i]].concat(newCombinations[j]));
//             results.push([array[i], ...newCombinations[j]]);
//         }
//     }
//     return results;
// }

// recursive version by google search AI
function getCombinations(array, depth, allowDuplicates) {
    allowDuplicates = false;
    // console.log('getCombinations():',array.length,depth,allowDuplicates);
    if (depth === 0) {
        return [[]];
    }

    const results = [];
    for (let i = 0; i < array.length; i++) {
        const rest = allowDuplicates ? array : array.slice(i + 1);
        const newCombinations = getCombinations(rest, depth - 1,allowDuplicates);
        for (let j = 0; j < newCombinations.length; j++) {
            // results.push([array[i]].concat(newCombinations[j]));
            results.push([array[i], ...newCombinations[j]]);
            
        }
    }
    // if(j===newCombinations.length-1 && i === array.length-1){
        // console.log('results:',results);
    // }
    return results;
}

export { getCombinations };
