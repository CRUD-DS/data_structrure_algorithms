//------------------- CONSTRUCTORS ---------------------//
class Node{
	constructor(id, val){
		this.id = id;
		this.val = val;
		this.left = null;
		this.right = null;
		this.isRed = true;
	}
	getVal(index){
		return this.val[index];
	}
}
class bst{
	//-------------------- CONSTRUCTOR ---------------------//
	constructor(nDim){
		this.root = null;
		this.nDim = nDim;
	}
	//----------------- R-B IMPLEMENTATION -----------------//
	// CHECK IF NODE IS RED
	isRed(node){
		// EMPTY NODES ARE B
		if (!node) return false;
		return node.isRed;
	}
	// ROTATIONS
	rotateLeft(node){
		// ROTATE
		let s = node.right;
		node.right = s.left;
		s.left = node;
		// RELABEL REDNESS
		s.isRed = node.isRed;
		node.isRed = true;
		return s;
	}
	rotateRight(node){
		// ROTATE
		let s = node.left;
		node.left = s.right;
		s.right = node;
		// RELABEL REDNESS
		s.isRed = node.isRed;
		node.isRed = true;
		return s;
	}
	flipColor(node){
		node.left.isRed = false;
		node.right.isRed = false;
		node.isRed = true;
	}

	//---------------------- ADD KEY -----------------------//
	addKey(id, val){
		this.root = this.addKeyPriv(this.root, id, val, 0);
	}
	addKeyPriv(node, id, val, depth){
		if (!node) return new Node(id, val);

		// LEFT / RIGHT TREE
		let valIndex = depth%this.nDim;
		if (val[valIndex] < node.getVal(valIndex)) node.left = this.addKeyPriv(node.left, id, val, depth + 1);
		else if (val[valIndex] > node.getVal(valIndex)) node.right = this.addKeyPriv(node.right, id, val, depth + 1);
		else node.val = val;

		// BALANCING USING R-B LABELS
		// WRONG DIRECTION
		// if (this.isRed(node.right)){
		// 	if (!this.isRed(node.left)){
		// 		node = this.rotateLeft(node);
		// 	}
		// }
		// // DOUBLE RED
		// if (this.isRed(node.left)){
		// 	if (this.isRed(node.left.left)){
		// 		node = this.rotateRight(node);
		// 	}
		// }
		// // RAISE
		// if (this.isRed(node.right)){
		// 	if (this.isRed(node.left)){
		// 		this.flipColor(node);
		// 	}
		// }

		// RETURN NODE
		return node;
	}
	//--------------------- ITERATION ----------------------//
	// LEFT > ROOT > RIGHT
	inOrder(){
		let stack = [this.root];
		let values = [];
		let currentNode;

		// LIFO STACK INSTEAD OF RECURSIVE DFS
		while (stack.length > 0){
			currentNode = stack.pop();
			if (currentNode){
				if (currentNode.right){
					stack.push(currentNode.right);
					stack.push(new Node(currentNode.id, currentNode.val));	// EMPTY NODE FOR VALUE ADDITION PURPOSE
					if (currentNode.left){
						stack.push(currentNode.left);
					}
				}
				else if (currentNode.left){
					stack.push(new Node(currentNode.id, currentNode.val));
					stack.push(currentNode.left);
				}
				else{
					values.push({key: currentNode.id, val: currentNode.val});
				}
			}
		}
		return values;
	}
	// ROOT > LEFT > RIGHT
	preOrder(){
		let stack = [this.root];
		let values = [];
		let currentNode;

		// LIFO STACK INSTEAD OF RECURSIVE DFS
		while (stack.length > 0){
			currentNode = stack.pop();
			if (currentNode){
				if (currentNode.right){
					stack.push(currentNode.right);
					if (currentNode.left){
						stack.push(currentNode.left);
					}
					stack.push(new Node(currentNode.id, currentNode.val));	// EMPTY NODE FOR VALUE ADDITION PURPOSE
				}
				else if (currentNode.left){
					stack.push(currentNode.left);
					stack.push(new Node(currentNode.id, currentNode.val));
				}
				else{
					values.push({key: currentNode.id, val: currentNode.val});
				}
			}
		}
		return values;
	}
	// LEFT > RIGHT > ROOT
	postOrder(){
		let stack = [this.root];
		let values = [];
		let currentNode;

		// LIFO STACK INSTEAD OF RECURSIVE DFS
		while (stack.length > 0){
			currentNode = stack.pop();
			if (currentNode){
				if (currentNode.right){
					stack.push(new Node(currentNode.id, currentNode.val));	// EMPTY NODE FOR VALUE ADDITION PURPOSE
					stack.push(currentNode.right);
					if (currentNode.left){
						stack.push(currentNode.left);
					}
				}
				else if (currentNode.left){
					stack.push(new Node(currentNode.id, currentNode.val));
					stack.push(currentNode.left);
				}
				else{
					values.push({id: currentNode.id, val: currentNode.val});
				}
			}
		}
		return values;
	}
}
class nnSearch extends bst{
	constructor(nDim){
		super(nDim);
	}
	search(point){
		return this.searchPriv(this.root, point, 0, Infinity,  new Array(this.nDim).fill(1));
	}
	dist(point1, point2){
		let dist = 0;
		point1.forEach((r,rIndex)=> dist += (r - point2[rIndex])**2);
		return dist;
	}
	searchPriv(node, point, depth, bestDist, bestPoint){
		// EMPTY NODE
		if (!node) return [bestDist, bestPoint];

		// VAR DECLARATION
		let dimIndex = depth%this.nDim, perpendDist, currentDist;
		let firstNode, secondNode;

		// CURRENT DISTANCE
		currentDist = this.dist(node.val, point);
		perpendDist = (node.val[dimIndex] - point[dimIndex])**2;

		if (currentDist < bestDist){
			bestDist = currentDist;
			bestPoint = node.val;
		}

		// POINT IS TO THE RIGHT OF CURRENT NODE
		if (node.val[dimIndex] < point[dimIndex]) {
			firstNode = node.right;
			secondNode = node.left;
		}
		// POINT IS TO THE LEFT OF CURRENT NODE
		else{
			firstNode = node.left;
			secondNode = node.right;
		}
		[bestDist, bestPoint] = this.searchPriv(firstNode, point, depth + 1, bestDist, bestPoint);

		// ONLY CHECK IF THE BEST DISTANCE IS GREATER THAN THE PERPENDICULAR DISTANCE
		if (perpendDist <= bestDist){
			[bestDist, bestPoint] = this.searchPriv(secondNode, point, depth + 1, bestDist, bestPoint);
		}

		return [bestDist, bestPoint];
	}
}


//-------------------- INIT & TEST ---------------------//
// VAR DECLARATION
let index;

// INIT
let nDim = 3;
let nItems = 1000000;
let nnSystem = new nnSearch(nDim);
let items = new Array(nItems).fill(1).map(r=>new Array(nDim).fill(1).map(r=> Math.random()));

// INSERT
console.time("BST Insert");
items.forEach((r, rIndex)=> nnSystem.addKey(rIndex, r));
console.timeEnd("BST Insert");

// FIND CLOSEST POINT
let point = new Array(nDim).fill(1).map(r=> Math.random());


//-------------------- BRUTE FORCE ---------------------//
let bestDist = Infinity, bestPoint;
let currentDist;
console.time("BRUTE");
for (index = 0; index < nItems; index++){
	currentDist = 0;
	point.forEach((r,rIndex)=> currentDist += (r - items[index][rIndex])**2);
	if (currentDist < bestDist){
		bestDist = currentDist;
		bestPoint = items[index];
	}
}
console.timeEnd("BRUTE");
console.log("BRUTE: ", bestDist, bestPoint);


//------------------------ BST -------------------------//
console.time("BST");
[bestDist, bestPoint] = nnSystem.search(point);
console.timeEnd("BST");
console.log("BST: ", bestDist, bestPoint);
