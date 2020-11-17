//------------------------ IMPORT ----------------------//
const uf = require("./javascriptUnionFind.js");


//-------------------- INIT AND TEST -------------------//
// INIT
let nItems = 100;
let ufSystem = new uf(nItems);

// UNION: 0, 2
console.log("Is 0 and 2 connected? " + ufSystem.isConnected(0, 2));

console.log("Unionizing 0 and 2.");
ufSystem.union(0, 2);

console.log("Is 0 and 2 now connected? " + ufSystem.isConnected(0, 2));

console.log("Complex unions.");
ufSystem.union(2, 4);
ufSystem.union(9, 4);
ufSystem.union(3, 6);
console.log("Is 0 and 9 now connected? " + ufSystem.isConnected(0, 9));
console.log("Is 9 and 3 now connected? " + ufSystem.isConnected(9, 3));


// EXERCISE: VISUALIZE HOW IS 0 CONNECTED TO 9?