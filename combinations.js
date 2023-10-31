// long-hand
/*
const ar = ["a", "b", "c", "d", "e"];
const comboLength = 3;

const combos = [];
for (let i = 0; i <= ar.length - comboLength; i++) {
    console.log("i -> ", i);
    for (let j = i + 1; j <= ar.length - (comboLength - 1); j++) {
        console.log("j -> ", j);
        for (let k = j + 1; k <= ar.length - (comboLength - 2); k++) {
            console.log("k -> ", k);
            combos.push([ar[i], ar[j], ar[k]]);
        }
    }
}
console.log(combos);
*/

// recursive version by google search AI
function getCombinations(array, n) {
    if (n === 0) {
        return [[]];
    }

    const results = [];
    for (let i = 0; i < array.length; i++) {
        const rest = array.slice(i + 1);
        const newCombinations = getCombinations(rest, n - 1);
        for (let j = 0; j < newCombinations.length; j++) {
            // results.push([array[i]].concat(newCombinations[j]));
            results.push([array[i], ...newCombinations[j]]);
        }
    }
    return results;
}

export { getCombinations };