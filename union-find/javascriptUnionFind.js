//------------------ UNION FIND CLASS ------------------//
class uf{
	constructor(nItems){
		// ARRAY OF OBJECTS TO TRACK WHICH PARENT NODE THEY POINT TO.
		this.obj = new Array(nItems).fill(1).map((r, rIndex)=> rIndex);

		// ARRAY OF CLUSTER SIZES FOR WEIGHING.
		this.sz = new Array(nItems).fill(1);
	}
	// GET ROOT OF OBJECT
	getRoot(i){
		while (i != this.obj[i]){
			this.obj[i] = this.obj[this.obj[i]];	// PATH COMPRESSION
			
			i = this.obj[i];	// GO UP THE TREE
		}
		return i;
	}
	// CHECK CONNECTIVITY
	isConnected(i, j){
		return this.getRoot(i) === this.getRoot(j);
	}
	// UNION
	union(i, j){
		// SAME OBJECT
		if (i === j) return;
		
		// GET ROOTS
		let rootI = this.getRoot(i);
		let rootJ = this.getRoot(j);

		// MERGE SMALLER CLUSTER TO LARGER CLUSTER
		if (this.sz[rootI] < this.sz[rootJ]){
			this.obj[rootI] = rootJ;
			this.sz[rootJ] += this.sz[rootI];
		}
		else{
			this.obj[rootJ] = rootI;
			this.sz[rootI] += this.sz[rootJ];
		}
	}
}


//-------------------- EXPORTATION ---------------------//
module.exports = uf;